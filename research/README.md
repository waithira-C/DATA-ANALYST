# Research: Data Analyst Resource Catalog

A curated catalog of about 300 learning resources (courses, videos, books, practice sites, datasets, tools, communities and certifications) for going from complete beginner to job-ready data analyst. Each resource is mapped to one of the app's 10 floors.

| Level | Floor |
|---|---|
| 1 | Orientation |
| 2 | Spreadsheets I |
| 3 | Spreadsheets II (lookups, pivots, charts) |
| 4 | Statistics |
| 5 | SQL I |
| 6 | SQL II (CTEs, window functions) |
| 7 | Visualization & BI (Power BI, Tableau, storytelling) |
| 8 | Python / pandas |
| 9 | Business acumen, A/B testing, case studies |
| 10 | Capstone, portfolio, career, interview |

The catalog holds metadata only: title, URL, provider, type, cost, level, skills, estimated hours, a one or two sentence summary written for this project, and a YouTube ID where one is available. No course text or video content is copied.

## Files

```
research/
├── README.md                  this file
├── catalog/
│   ├── resources.json         the catalog (generated, do not edit by hand)
│   ├── link_report.json       per-URL results of the last link check
│   └── RESOURCES.md           human-readable listing by level, then type, with cost badges
└── harvest/
    ├── seed_resources.py      source of truth: the curated entries plus schema validation
    ├── check_links.py         link checker (stdlib only)
    └── build_markdown.py      renders RESOURCES.md
```

### Entry schema (`resources.json`)

`id` (unique kebab slug), `title`, `url`, `provider`, `type` (`video|course|article|book|dataset|practice|tool|community|certification`), `cost` (`free|freemium|paid`), `level` (1–10), `skills` (subset of the app's skill tags), `est_hours` (number or null), `summary`, `youtube_id` (string or null; set only when the video allows embedding), `verified_at`, and optionally `dead: true` when the last link check failed.

## Refreshing the catalog

Run from the project root:

```
python -I research/harvest/seed_resources.py    # 1. rebuild resources.json from the seed (validates ids, types, skills)
python -I research/harvest/check_links.py       # 2. check every URL, write link_report.json, set "dead" flags
python -I research/harvest/build_markdown.py    # 3. regenerate RESOURCES.md
```

- To add or change a resource, edit `harvest/seed_resources.py` (one `add(...)` call per entry), update `VERIFIED_AT`, and re-run the three steps. Only add URLs you have opened or seen in search results.
- `check_links.py` tries HEAD, then GET, with a browser User-Agent and a timeout (`--timeout`, `--workers` are configurable). YouTube links are checked through YouTube's oEmbed endpoint, because the normal page returns 200 even for removed videos.
- Verdicts: `ok`; `blocked` (401/403/405/429/503 and similar, meaning the server refuses bots, treated as alive); `ok_ssl_warning` (the page loads but the TLS chain could not be verified locally); `dead`, `unreachable` and `error` set `"dead": true`.
- Review dead entries by hand before deleting them. Sites move pages often, so look for the new URL first.

## Notes

- Costs reflect access to the learning material: `freemium` means free to audit or partly free, with a paid certificate or premium tier. Prices and free tiers change, so check them before recommending.
- Reddit blocks automated fetchers, so the subreddit links were not fetched and will usually show as `blocked`.
- Several level 8 entries (Kaggle ML, time series, feature engineering, ISLR) are optional stretch material beyond core analyst skills.
