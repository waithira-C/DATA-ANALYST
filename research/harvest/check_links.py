"""Check every URL in research/catalog/resources.json (stdlib only).

Usage:
    python -I research/harvest/check_links.py [--workers 16] [--timeout 20]

For each entry it tries HEAD, then falls back to GET (some servers reject HEAD).
Results go to research/catalog/link_report.json and each entry in
resources.json gets "dead": true when the link is broken (the key is removed
when it is fine). 403/429 and similar bot-blocking responses are treated as
alive-but-blocked, not dead.
"""
import argparse
import concurrent.futures as cf
import datetime as dt
import json
import os
import socket
import ssl
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CATALOG = os.path.normpath(os.path.join(HERE, "..", "catalog", "resources.json"))
REPORT = os.path.normpath(os.path.join(HERE, "..", "catalog", "link_report.json"))

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
# Statuses that mean "the server is up but refuses automated clients".
BLOCKED = {401, 403, 405, 406, 429, 451, 503, 999}
DEAD = {404, 410}


def _request(url, method, timeout, verify=True):
    req = urllib.request.Request(url, headers=HEADERS, method=method)
    ctx = ssl.create_default_context() if verify else ssl._create_unverified_context()
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        if method == "GET":
            resp.read(2048)  # read a little so the server completes the response
        return resp.status, resp.geturl()


def check(url, timeout):
    """Return dict(status, final_url, verdict, error)."""
    # YouTube answers 200 even for removed videos, so ask its oEmbed endpoint,
    # which returns 401/403 (embedding disabled) or 404 (gone) instead.
    if "youtube.com/watch" in url or "youtube.com/playlist" in url:
        oembed = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(url, safe="")
        try:
            status, _ = _request(oembed, "GET", timeout)
            return {"status": status, "final_url": url, "verdict": "ok", "error": None}
        except urllib.error.HTTPError as e:
            if e.code in (400, 404):
                return {"status": e.code, "final_url": url, "verdict": "dead",
                        "error": "YouTube oEmbed %d (video/playlist unavailable)" % e.code}
            if e.code in (401, 403):
                return {"status": e.code, "final_url": url, "verdict": "blocked",
                        "error": "YouTube oEmbed %d (embedding disabled or private)" % e.code}
        except Exception:  # noqa: BLE001 - fall through to a normal page check
            pass
    last_err, status, final = None, None, None
    for method in ("HEAD", "GET"):
        try:
            status, final = _request(url, method, timeout)
            return {"status": status, "final_url": final, "verdict": "ok", "error": None}
        except urllib.error.HTTPError as e:
            status, last_err = e.code, "HTTP %d" % e.code
            if method == "HEAD":
                continue  # many servers mishandle HEAD; retry with GET
        except (urllib.error.URLError, socket.timeout, TimeoutError, ConnectionError, ssl.SSLError) as e:
            last_err = "%s: %s" % (type(e).__name__, getattr(e, "reason", e))
            status = None
            if method == "HEAD":
                continue
        except Exception as e:  # noqa: BLE001 - report anything unexpected
            last_err = "%s: %s" % (type(e).__name__, e)
            status = None
            if method == "HEAD":
                continue
    if last_err and "CERTIFICATE_VERIFY_FAILED" in last_err:
        # Often an incomplete certificate chain that browsers repair themselves.
        # Retry without verification; if the page loads, count it as alive.
        try:
            status, final = _request(url, "GET", timeout, verify=False)
            return {"status": status, "final_url": final, "verdict": "ok_ssl_warning",
                    "error": "certificate could not be verified locally"}
        except urllib.error.HTTPError as e:
            status, last_err = e.code, "HTTP %d (unverified TLS)" % e.code
        except Exception as e:  # noqa: BLE001
            last_err = "%s: %s" % (type(e).__name__, e)
    if status in BLOCKED:
        verdict = "blocked"
    elif status in DEAD:
        verdict = "dead"
    elif status is not None and 500 <= status < 600:
        verdict = "error"  # server error: transient, flagged dead below
    elif status is None:
        verdict = "unreachable"
    else:
        verdict = "dead"
    return {"status": status, "final_url": final, "verdict": verdict, "error": last_err}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--workers", type=int, default=16)
    ap.add_argument("--timeout", type=float, default=20.0)
    args = ap.parse_args()

    with open(CATALOG, encoding="utf-8") as f:
        entries = json.load(f)

    results = {}
    with cf.ThreadPoolExecutor(max_workers=args.workers) as pool:
        futs = {pool.submit(check, e["url"], args.timeout): e for e in entries}
        for fut in cf.as_completed(futs):
            e = futs[fut]
            results[e["id"]] = dict(id=e["id"], url=e["url"], **fut.result())

    dead_verdicts = {"dead", "unreachable", "error"}
    for e in entries:
        r = results[e["id"]]
        if r["verdict"] in dead_verdicts:
            e["dead"] = True
        else:
            e.pop("dead", None)

    counts = {}
    for r in results.values():
        counts[r["verdict"]] = counts.get(r["verdict"], 0) + 1
    report = {
        "checked_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "total": len(entries),
        "counts": counts,
        "dead_count": sum(1 for e in entries if e.get("dead")),
        "results": [results[e["id"]] for e in entries],
    }
    with open(REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
        f.write("\n")
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print("Checked %d URLs: %s" % (len(entries), counts))
    for r in report["results"]:
        if r["verdict"] in dead_verdicts:
            print("  DEAD %-45s %s  %s" % (r["id"], r["status"], r["error"]))


if __name__ == "__main__":
    main()
