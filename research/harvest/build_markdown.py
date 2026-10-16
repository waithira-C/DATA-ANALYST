"""Render research/catalog/resources.json as research/catalog/RESOURCES.md.

Usage:
    python -I research/harvest/build_markdown.py

Groups entries by level (the app's 10 floors), then by type, with cost badges.
Entries flagged "dead" by check_links.py are listed but marked.
"""
import collections
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CATALOG = os.path.normpath(os.path.join(HERE, "..", "catalog", "resources.json"))
REPORT = os.path.normpath(os.path.join(HERE, "..", "catalog", "link_report.json"))
OUT = os.path.normpath(os.path.join(HERE, "..", "catalog", "RESOURCES.md"))

LEVELS = {
    1: "Orientation",
    2: "Spreadsheets I",
    3: "Spreadsheets II (lookups, pivots, charts)",
    4: "Statistics",
    5: "SQL I",
    6: "SQL II (CTEs, window functions)",
    7: "Visualization & BI (Power BI, Tableau, storytelling)",
    8: "Python & pandas",
    9: "Business acumen, A/B testing & case studies",
    10: "Capstone, portfolio, career & interview",
}
TYPE_ORDER = ["course", "video", "book", "article", "practice", "dataset", "tool", "community", "certification"]
TYPE_LABEL = {
    "course": "Courses", "video": "Videos & channels", "book": "Books", "article": "Articles & guides",
    "practice": "Practice", "dataset": "Datasets", "tool": "Tools", "community": "Communities",
    "certification": "Certifications",
}
COST_BADGE = {
    "free": "![free](https://img.shields.io/badge/cost-free-brightgreen)",
    "freemium": "![freemium](https://img.shields.io/badge/cost-freemium-yellow)",
    "paid": "![paid](https://img.shields.io/badge/cost-paid-red)",
}


def esc(text):
    return text.replace("|", "\\|").replace("[", "\\[").replace("]", "\\]")


def fmt_hours(h):
    if h is None:
        return ""
    if h < 1:
        return " · ~%d min" % round(h * 60)
    return " · ~%sh" % (int(h) if float(h).is_integer() else h)


def main():
    with open(CATALOG, encoding="utf-8") as f:
        entries = json.load(f)
    report = None
    if os.path.exists(REPORT):
        with open(REPORT, encoding="utf-8") as f:
            report = json.load(f)

    by_level = collections.defaultdict(lambda: collections.defaultdict(list))
    for e in entries:
        by_level[e["level"]][e["type"]].append(e)

    cost_total = collections.Counter(e["cost"] for e in entries)
    lines = [
        "# Data Analyst Learning Resources",
        "",
        "Curated catalog of %d resources for going from complete beginner to job-ready data analyst, "
        "organised by the app's 10 floors. Summaries are original one-line descriptions; follow the links "
        "for the actual content." % len(entries),
        "",
        "Generated from `catalog/resources.json` by `harvest/build_markdown.py`. Do not edit by hand.",
        "",
        "**Cost:** %s %d free · %s %d freemium · %s %d paid" % (
            COST_BADGE["free"], cost_total["free"], COST_BADGE["freemium"], cost_total["freemium"],
            COST_BADGE["paid"], cost_total["paid"]),
        "",
    ]
    if report:
        lines += ["**Last link check:** %s · %d dead · %s" % (
            report.get("checked_at", "?"), report.get("dead_count", 0),
            ", ".join("%s: %d" % kv for kv in sorted(report.get("counts", {}).items()))), ""]

    lines += ["## Contents", ""]
    for lvl in sorted(LEVELS):
        n = sum(len(v) for v in by_level[lvl].values())
        anchor = ("level-%d-" % lvl) + LEVELS[lvl].lower()
        anchor = "".join(c for c in anchor if c.isalnum() or c in " -").replace(" ", "-")
        lines.append("- [Level %d: %s](#%s) (%d)" % (lvl, LEVELS[lvl], anchor, n))
    lines.append("")

    for lvl in sorted(LEVELS):
        lines += ["## Level %d: %s" % (lvl, LEVELS[lvl]), ""]
        for t in TYPE_ORDER:
            items = by_level[lvl].get(t)
            if not items:
                continue
            lines += ["### %s" % TYPE_LABEL[t], ""]
            order = {"free": 0, "freemium": 1, "paid": 2}
            for e in sorted(items, key=lambda x: (order[x["cost"]], x["title"].lower())):
                dead = " **(link failed last check)**" if e.get("dead") else ""
                yt = " · YouTube `%s`" % e["youtube_id"] if e.get("youtube_id") else ""
                lines.append("- %s [%s](%s) — *%s*%s%s%s  " % (
                    COST_BADGE[e["cost"]], esc(e["title"]), e["url"], esc(e["provider"]),
                    fmt_hours(e.get("est_hours")), yt, dead))
                lines.append("  %s Skills: %s." % (e["summary"], ", ".join(e["skills"])))
            lines.append("")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines).rstrip() + "\n")
    print("Wrote %s (%d entries)" % (OUT, len(entries)))


if __name__ == "__main__":
    main()
