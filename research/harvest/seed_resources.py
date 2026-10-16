"""Seed data for the Data Analyst learning-resource catalog.

Metadata only: titles, URLs, providers and short summaries written in our own
words. No course text or video content is copied.

Every URL below was seen in a web-search result or fetched during research on
2026-10-15. Run this script to (re)generate research/catalog/resources.json:

    python -I research/harvest/seed_resources.py

Then run check_links.py and build_markdown.py.
"""
import json
import os
import re
import sys

VERIFIED_AT = "2026-10-15"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "catalog", "resources.json")

ALLOWED_SKILLS = {
    "orientation", "career", "excel", "spreadsheets", "statistics", "sql",
    "visualization", "powerbi", "tableau", "python", "pandas", "r", "business",
    "storytelling", "ab-testing", "portfolio", "interview", "git",
}
ALLOWED_TYPES = {"video", "course", "article", "book", "dataset", "practice",
                 "tool", "community", "certification"}
ALLOWED_COST = {"free", "freemium", "paid"}


def yt(vid):
    return "https://www.youtube.com/watch?v=" + vid


def ytpl(pl):
    return "https://www.youtube.com/playlist?list=" + pl


# Row format:
# (id, title, url, provider, type, cost, level, "skill skill", est_hours, youtube_id, summary)
R = []


def add(id_, title, url, provider, type_, cost, level, skills, hours, ytid, summary):
    R.append((id_, title, url, provider, type_, cost, level, skills, hours, ytid, summary))


# ---------------------------------------------------------------- Level 1: Orientation
add("roadmap-sh-data-analyst", "Data Analyst Roadmap", "https://roadmap.sh/data-analyst",
    "roadmap.sh", "article", "free", 1, "orientation career", 1, None,
    "Interactive skill map of the data analyst role, from collecting and cleaning data to analysis and visualization; useful for seeing the whole path before starting.")
add("google-data-analytics-certificate", "Google Data Analytics Professional Certificate",
    "https://grow.google/certificates/data-analytics/", "Google / Coursera", "course", "freemium", 1,
    "orientation spreadsheets sql visualization tableau r career", 240, None,
    "Beginner multi-course program covering the analysis process, spreadsheets, SQL, visualization and a capstone; individual courses can usually be audited, the certificate needs a subscription.")
add("coursera-foundations-data", "Foundations: Data, Data, Everywhere (Google DA course 1)",
    "https://www.coursera.org/learn/foundations-data", "Google / Coursera", "course", "freemium", 1,
    "orientation career", 20, None,
    "First course of the Google certificate: introduces what analysts do, the data life cycle and the tools used in the rest of the program.")
add("ibm-data-analyst-certificate", "IBM Data Analyst Professional Certificate",
    "https://www.coursera.org/professional-certificates/ibm-data-analyst", "IBM / Coursera", "course", "freemium", 1,
    "orientation excel sql python pandas visualization", 130, None,
    "Eleven-course beginner track spanning Excel, SQL, Python and dashboarding, ending with a capstone on a real survey dataset.")
add("coursera-google-vs-ibm-vs-meta", "Which Data Analytics Certificate Is Best? Google vs IBM vs Meta",
    "https://www.coursera.org/articles/google-vs-ibm-vs-meta-data-analysis-certificates", "Coursera", "article", "free", 1,
    "orientation career", 0.25, None,
    "Side-by-side comparison of the major entry-level analytics certificates by length, tools and focus to help pick a starting program.")
add("coursera-career-academy-data-analyst", "Data Analyst Learning Paths by Skill Level",
    "https://www.coursera.org/career-academy/roles/data-analyst", "Coursera", "article", "free", 1,
    "orientation career", 0.5, None,
    "Overview of the data analyst role with suggested course sequences grouped by experience level.")
add("fcc-data-analytics-roadmap", "How to Get Started in Data Analytics",
    "https://www.freecodecamp.org/news/data-analytics-roadmap/", "freeCodeCamp", "article", "free", 1,
    "orientation career", 0.5, None,
    "Beginner roadmap covering what the job involves, the maths, Excel, SQL, Python and BI tools to learn, plus networking and soft skills.")
add("fcc-teach-yourself-data-analytics-30-days", "Teach Yourself Data Analytics in 30 Days",
    "https://www.freecodecamp.org/news/teach-yourself-data-analytics-in-30-days/", "freeCodeCamp", "article", "free", 1,
    "orientation", 0.5, None,
    "A day-by-day self-study plan that strings free resources together into a one-month introduction to analytics.")
add("edx-how-to-audit", "How to Audit a Course on edX",
    "https://www.edx.org/resources/how-to-audit-an-edx-class", "edX", "article", "free", 1,
    "orientation", 0.2, None,
    "Explains the free audit track on edX, what it includes and what is locked behind the paid certificate.")
add("edx-essentials-of-data-literacy", "The Essentials of Data Literacy (DavidsonX)",
    "https://www.edx.org/learn/data-analysis/davidson-college-essentials-of-data-literacy", "Davidson College / edX", "course", "freemium", 1,
    "orientation statistics r", 16, None,
    "Short introductory course on reading, questioning and summarizing data, with a light introduction to analysis in R; free to audit.")
add("alex-free-data-analyst-bootcamp-intro", "FREE Data Analyst Bootcamp!! (announcement)",
    yt("rGx1QNdYzvs"), "Alex The Analyst (YouTube)", "video", "free", 1, "orientation career", 0.2, "rGx1QNdYzvs",
    "Short intro to Alex Freberg's free bootcamp playlist, explaining the order of topics and how the projects fit together.")
add("alex-data-analyst-bootcamp-playlist", "Data Analyst Bootcamp (playlist)",
    ytpl("PLUaB-1hjhk8FE_XZ87vPPSfHqb6OcM0cF"), "Alex The Analyst (YouTube)", "video", "free", 1,
    "orientation sql excel tableau powerbi python pandas portfolio", 40, None,
    "Long-running free playlist that walks through SQL, Excel, Tableau, Power BI and Python with portfolio projects along the way.")
add("alex-ultimate-bootcamp-24h", "Ultimate Data Analyst Bootcamp [24 Hours]",
    yt("wQQR60KtnFY"), "Alex The Analyst (YouTube)", "video", "free", 1,
    "orientation sql excel tableau powerbi python pandas", 24, "wQQR60KtnFY",
    "Single long video compiling the bootcamp: SQL, Excel, Tableau, Power BI, Python/pandas and cloud basics, with chapter timestamps.")
add("luke-data-analyst-bootcamp-35h", "Data Analyst Bootcamp (Free 35+ Hour Course)",
    yt("MOzEvNYvbik"), "Luke Barousse (YouTube)", "video", "free", 1,
    "orientation sql excel powerbi python git", 35, "MOzEvNYvbik",
    "All-in-one free course bundling Luke Barousse's SQL, Excel, Power BI and Python lessons plus GitHub and AI tooling.")
add("fcc-data-analysis-bootcamp-19h", "Data Analysis Bootcamp (19 hours) - freeCodeCamp",
    yt("PSNXoAs2FtQ"), "freeCodeCamp / Alex Freberg", "video", "free", 1,
    "orientation sql excel tableau powerbi python pandas", 19, "PSNXoAs2FtQ",
    "freeCodeCamp-hosted bootcamp by Alex Freberg spanning SQL, Excel, Tableau, Power BI, Python and web scraping.")
add("luke-how-id-learn-data-analyst", "How I'd Learn to be a Data Analyst",
    yt("_gF2Mj1354M"), "Luke Barousse (YouTube)", "video", "free", 1, "orientation career", 0.3, "_gF2Mj1354M",
    "Luke Barousse's recommended order of skills and resources for a beginner aiming at a first analyst job.")
add("luke-top-courses-data-analyst", "Top Courses to Become a Data Analyst",
    yt("aqRxZSrJLEc"), "Luke Barousse (YouTube)", "video", "free", 1, "orientation career", 0.3, "aqRxZSrJLEc",
    "Review of popular paid and free analyst courses and certificates and who each one suits.")
add("luke-skills-interview", "Want to be a Data Analyst? Learn These Skills (w/ Luke Barousse)",
    yt("p_CjpS5lC-w"), "YouTube", "video", "free", 1, "orientation career", 0.5, "p_CjpS5lC-w",
    "Conversation on which technical skills matter most for entry-level analyst roles.")
add("mo-chen-how-id-become-data-analyst", "How I'd Become a Data Analyst",
    yt("d_2fGS6QVDo"), "Mo Chen (YouTube)", "video", "free", 1, "orientation career", 0.3, "d_2fGS6QVDo",
    "A working analytics manager's plan for career switchers: what to learn first and how to show it.")
add("mo-chen-da-vs-ds", "Should You Be a Data Scientist or Data Analyst?",
    yt("yRBEPkfPh_U"), "YouTube", "video", "free", 1, "orientation career", 0.3, None,
    "Compares day-to-day work, skills and hiring expectations for analyst versus scientist roles.")
add("mo-chen-best-resources-2024", "Best Resources and Courses for Data Analysis in 2024",
    yt("0bOR4wvedHw"), "Mo Chen (YouTube)", "video", "free", 1, "orientation", 0.3, "0bOR4wvedHw",
    "Curated walkthrough of courses and free materials the creator recommends for each analyst skill.")
add("tina-huang-learn-data-science-2022", "How I Would Learn Data Science in 2022",
    yt("Rt6eb9VOFII"), "Tina Huang (YouTube)", "video", "free", 1, "orientation", 0.3, "Rt6eb9VOFII",
    "Tina Huang's minimal-effort self-study plan for data roles; much of the advice transfers to analytics.")
add("ken-jee-how-i-would-learn-ds", "How I Would Learn Data Science (What Has Changed?)",
    yt("41Clrh6nv1s"), "Ken Jee (YouTube)", "video", "free", 1, "orientation", 0.3, "41Clrh6nv1s",
    "Ken Jee's suggested learning sequence and project-first mindset for breaking into data work.")
add("linkedin-learning-explore-career-data-analysis", "Explore a Career in Data Analysis (Learning Path)",
    "https://www.linkedin.com/learning/paths/explore-a-career-in-data-analysis", "LinkedIn Learning", "course", "paid", 1,
    "orientation career", 8, None,
    "Short subscription path introducing the analyst role and core tools; often free via libraries or trials.")
add("analystbuilder-data-analyst-roadmap", "Data Analyst Roadmap (Analyst Builder)",
    "https://analystbuilder.com/roadmaps/data-analyst-roadmap", "Analyst Builder", "article", "free", 1,
    "orientation career", 0.5, None,
    "Step-by-step roadmap from Alex Freberg's platform linking each skill stage to practice material.")

# ---------------------------------------------------------------- Level 2: Spreadsheets I
add("gcfglobal-excel", "Excel: Foundations (GCFGlobal / LearnFree)", "https://edu.gcfglobal.org/en/excel/",
    "GCFGlobal", "course", "free", 2, "excel spreadsheets", 6, None,
    "Gentle, step-by-step lessons on the Excel interface, cell basics, simple formulas, formatting and charts with practice workbooks.")
add("gcfglobal-google-sheets", "Google Sheets Tutorial (GCFGlobal)",
    "https://edu.gcfglobal.org/en/googlespreadsheets/getting-started-with-google-sheets/full", "GCFGlobal", "course", "free", 2,
    "spreadsheets", 4, None,
    "Free beginner course on creating, formatting, sorting and calculating in Google Sheets.")
add("microsoft-excel-help-learning", "Excel Help & Learning", "https://support.microsoft.com/en-us/excel/",
    "Microsoft Support", "article", "free", 2, "excel", 2, None,
    "Official hub of Excel how-tos, function references and short training videos, including XLOOKUP and PivotTables.")
add("microsoft-basic-tasks-excel", "Basic Tasks in Excel",
    "https://support.microsoft.com/en-us/office/basic-tasks-in-excel-dc775dd1-fa52-430f-9c3c-d998d1735fca",
    "Microsoft Support", "article", "free", 2, "excel", 0.5, None,
    "Official beginner walkthrough of opening workbooks, entering and formatting data and doing quick calculations.")
add("google-sheets-training-help", "Google Sheets Training and Help",
    "https://support.google.com/a/users/answer/9282959?hl=en", "Google Workspace Learning Center", "article", "free", 2,
    "spreadsheets", 1, None,
    "Official quick-start guides and productivity tips for Sheets, including a guide for people switching from Excel.")
add("google-sheets-cheat-sheet", "Google Sheets Cheat Sheet",
    "https://support.google.com/a/users/answer/9300022?hl=en", "Google Workspace Learning Center", "article", "free", 2,
    "spreadsheets", 0.3, None,
    "One-page reference for common Sheets tasks such as freezing headers, version history and everyday functions.")
add("excel-easy", "Excel Easy", "https://www.excel-easy.com/", "Excel Easy", "article", "free", 2,
    "excel", 10, None,
    "Large free tutorial site organised by chapter, from basics through functions, charts and pivot tables.")
add("trumpexcel-free-training", "Free Online Excel Training (12+ hours)", "https://trumpexcel.com/learn-excel/",
    "TrumpExcel (Sumit Bansal)", "course", "free", 2, "excel", 12, None,
    "No-signup video course in 26 lessons covering formulas, lookups, text and date functions and charts.")
add("teachexcel-tutorials", "Free Excel Video Tutorials (TeachExcel)", "https://www.teachexcel.com/excel-tutorials/index.php",
    "TeachExcel", "video", "free", 2, "excel", None, None,
    "Library of short Excel videos grouped by topic and difficulty.")
add("excelisfun-channel", "excelisfun (YouTube channel)", "https://www.youtube.com/user/ExcelIsFun",
    "excelisfun / Mike Girvin", "video", "free", 2, "excel", None, None,
    "Thousands of Excel and Power BI videos plus full free college classes with downloadable workbooks.")
add("excelisfun-365-basics-1", "Excel 365 Basics #1: Formulas, Functions, Formatting, Cell References",
    yt("IInFoJxxPPA"), "excelisfun (YouTube)", "video", "free", 2, "excel", 1.5, "IInFoJxxPPA",
    "First video of a free 10-part basics class with homework files; covers what Excel is and how formulas and references work.")
add("excelisfun-highline-class-01", "Highline Excel Class 01: Back to Basics",
    yt("Wq7p4uoj4Vo"), "excelisfun (YouTube)", "video", "free", 2, "excel", 1, "Wq7p4uoj4Vo",
    "Opening lecture of Mike Girvin's college Excel class reviewing core spreadsheet mechanics.")
add("fcc-excel-full-course", "Microsoft Excel Tutorial for Beginners - Full Course",
    yt("Vl0H-qTclOg"), "freeCodeCamp", "video", "free", 2, "excel spreadsheets", 2.5, "Vl0H-qTclOg",
    "Project-based beginner course built around six practical workbooks; techniques also work in Google Sheets.")
add("fcc-spreadsheets-33-projects", "Master Spreadsheets by Building 33 Projects",
    yt("BBk3DXgodmI"), "freeCodeCamp", "video", "free", 2, "excel spreadsheets", 4, "BBk3DXgodmI",
    "Hands-on course of small spreadsheet projects that can be done in either Excel or Google Sheets.")
add("excel-full-course-4h", "Excel Full Course Tutorial (4+ Hours)", yt("rro5t8eHXaY"), "YouTube", "video", "free", 2,
    "excel", 4, "rro5t8eHXaY",
    "Long-form tutorial moving from basics to sorting, filtering, pivot tables, XLOOKUP and macros, with chapter markers.")
add("kevin-stratvert-channel", "Kevin Stratvert (YouTube channel)", "https://www.youtube.com/channel/UCfJT_eYDTmDE-ovKaxVE1ig",
    "Kevin Stratvert", "video", "free", 2, "excel powerbi", None, None,
    "Former Microsoft PM's channel of clear, beginner-friendly Excel, Power Query and Power BI tutorials.")
add("luke-how-i-use-excel", "How I Use Excel as a Data Analyst", yt("lw6sPHH7twk"), "Luke Barousse (YouTube)", "video", "free", 2,
    "excel", 0.3, "lw6sPHH7twk",
    "Shows which Excel features a working analyst relies on day to day.")
add("luke-excel-for-data-analytics", "Excel for Data Analytics - Full Course for Beginners", yt("pCJ15nGFgVg"),
    "Luke Barousse (YouTube)", "video", "free", 2, "excel", 6, "pCJ15nGFgVg",
    "Free analyst-focused Excel course with downloadable project files; optional paid tier adds problems and a certificate.")
add("benlcollins-how-to-use-google-sheets", "How to Use Google Sheets: A Beginner's Guide",
    "https://www.benlcollins.com/spreadsheets/how-to-use-google-sheets/", "Ben Collins", "article", "free", 2,
    "spreadsheets", 1, None,
    "Long beginner guide to Sheets from a Google Developer Expert, starting with SUM/COUNT/AVERAGE and basic formatting.")
add("benlcollins-sheets-essentials", "Google Sheets Essentials (course)", "https://courses.benlcollins.com/p/google-sheets-essentials",
    "Ben Collins", "course", "paid", 2, "spreadsheets", 15, None,
    "Paid video course of 44 short lessons on functions, data cleaning, pivot tables and charts in Google Sheets.")
add("xelplus-learn-excel-beginners", "How to Use Excel: Beginner's Guide with Free Practice File",
    "https://www.xelplus.com/learn-excel-beginners/", "Xelplus (Leila Gharani)", "article", "free", 2,
    "excel", 1, None,
    "Leila Gharani's suggested order for learning Excel, from data entry to formulas to lookups, with a practice workbook.")
add("coursera-analyze-data-to-answer-questions", "Analyze Data to Answer Questions (Google DA course)",
    "https://www.coursera.org/learn/analyze-data", "Google / Coursera", "course", "freemium", 3,
    "spreadsheets sql", 25, None,
    "Google certificate course on organising, formatting and aggregating data with spreadsheets and SQL to answer business questions.")
add("microsoft-mos-excel-associate", "Microsoft Office Specialist: Associate (MO-200 Excel)",
    "https://learn.microsoft.com/en-us/credentials/certifications/microsoft-office-specialist-associate-2019/",
    "Microsoft / Certiport", "certification", "paid", 3, "excel career", 20, None,
    "Proctored Excel skills exam (worksheets, tables, formulas, charts) that counts toward the MOS Associate credential.")

# ---------------------------------------------------------------- Level 3: Spreadsheets II
add("exceljet-formulas", "Exceljet Formula Examples", "https://exceljet.net/formulas", "Exceljet", "article", "free", 3,
    "excel", None, None,
    "Over a thousand worked formula examples (XLOOKUP, INDEX/MATCH, FILTER, SUMIFS, etc.) each with an explanation.")
add("exceljet-videos", "Exceljet Training Videos", "https://exceljet.net/videos", "Exceljet", "video", "freemium", 3,
    "excel", None, None,
    "Short focused clips with practice sheets on formulas, pivot tables, conditional formatting and shortcuts.")
add("exceljet-home", "Exceljet: Functions & Shortcuts Reference", "https://exceljet.net/", "Exceljet", "article", "free", 3,
    "excel", None, None,
    "Reference hub for Excel functions and keyboard shortcuts with featured formulas and videos.")
add("excelfrog", "ExcelFrog Tutorials", "https://www.excelfrog.com/", "ExcelFrog", "article", "free", 3, "excel", 4, None,
    "Concise free tutorials on IF/IFS, VLOOKUP, INDEX MATCH and the COUNT family.")
add("chandoo-pivot-tables-tutorial", "Excel Pivot Tables Tutorial: What Is a Pivot Table and How to Make One",
    "https://chandoo.org/wp/excel-pivot-tables-tutorial/", "Chandoo.org", "article", "free", 3, "excel", 1, None,
    "Written guide plus video on creating, formatting, filtering and refreshing pivot tables.")
add("chandoo-pivot-table-video", "Make a Pivot Table in Excel (short)", yt("TwTYWqv0Tm0"), "Chandoo (YouTube)", "video", "free", 3,
    "excel", 0.1, "TwTYWqv0Tm0",
    "Very short demo of building a pivot table from a table in seconds.")
add("chandoo-dynamic-dashboard", "Make Dynamic Dashboards Using Excel (video + workbook)",
    "https://chandoo.org/wp/dynamic-dashboard-video-tutorial/", "Chandoo.org", "video", "free", 3, "excel visualization", 0.5, None,
    "Older but still useful tutorial on combining pivot tables and slicers into an interactive dashboard.")
add("chandoo-videos", "Chandoo Excel, Power BI & Dashboard Videos", "https://chandoo.org/wp/videos/", "Chandoo.org", "video", "free", 3,
    "excel powerbi visualization", None, None,
    "Index of Chandoo's free videos on formulas, Power Query, Power Pivot, dashboards and Power BI.")
add("chandoo-free-data-analyst-course", "FREE 14-Week Data Analyst Course (Chandoo)",
    "https://chandoo.org/wp/free-data-analyst-course/", "Chandoo.org", "course", "free", 3,
    "excel powerbi sql visualization", 60, None,
    "Structured free course with videos, files and data covering advanced Excel, data modelling, DAX and dashboards.")
add("xelplus-pivot-tables-guide", "How to Create a Pivot Table in Excel: Complete Beginner's Guide",
    "https://www.xelplus.com/pivot-tables/", "Xelplus (Leila Gharani)", "article", "free", 3, "excel", 1, None,
    "Free illustrated guide to building, arranging, formatting and slicing a first pivot table.")
add("xelplus-pivot-table-tips", "10 Excel Pivot Table Tips & Tricks", "https://www.xelplus.com/pivot-table-pro-tips/",
    "Xelplus (Leila Gharani)", "article", "free", 3, "excel", 0.5, None,
    "Practical pivot table improvements such as grouping, show-values-as and layout tweaks.")
add("xelplus-advanced-pivot-tables", "Advanced Excel Pivot Tables: 10 Techniques", "https://www.xelplus.com/excel-advanced-pivot-tables/",
    "Xelplus (Leila Gharani)", "article", "free", 3, "excel", 0.5, None,
    "Next-step pivot techniques for analysts who already know the basics.")
add("xelplus-pivot-mastery-course", "Excel Pivot Table Mastery: Basics to Dashboards", "https://www.xelplus.com/course/excel-pivot-tables/",
    "Xelplus (Leila Gharani)", "course", "paid", 3, "excel visualization", 8, None,
    "Paid course of about eight hours on pivot tables through to pivot-driven dashboards, with practice files.")
add("xelplus-excel-dashboards-course", "Excel Dashboards Course", "https://www.xelplus.com/course/excel-dashboards/",
    "Xelplus (Leila Gharani)", "course", "paid", 3, "excel visualization storytelling", None, None,
    "Paid course on designing clear interactive dashboards in Excel.")
add("leila-gharani-channel", "Leila Gharani (YouTube channel)", "https://www.youtube.com/@LeilaGharani", "Leila Gharani",
    "video", "free", 3, "excel powerbi", None, None,
    "Popular channel of polished tutorials on Excel lookups, dynamic arrays, pivot tables, Power Query and Power BI.")
add("fcc-excel-formulas-functions", "Learn Excel Formulas and Functions (2 hours)", yt("gvhsKtjAmgc"), "freeCodeCamp", "video", "free", 3,
    "excel", 2, "gvhsKtjAmgc",
    "Covers logical functions, XLOOKUP, INDEX and dynamic-array functions such as FILTER, SORT and UNIQUE.")
add("fcc-excel-data-visualization", "Excel for Data Visualization", yt("VV8iRJ-DS0A"), "freeCodeCamp", "video", "free", 3,
    "excel visualization", 1, "VV8iRJ-DS0A",
    "One-hour course on charts, pivot charts, KPIs and building a simple dashboard in Excel.")
add("excel-data-analysis-7h", "Excel Data Analysis Full Course Tutorial (7+ Hours)", yt("qrbf9DtR3_c"), "YouTube", "video", "free", 3,
    "excel", 7, "qrbf9DtR3_c",
    "Long analysis-focused Excel course: cleaning, lookups, pivots and charts on sample business data.")
add("excelisfun-power-query-1", "Power Query #1: Introduction to Power Query & Data Analysis", yt("Kr5JFAq1aPQ"),
    "excelisfun (YouTube)", "video", "free", 3, "excel powerbi", 1, "Kr5JFAq1aPQ",
    "Start of a free series on importing and reshaping data with Power Query in Excel and Power BI.")
add("excelisfun-365-mecs-playlist", "Excel 365 & Power BI Intermediate to Advanced (365 MECS)",
    ytpl("PLrRPvpgDmw0nre_bTeBfJWjrnixKoyNtW"), "excelisfun (YouTube)", "video", "free", 3, "excel powerbi", 30, None,
    "Free full course playlist on calculations and data analysis in Excel 365 and Power BI with homework files.")
add("kevin-stratvert-power-query", "How to Use Microsoft Power Query", yt("0aeZX1l4JT4"), "Kevin Stratvert (YouTube)", "video", "free", 3,
    "excel powerbi", 0.5, "0aeZX1l4JT4",
    "Beginner walkthrough of cleaning and transforming data with Power Query instead of manual edits.")
add("benlcollins-home", "Ben Collins: Google Sheets Tutorials", "https://www.benlcollins.com/", "Ben Collins", "article", "free", 3,
    "spreadsheets", None, None,
    "Deep Google Sheets tutorials including the QUERY function, newer analytical functions and formula tips.")
add("edx-microsoft-intro-data-analysis-excel", "Introduction to Data Analysis using Excel (Microsoft)",
    "https://www.edx.org/learn/data-analysis/microsoft-introduction-to-data-analysis-using-excel", "Microsoft / edX", "course", "freemium", 3,
    "excel", 15, None,
    "Course on pivot tables, slicers and formula-based reports in Excel; verified certificate costs extra.")
add("edx-ritx-data-processing-excel", "Data Processing and Analysis with Excel (RITx)",
    "https://www.edx.org/learn/excel/rochester-institute-of-technology-data-processing-and-analysis-with-excel", "RIT / edX", "course", "freemium", 3,
    "excel", 20, None,
    "University course on preparing, analysing and summarising data in Excel.")

# ---------------------------------------------------------------- Level 4: Statistics
add("khan-statistics-probability", "Khan Academy: Statistics and Probability",
    "https://www.khanacademy.org/math/statistics-probability", "Khan Academy", "course", "free", 4, "statistics", 40, None,
    "Complete free course with short videos and quizzes from descriptive stats through sampling, confidence intervals and significance tests.")
add("openintro-statistics", "OpenIntro Statistics (free PDF)", "https://www.openintro.org/book/os/", "OpenIntro", "book", "free", 4,
    "statistics", 60, None,
    "Widely used open textbook on data, probability, distributions, inference and regression; free PDF download.")
add("openintro-ims", "Introduction to Modern Statistics", "https://www.openintro.org/book/ims/", "OpenIntro", "book", "free", 4,
    "statistics r", 60, None,
    "Open HTML textbook that teaches statistics through simulation and randomisation, with R-based examples.")
add("think-stats-3e", "Think Stats, 3rd Edition", "https://greenteapress.com/wp/think-stats-3e/", "Green Tea Press (Allen Downey)", "book", "free", 4,
    "statistics python", 40, None,
    "Free book of runnable Jupyter notebooks teaching exploratory data analysis and statistics with Python.")
add("mit-18-05", "MIT 18.05 Introduction to Probability and Statistics",
    "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/", "MIT OpenCourseWare", "course", "free", 4,
    "statistics r", 80, None,
    "Full university course materials (readings, problem sets, R studios) on probability, Bayesian and frequentist inference and regression.")
add("seeing-theory", "Seeing Theory: A Visual Introduction to Probability and Statistics", "https://seeing-theory.brown.edu/",
    "Brown University", "article", "free", 4, "statistics", 3, None,
    "Interactive visualisations that build intuition for probability, distributions, inference and regression.")
add("openstax-intro-stats-2e", "Introductory Statistics 2e (OpenStax)", "https://openstax.org/details/books/introductory-statistics-2e",
    "OpenStax", "book", "free", 4, "statistics", 60, None,
    "Free peer-reviewed one-semester statistics textbook with many applied exercises, available as web view or PDF.")
add("psu-stat-200", "Penn State STAT 200: Elementary Statistics (course notes)", "https://online.stat.psu.edu/stat200/",
    "Penn State", "course", "free", 4, "statistics", 40, None,
    "Open course notes from Penn State covering descriptive statistics, probability, confidence intervals and hypothesis tests.")
add("stattrek-tutorials", "Stat Trek Free Online Tutorials", "https://stattrek.com/tutorials/free-online-courses", "Stat Trek",
    "article", "free", 4, "statistics", 20, None,
    "Plain-English tutorials on statistics, probability, regression, ANOVA and survey sampling with calculators.")
add("onlinestatbook", "Online Statistics Education (onlinestatbook)", "https://onlinestatbook.com/", "Rice University et al.",
    "book", "free", 4, "statistics", 40, None,
    "Public-domain interactive textbook with simulations, case studies and video presentations.")
add("cmu-oli-probability-statistics", "Probability & Statistics - Open & Free (CMU OLI)",
    "https://oli.cmu.edu/courses/probability-statistics-open-free/", "Carnegie Mellon OLI", "course", "free", 4, "statistics", 40, None,
    "Self-paced course on statistical reasoning with interactive exercises; activities can be done in Excel or R.")
add("fcc-statistics-8h", "Learn College-Level Statistics (8-hour course)", yt("xxpc-HPKN28"), "freeCodeCamp", "video", "free", 4,
    "statistics", 8, "xxpc-HPKN28",
    "Lecture course on sampling, study design, summary statistics, the normal distribution and the central limit theorem.")
add("statquest-statistics-fundamentals", "StatQuest: Statistics Fundamentals (playlist)", ytpl("PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9"),
    "StatQuest with Josh Starmer", "video", "free", 4, "statistics", 8, None,
    "Short, intuitive videos explaining core statistical ideas step by step; great for reviewing concepts.")
add("statquest-playlists", "StatQuest with Josh Starmer (channel playlists)", "https://www.youtube.com/@statquest/playlists",
    "StatQuest with Josh Starmer", "video", "free", 4, "statistics", None, None,
    "All StatQuest playlists, from basic statistics to regression and machine learning.")
add("statquest-p-values", "p-values: What They Are and How to Interpret Them", yt("vemZtEM63GY"), "StatQuest (YouTube)", "video", "free", 4,
    "statistics", 0.2, "vemZtEM63GY",
    "Clear explanation of what a p-value does and does not tell you.")
add("statquest-calculate-p-values", "How to Calculate p-values", yt("JQc3yx0-Q9E"), "StatQuest (YouTube)", "video", "free", 4,
    "statistics", 0.4, "JQc3yx0-Q9E",
    "Worked examples computing p-values for discrete and continuous data.")
add("statquest-normal-distribution", "The Normal Distribution, Clearly Explained", yt("rzFX5NWojp0"), "StatQuest (YouTube)", "video", "free", 4,
    "statistics", 0.2, "rzFX5NWojp0",
    "Introduces the bell curve, its parameters and why it shows up so often.")
add("statquest-histograms", "Histograms, Clearly Explained", yt("qBigTkBLU6g"), "StatQuest (YouTube)", "video", "free", 4,
    "statistics visualization", 0.1, "qBigTkBLU6g",
    "Short primer on reading histograms and choosing bin widths.")
add("statquest-quantiles", "Quantiles and Percentiles, Clearly Explained", yt("IFKQLDmRK0Y"), "StatQuest (YouTube)", "video", "free", 4,
    "statistics", 0.1, "IFKQLDmRK0Y",
    "Explains quantiles, percentiles and how they summarise a distribution.")
add("statquest-linear-regression", "The Essence of Linear Regression", yt("aFDOzpTeg0s"), "StatQuest (YouTube)", "video", "free", 4,
    "statistics", 0.3, "aFDOzpTeg0s",
    "Step-by-step intuition for fitting a line, R-squared and p-values in regression.")
add("statquest-one-two-tailed", "One or Two Tailed p-values", yt("bsZGt-caXO4"), "StatQuest (YouTube)", "video", "free", 4,
    "statistics", 0.1, "bsZGt-caXO4",
    "Why two-sided tests are usually the right default.")

# ---------------------------------------------------------------- Level 5: SQL I
add("sqlbolt", "SQLBolt: Learn SQL with Interactive Exercises", "https://sqlbolt.com/", "SQLBolt", "practice", "free", 5, "sql", 4, None,
    "Bite-sized interactive lessons that run in the browser, from SELECT and filtering through joins, aggregates and table changes.")
add("sqlzoo", "SQLZoo", "https://sqlzoo.net/wiki/SQL_Zoo", "SQLZoo", "practice", "free", 5, "sql", 8, None,
    "Classic browser-based SQL tutorials with graded exercises on world, nobel and football datasets.")
add("select-star-sql", "Select Star SQL", "https://selectstarsql.com/", "Select Star SQL (Zi Chong Kao)", "book", "free", 5, "sql", 3, None,
    "Free interactive book that teaches SQL by querying a real-world dataset, no signup required.")
add("mode-sql-tutorial-intro", "Mode SQL Tutorial for Data Analysis", "https://mode.com/resources/sql-tutorial/introduction-to-sql",
    "Mode", "course", "free", 5, "sql", 10, None,
    "Browser-based tutorial aimed at Excel users: basic, intermediate and advanced SQL lessons with practice problems.")
add("w3schools-sql", "W3Schools SQL Tutorial", "https://www.w3schools.com/sql/", "W3Schools", "course", "free", 5, "sql", 6, None,
    "Reference-style tutorial with a try-it editor for every SQL keyword and function.")
add("w3schools-sql-exercises", "W3Schools SQL Exercises", "https://w3schools.com/SQL/exercise.asp", "W3Schools", "practice", "free", 5, "sql", 1, None,
    "Quick fill-in exercises to check SQL syntax knowledge across all basic topics.")
add("kaggle-intro-to-sql", "Kaggle Learn: Intro to SQL", "https://www.kaggle.com/learn/intro-to-sql", "Kaggle", "course", "free", 5, "sql", 3, None,
    "Hands-on micro-course querying BigQuery public data: SELECT/WHERE, GROUP BY, ORDER BY, WITH and joins.")
add("cs50-sql", "CS50's Introduction to Databases with SQL", "https://cs50.harvard.edu/sql/", "Harvard CS50", "course", "free", 5, "sql", 40, None,
    "Seven-week Harvard course on querying, relational modelling, joins, views and indexes with SQLite, Postgres and MySQL; free to follow.")
add("codecademy-learn-sql", "Codecademy: Learn SQL", "https://www.codecademy.com/learn/learn-sql", "Codecademy", "course", "freemium", 5, "sql", 5, None,
    "Free interactive beginner course on creating, querying and updating tables; certificate requires a paid plan.")
add("codecademy-sql-multiple-tables", "Codecademy: Learn SQL - Multiple Tables", "https://www.codecademy.com/learn/learn-sql-multiple-tables",
    "Codecademy", "course", "freemium", 5, "sql", 2, None,
    "Short interactive course on joins, unions and WITH clauses.")
add("codecademy-sql-aggregate-functions", "Codecademy: Learn SQL - Aggregate Functions",
    "https://www.codecademy.com/learn/learn-sql-aggregate-functions", "Codecademy", "course", "freemium", 5, "sql", 2, None,
    "Practice COUNT, SUM, AVG, GROUP BY and HAVING in the browser.")
add("codecademy-analyze-data-with-sql", "Codecademy: Analyze Data with SQL (skill path)",
    "https://www.codecademy.com/learn/paths/analyze-data-with-sql", "Codecademy", "course", "paid", 5, "sql interview", 18, None,
    "Paid skill path with projects on analysing business data in SQL and preparing for technical screens.")
add("datacamp-intro-to-sql", "DataCamp: Introduction to SQL", "https://www.datacamp.com/courses/introduction-to-sql", "DataCamp",
    "course", "freemium", 5, "sql", 2, None,
    "Short in-browser beginner course; the first chapter is free, the rest needs a subscription.")
add("datalemur-sql-tutorial", "DataLemur Free SQL Tutorial for Data Analysts", "https://datalemur.com/sql-tutorial", "DataLemur",
    "course", "free", 5, "sql", 10, None,
    "30+ free lessons from basic to advanced SQL with in-browser exercises drawn from real interview problems.")
add("fcc-sql-full-database-course", "SQL Tutorial - Full Database Course for Beginners", yt("HXV3zeQKqGY"), "freeCodeCamp", "video", "free", 5,
    "sql", 4.5, "HXV3zeQKqGY",
    "Classic beginner course on relational database concepts and SQL using MySQL.")
add("fcc-postgresql-full-course", "Learn SQL with PostgreSQL (4-hour course)", yt("qw--VYLpxG4"), "freeCodeCamp", "video", "free", 5,
    "sql", 4, "qw--VYLpxG4",
    "Beginner PostgreSQL course covering setup, querying, constraints and joins.")
add("luke-sql-for-data-analytics", "SQL for Data Analytics - Learn SQL in 4 Hours", yt("7mz73uXD9DA"), "Luke Barousse (YouTube)", "video", "free", 5,
    "sql", 4, "7mz73uXD9DA",
    "Analyst-oriented SQL course using PostgreSQL and VS Code on a job-postings dataset.")
add("baraa-sql-full-course-30h", "SQL Full Course for Beginners (30 Hours) - Zero to Hero", yt("SSKVgrwhzus"), "Data with Baraa (YouTube)",
    "video", "free", 5, "sql", 30, "SSKVgrwhzus",
    "Very thorough visual SQL course from basics through joins, set operators, window functions and performance.")
add("baraa-sql-bootcamp-playlist", "SQL Bootcamp Playlist - Zero to Hero", ytpl("PLNcg_FV9n7qZY_2eAtUzEUulNjTJREhQe"),
    "Data with Baraa (YouTube)", "video", "free", 5, "sql", 30, None,
    "The same SQL curriculum split into bite-sized videos for easier pacing.")
add("alex-mysql-basics-playlist", "MySQL Basics Tutorial Series", ytpl("PLUaB-1hjhk8Fq6RBY-3MQ5MCXB5qxb8VA"), "Alex The Analyst (YouTube)",
    "video", "free", 5, "sql", 3, None,
    "Short beginner MySQL videos covering SELECT, WHERE, GROUP BY, ORDER BY and joins.")
add("sql-murder-mystery", "The SQL Murder Mystery", "https://mystery.knightlab.com/", "Northwestern Knight Lab", "practice", "free", 5,
    "sql", 1.5, None,
    "Detective game where you query a SQLite police database to solve a crime; a fun way to practise joins and filters.")
add("sql-murder-mystery-walkthrough", "SQL Murder Mystery Walkthrough", "https://mystery.knightlab.com/walkthrough.html",
    "Northwestern Knight Lab", "practice", "free", 5, "sql", 0.5, None,
    "Beginner primer for the game that introduces the SQL needed to start the investigation.")
add("sql-practice-com", "SQL-Practice.com", "https://www.sql-practice.com/", "SQL-Practice.com", "practice", "free", 5, "sql", 5, None,
    "About 70 graded exercises on hospital and Northwind databases, filterable by keyword and difficulty.")
add("sql-easy", "SQL Easy: Interactive SQL Tutorial", "https://www.sql-easy.com/", "Beekeeper Studio", "practice", "free", 5, "sql", 3, None,
    "31 bite-sized exercises on a real SQLite database in the browser with hints and instant feedback.")
add("w3resource-sqlite-exercises", "SQLite Exercises (w3resource)", "https://www.w3resource.com/sqlite-exercises/", "w3resource", "practice", "free", 5,
    "sql", 4, None,
    "Graded exercise sets on SELECT, sorting, aggregates, subqueries and joins with solutions.")
add("hackerrank-sql", "HackerRank SQL Practice", "https://www.hackerrank.com/domains/sql", "HackerRank", "practice", "free", 5, "sql", 15, None,
    "Graded SQL challenges from basic SELECT to advanced joins, with a skills badge.")
add("learnsql-free-practice-resources", "Top 9 Free SQL Practice Resources", "https://learnsql.com/blog/top-9-free-sql-practice-resources/",
    "LearnSQL.com", "article", "free", 5, "sql", 0.3, None,
    "Round-up of free places to practise SQL, from interactive tutorials to fiddles and games.")
add("datacamp-free-sql-resources", "The Best Resources to Learn SQL for Free", "https://www.datacamp.com/blog/top-resources-to-learn-sql-for-free",
    "DataCamp", "article", "free", 5, "sql", 0.3, None,
    "Curated list of free SQL courses, books and practice sites.")
add("postgresql-download", "PostgreSQL Downloads", "https://www.postgresql.org/download/", "PostgreSQL Global Development Group", "tool", "free", 5,
    "sql", 0.5, None,
    "Official installers for the open-source PostgreSQL database for Windows, macOS and Linux.")
add("dbeaver-community", "DBeaver Community (download)", "https://dbeaver.io/download/", "DBeaver", "tool", "free", 5, "sql", 0.5, None,
    "Free cross-database SQL client for browsing tables and running queries against Postgres, SQLite, MySQL and more.")
add("db-browser-sqlite", "DB Browser for SQLite", "https://sqlitebrowser.org/dl/", "DB Browser for SQLite", "tool", "free", 5, "sql", 0.3, None,
    "Lightweight visual tool for creating, browsing and querying SQLite database files.")

# ---------------------------------------------------------------- Level 6: SQL II
add("mode-sql-window-functions", "Mode: SQL Window Functions", "https://mode.com/resources/sql-tutorial/sql-window-functions", "Mode",
    "course", "free", 6, "sql", 1, None,
    "Hands-on lesson on running totals, ROW_NUMBER, RANK, NTILE, LAG and LEAD using a bike-share dataset.")
add("mode-popular-window-functions", "The Top 5 Most Popular Window Functions", "https://mode.com/blog/most-popular-window-functions-and-how-to-use-them/",
    "Mode", "article", "free", 6, "sql", 0.3, None,
    "Practical patterns such as running sums and picking the latest row per group.")
add("mode-moving-averages-sql", "Moving Averages in SQL", "https://mode.com/blog/moving-averages-in-sql/", "Mode", "article", "free", 6, "sql", 0.3, None,
    "How to smooth noisy daily metrics with window-frame averages.")
add("postgres-tutorial-window", "PostgreSQL Tutorial: Window Functions", "https://www.postgresql.org/docs/current/tutorial-window.html",
    "PostgreSQL Docs", "article", "free", 6, "sql", 0.5, None,
    "Official introduction to PARTITION BY, ORDER BY within OVER, and named windows.")
add("postgres-functions-window", "PostgreSQL Reference: Window Functions", "https://www.postgresql.org/docs/current/functions-window.html",
    "PostgreSQL Docs", "article", "free", 6, "sql", 0.3, None,
    "Reference list of ranking and value window functions and how frames affect them.")
add("neon-postgresql-cte", "PostgreSQL CTE Tutorial", "https://neon.com/postgresql/postgresql-tutorial/postgresql-cte", "Neon (PostgreSQL Tutorial)",
    "article", "free", 6, "sql", 0.5, None,
    "Example-driven guide to common table expressions, including recursive CTEs and combining CTEs with window functions.")
add("kaggle-advanced-sql", "Kaggle Learn: Advanced SQL", "https://www.kaggle.com/learn/advanced-sql", "Kaggle", "course", "free", 6, "sql", 4, None,
    "Follow-up micro-course on JOINs/UNIONs, analytic (window) functions, nested data and query efficiency in BigQuery.")
add("pgexercises", "PostgreSQL Exercises (pgexercises)", "https://pgexercises.com/", "pgexercises.com", "practice", "free", 6, "sql", 8, None,
    "About 80 exercises on a country-club database, building up to aggregates, window functions and recursive queries.")
add("datalemur-questions", "DataLemur SQL Interview Questions", "https://datalemur.com/questions", "DataLemur", "practice", "freemium", 6,
    "sql interview", 20, None,
    "200+ company-tagged SQL problems with an in-browser editor; many are free, some solutions need premium.")
add("datalemur-window-functions-questions", "12 SQL Window Functions Interview Questions",
    "https://datalemur.com/blog/sql-window-functions-interview-questions", "DataLemur", "article", "free", 6, "sql interview", 1, None,
    "Worked interview-style problems focused on ranking, LAG/LEAD and running totals.")
add("leetcode-sql-50", "LeetCode SQL 50 Study Plan", "https://leetcode.com/studyplan/top-sql-50/", "LeetCode", "practice", "free", 6,
    "sql interview", 20, None,
    "Fifty basic-to-intermediate SQL problems designed as a month-long practice plan.")
add("leetcode-advanced-sql-50", "LeetCode Advanced SQL 50", "https://leetcode.com/studyplan/premium-sql-50/", "LeetCode", "practice", "paid", 6,
    "sql interview", 25, None,
    "Premium plan of 50 harder, high-frequency SQL interview questions.")
add("hackerrank-sql-advanced", "HackerRank SQL (Advanced) Skills", "https://www.hackerrank.com/skills-directory/sql_advanced", "HackerRank",
    "practice", "free", 6, "sql", 5, None,
    "Outline and challenges for advanced joins, CTEs, window functions and correlated subqueries.")
add("stratascratch-advanced-sql", "Advanced SQL Interview Questions You Must Know",
    "https://www.stratascratch.com/blog/advanced-sql-interview-questions-you-must-know-how-to-answer", "StrataScratch", "article", "free", 6,
    "sql interview", 1, None,
    "Walkthroughs of hard real-company SQL problems with step-by-step solution logic.")
add("luke-sql-intermediate-project", "SQL for Data Analytics - Intermediate Course + Project", yt("QKIGsShyEsQ"), "Luke Barousse (YouTube)",
    "video", "free", 6, "sql portfolio", 4, "QKIGsShyEsQ",
    "Continues the beginner course with intermediate SQL and an end-to-end analysis project.")
add("baraa-sql-eda-project", "SQL Exploratory Data Analysis (EDA) Project", yt("6cJ5Ji8zSDg"), "Data with Baraa (YouTube)", "video", "free", 6,
    "sql portfolio", 2, "6cJ5Ji8zSDg",
    "Guided project exploring a sales database with SQL to produce business insights.")
add("datacamp-associate-data-analyst-sql", "DataCamp: Associate Data Analyst in SQL (track)",
    "https://www.datacamp.com/tracks/associate-data-analyst-in-sql", "DataCamp", "course", "paid", 6, "sql", 39, None,
    "Subscription track of SQL courses from basics to data manipulation and reporting.")
add("analystbuilder-questions", "Analyst Builder Practice Questions", "https://analystbuilder.com/questions?type=technical", "Analyst Builder",
    "practice", "freemium", 6, "sql python interview", 15, None,
    "SQL and Python practice problems in MySQL, PostgreSQL or SQL Server; some free, more with a subscription.")

# ---------------------------------------------------------------- Level 7: Visualization & BI
add("ms-learn-get-started-data-analytics", "Get Started with Microsoft Data Analytics (learning path)",
    "https://learn.microsoft.com/en-us/training/paths/data-analytics-microsoft/", "Microsoft Learn", "course", "free", 7,
    "powerbi orientation", 3, None,
    "Free introductory modules on the analyst role and the Power BI ecosystem.")
add("ms-learn-prepare-data-power-bi", "Prepare Data for Analysis with Power BI (learning path)",
    "https://learn.microsoft.com/en-us/training/paths/prepare-data-power-bi/", "Microsoft Learn", "course", "free", 7, "powerbi", 8, None,
    "PL-300 aligned path on connecting sources, cleaning and transforming in Power Query and loading data for modelling.")
add("ms-learn-prepare-visualize-power-bi", "Prepare and Visualize Data with Microsoft Power BI",
    "https://learn.microsoft.com/en-us/training/paths/prepare-visualize-data-power-bi/", "Microsoft Learn", "course", "free", 7,
    "powerbi visualization", 6, None,
    "Beginner path from connecting and shaping data to building an interactive report.")
add("ms-learn-pl-300t00", "Course PL-300T00: Design and Manage Analytics Solutions Using Power BI",
    "https://learn.microsoft.com/en-us/training/courses/pl-300t00", "Microsoft Learn", "course", "freemium", 7, "powerbi", 24, None,
    "Official course outline for PL-300; self-paced modules are free, instructor-led delivery is paid.")
add("ms-power-bi-data-analyst-cert", "Microsoft Certified: Power BI Data Analyst Associate (PL-300)",
    "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/", "Microsoft", "certification", "paid", 7,
    "powerbi career", 60, None,
    "Proctored exam on preparing, modelling, visualising and securing data in Power BI; renewable yearly via free online assessment.")
add("ms-practice-assessments", "Practice Assessments for Microsoft Certifications",
    "https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications", "Microsoft Learn",
    "practice", "free", 7, "powerbi", 2, None,
    "Free unlimited practice tests, including one for PL-300, with explanations for each answer.")
add("ms-pl-300-exam-readiness", "Preparing for PL-300: Prepare the Data (Exam Readiness Zone)",
    "https://learn.microsoft.com/en-us/shows/exam-readiness-zone/preparing-for-pl-300-prepare-the-data", "Microsoft Learn", "video", "free", 7,
    "powerbi", 1, None,
    "First of a four-part official video series reviewing PL-300 exam objectives.")
add("power-bi-desktop-download", "Download Power BI Desktop", "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-get-the-desktop",
    "Microsoft", "tool", "free", 7, "powerbi", 0.3, None,
    "Official instructions for installing the free Power BI Desktop authoring tool via Microsoft Store or direct download.")
add("power-bi-desktop-getting-started", "Get Started with Power BI Desktop", "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started",
    "Microsoft Learn", "article", "free", 7, "powerbi", 1, None,
    "Official guided tour: get data, shape it, build visuals and publish a report.")
add("dax-guide", "DAX Guide", "https://dax.guide/", "SQLBI", "article", "free", 7, "powerbi", None, None,
    "Complete reference of DAX functions with syntax, examples and product compatibility.")
add("sqlbi-dax-guides", "SQLBI DAX Articles & Guides", "https://www.sqlbi.com/guides/dax/", "SQLBI", "article", "free", 7, "powerbi", None, None,
    "Expert articles explaining DAX concepts such as filter context and CALCULATE.")
add("guy-in-a-cube-channel", "Guy in a Cube (YouTube channel)", "https://www.youtube.com/guyinacube", "Guy in a Cube", "video", "free", 7,
    "powerbi", None, None,
    "Weekly Power BI and Fabric tutorials and live Q&A from two Microsoft team members.")
add("guy-in-a-cube-start-journey", "Start Your Power BI Journey with Guy in a Cube", yt("XogUe3nvPto"), "Guy in a Cube (YouTube)", "video", "free", 7,
    "powerbi", 0.2, "XogUe3nvPto",
    "Orientation video pointing new users to the channel's beginner material.")
add("guy-in-a-cube-beginner-30min", "Power BI Tutorial for Beginners (Step-by-Step in 30 Minutes)", yt("OmW9YvxSl1E"), "Guy in a Cube (YouTube)",
    "video", "free", 7, "powerbi", 0.5, "OmW9YvxSl1E",
    "Quick end-to-end build of a first Power BI report.")
add("guy-in-a-cube-beginner-2025", "Power BI Beginner's Tutorial (2025)", yt("MikekdopYhE"), "Guy in a Cube (YouTube)", "video", "free", 7,
    "powerbi", 1, None,
    "Builds a simple data model and report from scratch with current Power BI features.")
add("kevin-stratvert-power-bi-beginners", "How to Use Microsoft Power BI - Tutorial for Beginners", yt("TmhQCQr_DCA"),
    "Kevin Stratvert (YouTube)", "video", "free", 7, "powerbi", 0.5, "TmhQCQr_DCA",
    "Widely watched beginner tutorial covering import, Power Query cleanup, relationships, visuals and publishing.")
add("luke-power-bi-for-data-analytics", "Power BI for Data Analytics - Full Course for Beginners", yt("FwjaHCVNBWA"), "Luke Barousse (YouTube)",
    "video", "free", 7, "powerbi", 6, "FwjaHCVNBWA",
    "Free analyst-focused Power BI course with project files covering Power Query, modelling, DAX and dashboards.")
add("maven-analytics-channel", "Maven Analytics (YouTube channel)", "https://www.youtube.com/channel/UCFqInmJykuVFKzi6uQl_ySg", "Maven Analytics",
    "video", "free", 7, "powerbi tableau excel sql", None, None,
    "Tutorials and feature walkthroughs for Excel, SQL, Power BI and Tableau from an analytics training company.")
add("tableau-free-training-videos", "Tableau Free Training Videos", "https://www.tableau.com/learn/training", "Tableau", "video", "free", 7,
    "tableau", 5, None,
    "Official short videos on connecting data, the workspace, maps, charts, dashboards and Tableau Prep.")
add("tableau-learn", "Learn Data and Analytics for Free with Tableau", "https://www.tableau.com/learn", "Tableau", "course", "free", 7,
    "tableau visualization", None, None,
    "Hub for Tableau's free getting-started videos, tutorials, webinars and community resources.")
add("tableau-public-how-to-videos", "Tableau Public How-To Videos", "https://public.tableau.com/app/learn/how-to-videos", "Tableau Public",
    "video", "free", 7, "tableau", 2, None,
    "Step-by-step videos building a dashboard with the Superstore sample data.")
add("tableau-public", "Tableau Public", "https://www.tableau.com/products/public", "Tableau", "tool", "free", 7, "tableau visualization portfolio", 0.3, None,
    "Free Tableau edition (desktop app and web authoring) for learning and publishing public vizzes; not for private or commercial data.")
add("tableau-viz-gallery", "Tableau Viz Gallery", "https://www.tableau.com/viz-gallery", "Tableau", "article", "free", 7,
    "tableau visualization storytelling", None, None,
    "Curated showcase of high-quality vizzes; many can be downloaded to study how they were built.")
add("trailhead-tableau-desktop-trail", "Get Started with Data Visualization in Tableau Desktop (Trailhead)",
    "https://trailhead.salesforce.com/content/learn/trails/get-started-with-data-visualization-in-tableau-desktop", "Salesforce Trailhead",
    "course", "free", 7, "tableau", 3, None,
    "Free trail of modules on the Tableau workflow, building charts and presenting results.")
add("trailhead-tableau-basics", "Visualize Data with Tableau Basics (Trailhead)", "https://trailhead.salesforce.com/content/learn/modules/learn-about-tableau",
    "Salesforce Trailhead", "course", "free", 7, "tableau", 0.5, None,
    "Short free module introducing Tableau products and features.")
add("tableau-certification", "Tableau Certification (Desktop Foundations / Specialist)", "https://www.tableau.com/learn/certification",
    "Tableau / Salesforce", "certification", "paid", 7, "tableau career", 30, None,
    "Overview of Tableau credentials; the entry-level Desktop exam suits learners with a few months of practice.")
add("tableau-desktop-specialist-exam-guide", "Tableau Desktop Specialist Exam Prep Guide (PDF)",
    "https://mkt.tableau.com/files/DesktopSpecialist_ExamGuide.pdf", "Tableau", "article", "free", 7, "tableau career", 0.5, None,
    "Official exam guide listing domains, weightings and format for the entry-level Tableau Desktop exam.")
add("tableau-certified-data-analyst", "Salesforce Certified Tableau Data Analyst", "https://www.tableau.com/learn/certification/certified-data-analyst",
    "Tableau / Salesforce", "certification", "paid", 7, "tableau career", 60, None,
    "Intermediate Tableau certification covering data prep, analysis and dashboard publishing.")
add("fcc-tableau-crash-course", "Tableau for Data Science and Data Visualization - Crash Course", yt("TPMlZxRRaBQ"), "freeCodeCamp",
    "video", "free", 7, "tableau visualization", 0.5, "TPMlZxRRaBQ",
    "Half-hour crash course on building interactive visualisations in Tableau.")
add("baraa-tableau-21h", "Tableau Ultimate Full Course (21 Hours) for Beginners", yt("K3pXnbniUcM"), "Data with Baraa (YouTube)",
    "video", "free", 7, "tableau visualization", 21, "K3pXnbniUcM",
    "Very detailed visual Tableau course from fundamentals to calculations, charts and dashboards.")
add("looker-studio-quick-start", "Looker Studio Quick Start Guide", "https://cloud.google.com/looker/docs/studio/quick-start-guide?hl=en",
    "Google Cloud", "article", "free", 7, "visualization", 0.5, None,
    "Six steps to create a report: connect data, add charts, view and share; defines connectors, dimensions and metrics.")
add("looker-studio-create-report", "Looker Studio Tutorial: Create a New Report",
    "https://support.google.com/looker-studio/answer/6292570?hl=en", "Google", "article", "free", 7, "visualization", 1, None,
    "Hands-on walkthrough building a dashboard from Google Analytics demo data.")
add("think-with-looker-studio", "Think with Looker Studio", "https://docs.cloud.google.com/looker/docs/studio/think-with-looker-studio",
    "Google Cloud", "article", "free", 7, "visualization", 0.3, None,
    "Conceptual overview of the connect-model-visualise-share workflow in Looker Studio.")
add("storytelling-with-data-blog", "Storytelling with Data Blog", "https://www.storytellingwithdata.com/blog", "Storytelling with Data",
    "article", "free", 7, "visualization storytelling", None, None,
    "Cole Nussbaumer Knaflic's team on improving graphs, chart makeovers and presenting data clearly.")
add("fundamentals-of-data-visualization", "Fundamentals of Data Visualization (Claus Wilke)", "https://clauswilke.com/dataviz/",
    "Claus O. Wilke", "book", "free", 7, "visualization storytelling", 15, None,
    "Free online book on choosing chart types, using colour well and avoiding common figure mistakes.")
add("data-to-viz", "From Data to Viz", "https://www.data-to-viz.com/", "Yan Holtz & Conor Healy", "article", "free", 7, "visualization", 1, None,
    "Decision tree that suggests suitable chart types for your data format, plus a gallery of common caveats.")
add("data-viz-project", "Data Viz Project", "https://datavizproject.com/", "Ferdio", "article", "free", 7, "visualization", 1, None,
    "Catalogue of 150+ chart types searchable by function, data input and shape.")
add("data-viz-catalogue", "The Data Visualisation Catalogue", "https://datavizcatalogue.com/", "Severino Ribecca", "article", "free", 7,
    "visualization", 1, None,
    "Reference of chart types with anatomy, use cases and tools, filterable by what you want to show.")
add("ft-visual-vocabulary", "Financial Times Visual Vocabulary", "https://ft-interactive.github.io/visual-vocabulary/", "Financial Times",
    "article", "free", 7, "visualization storytelling", 0.5, None,
    "Chart-selection guide organised by the data relationship you want to emphasise (ranking, change over time, part-to-whole...).")
add("rss-choosing-visualisation", "Best Practices for Data Visualisation: Choosing a Visualisation Type",
    "https://royal-statistical-society.github.io/datavisguide/docs/choosing.html", "Royal Statistical Society", "article", "free", 7,
    "visualization", 0.5, None,
    "Guidance on matching chart type to data and audience, pointing to chart-chooser tools.")
add("makeover-monday-tableau-blog", "Viz the #MakeoverMonday Challenge", "https://www.tableau.com/blog/viz-makeovermonday-challenge",
    "Tableau", "practice", "free", 7, "visualization tableau portfolio", None, None,
    "Explains the weekly community challenge of redesigning a chart from a supplied dataset.")
add("makeover-monday-vizwiz", "Makeover Monday Challenges (VizWiz)", "https://www.vizwiz.com/p/makeover-monday-challenges.html",
    "VizWiz (Andy Kriebel)", "practice", "free", 7, "visualization tableau", None, None,
    "Archive of Makeover Monday weeks with links to datasets and community makeovers.")
add("workout-wednesday-vizwiz", "Workout Wednesday (VizWiz)", "https://www.vizwiz.com/p/workout-wednesday.html", "VizWiz", "practice", "free", 7,
    "tableau visualization", None, None,
    "Weekly rebuild-this-viz Tableau challenges that stretch calculation and formatting skills.")
add("workout-wednesday-tableau-blog", "Make Time to Exercise Your Data Skills with Workout Wednesday",
    "https://www.tableau.com/blog/make-time-exercise-your-data-skills-workout-wednesday", "Tableau", "article", "free", 7, "tableau", 0.2, None,
    "Introduction to the Workout Wednesday community project and how to take part.")
add("workout-wednesday-power-bi", "Workout Wednesdays for Power BI", "https://www.sqlservercentral.com/blogs/workout-wednesdays-for-power-bi-in-2021",
    "SQLServerCentral", "practice", "free", 7, "powerbi visualization", None, None,
    "Announcement of the Power BI edition of Workout Wednesday, with the challenge format and how to share solutions.")

# ---------------------------------------------------------------- Level 8: Python / pandas
add("kaggle-learn", "Kaggle Learn (all micro-courses)", "https://www.kaggle.com/learn", "Kaggle", "course", "free", 8,
    "python pandas sql visualization", None, None,
    "Free hands-on micro-courses with in-browser notebooks and completion certificates.")
add("kaggle-python", "Kaggle Learn: Python", "https://www.kaggle.com/learn/python", "Kaggle", "course", "free", 8, "python", 5, None,
    "Core Python for data work: functions, booleans, lists, loops, strings, dictionaries and libraries.")
add("kaggle-pandas", "Kaggle Learn: Pandas", "https://www.kaggle.com/learn/pandas", "Kaggle", "course", "free", 8, "python pandas", 4, None,
    "Exercises on reading data, selecting, summarising, grouping, sorting, handling types and missing values, and combining tables.")
add("kaggle-data-cleaning", "Kaggle Learn: Data Cleaning", "https://www.kaggle.com/learn/data-cleaning", "Kaggle", "course", "free", 8,
    "python pandas", 4, None,
    "Handling missing values, scaling, parsing dates, character encodings and inconsistent entries.")
add("kaggle-data-visualization", "Kaggle Learn: Data Visualization", "https://www.kaggle.com/learn/data-visualization", "Kaggle", "course", "free", 8,
    "python visualization", 4, None,
    "Seaborn-based course on line, bar, heatmap, scatter and distribution plots, ending with your own project.")
add("kaggle-intro-to-ml", "Kaggle Learn: Intro to Machine Learning", "https://www.kaggle.com/learn/intro-to-machine-learning/course", "Kaggle",
    "course", "free", 8, "python", 3, None,
    "Optional stretch: first predictive models, validation, over/underfitting and random forests.")
add("kaggle-time-series", "Kaggle Learn: Time Series", "https://www.kaggle.com/learn/time-series", "Kaggle", "course", "free", 8, "python", 5, None,
    "Optional stretch on trend, seasonality, lag features and forecasting.")
add("kaggle-feature-engineering", "Kaggle Learn: Feature Engineering", "https://www.kaggle.com/learn/feature-engineering", "Kaggle", "course", "free", 8,
    "python pandas", 5, None,
    "Optional stretch on creating features with pandas, clustering, PCA and target encoding.")
add("kaggle-geospatial-analysis", "Kaggle Learn: Geospatial Analysis", "https://www.kaggle.com/learn/geospatial-analysis", "Kaggle", "course", "free", 8,
    "python visualization", 4, None,
    "Maps with GeoPandas, coordinate systems, interactive maps and proximity analysis.")
add("python-official-tutorial", "The Python Tutorial (official docs)", "https://docs.python.org/3/tutorial/index.html", "Python Software Foundation",
    "article", "free", 8, "python", 10, None,
    "Official tour of Python syntax, data structures, modules, errors and the standard library.")
add("pandas-10-minutes", "10 Minutes to pandas", "https://pandas.pydata.org/docs/user_guide/10min.html", "pandas", "article", "free", 8,
    "pandas", 1, None,
    "Official quick tour of creating, selecting, grouping, merging and reshaping DataFrames.")
add("pandas-getting-started", "pandas: Getting Started", "https://pandas.pydata.org/docs/getting_started/index.html", "pandas", "article", "free", 8,
    "pandas", 2, None,
    "Official installation notes and intro tutorials, including comparisons with SQL and spreadsheets.")
add("python-for-data-analysis-3e", "Python for Data Analysis, 3E (open access)", "https://wesmckinney.com/book/", "Wes McKinney",
    "book", "free", 8, "python pandas", 30, None,
    "The pandas creator's book, free to read online, covering NumPy, pandas, cleaning, aggregation and time series.")
add("python-data-science-handbook", "Python Data Science Handbook", "https://jakevdp.github.io/PythonDataScienceHandbook/", "Jake VanderPlas",
    "book", "free", 8, "python pandas visualization", 25, None,
    "Free online book of notebooks on IPython, NumPy, pandas, Matplotlib and scikit-learn.")
add("automate-the-boring-stuff", "Automate the Boring Stuff with Python", "https://www.automatetheboringstuff.com", "Al Sweigart",
    "book", "free", 8, "python", 20, None,
    "Beginner programming book (free online) with practical scripts for files, spreadsheets and web tasks.")
add("corey-schafer-pandas-playlist", "Corey Schafer: Pandas Tutorials (playlist)", ytpl("PLSLQ7uyfNIItZf404-TviaeM01pnebr5K"),
    "Corey Schafer (YouTube)", "video", "free", 8, "python pandas", 6, None,
    "Clear multi-part series on loading, selecting, filtering, grouping, cleaning and time-series data in pandas.")
add("corey-schafer-pandas-part-1", "Python Pandas Tutorial (Part 1): Getting Started", yt("ZyhVh-qRZPA"), "Corey Schafer (YouTube)",
    "video", "free", 8, "python pandas", 0.5, "ZyhVh-qRZPA",
    "Installing pandas and loading a real survey dataset into a DataFrame.")
add("corey-schafer-pandas-part-2", "Python Pandas Tutorial (Part 2): DataFrame and Series Basics", yt("zmdjNSmRXF4"),
    "Corey Schafer (YouTube)", "video", "free", 8, "python pandas", 0.5, "zmdjNSmRXF4",
    "Selecting rows and columns with loc and iloc.")
add("corey-schafer-pandas-part-10", "Python Pandas Tutorial (Part 10): Dates and Time Series", yt("UFuo7EHI8zc"),
    "Corey Schafer (YouTube)", "video", "free", 8, "python pandas", 0.6, "UFuo7EHI8zc",
    "Parsing dates, filtering by time and resampling.")
add("corey-schafer-pandas-part-11", "Python Pandas Tutorial (Part 11): Reading/Writing Data", yt("N6hyN6BW6ao"),
    "Corey Schafer (YouTube)", "video", "free", 8, "python pandas", 0.5, "N6hyN6BW6ao",
    "Moving data between pandas and CSV, Excel, JSON and SQL.")
add("corey-schafer-jupyter", "Jupyter Notebook Tutorial: Introduction, Setup, and Walkthrough", yt("HW29067qVWk"),
    "Corey Schafer (YouTube)", "video", "free", 8, "python", 0.4, "HW29067qVWk",
    "How to install and use Jupyter notebooks effectively.")
add("fcc-data-analysis-with-python-4h", "Learn Data Analysis with Python (4-hour course)", yt("r-uOLxNrNk8"), "freeCodeCamp",
    "video", "free", 8, "python pandas visualization", 4, "r-uOLxNrNk8",
    "Cleaning and transforming data with NumPy and pandas, plus Matplotlib/Seaborn charts.")
add("fcc-pandas-python-data-analysis-5h", "Learn Pandas & Python for Data Analysis [Full Course]", yt("gtjxAH8uaP0"), "freeCodeCamp",
    "video", "free", 8, "python pandas", 5, "gtjxAH8uaP0",
    "Seven practical projects from pandas basics to data cleaning and wrangling.")
add("luke-python-for-data-analytics", "Python for Data Analytics - Full Course for Beginners", yt("wUSDVGivd-8"), "Luke Barousse (YouTube)",
    "video", "free", 8, "python pandas visualization", 10, "wUSDVGivd-8",
    "Free analyst-focused Python course on a job-postings dataset with notes and practice problems.")
add("datacamp-data-analyst-python", "DataCamp: Data Analyst in Python (track)", "https://www.datacamp.com/tracks/data-analyst-with-python",
    "DataCamp", "course", "paid", 8, "python pandas statistics", 36, None,
    "Subscription track of nine courses from Python basics through pandas, visualisation and statistics.")
add("seaborn-tutorial", "An Introduction to seaborn", "https://seaborn.pydata.org/tutorial/introduction.html", "seaborn", "article", "free", 8,
    "python visualization", 1, None,
    "Official tutorial on statistical plotting with seaborn on top of pandas and matplotlib.")
add("matplotlib-quick-start", "Matplotlib Quick Start Guide", "https://matplotlib.org/stable/users/explain/quick_start.html", "Matplotlib",
    "article", "free", 8, "python visualization", 1, None,
    "Official guide to figures, axes and the two plotting interfaces.")
add("plotly-express", "Plotly Express in Python", "https://plotly.com/python/plotly-express/", "Plotly", "article", "free", 8,
    "python visualization", 1, None,
    "Docs for the high-level interactive charting API, with many one-line examples.")
add("anaconda-download", "Anaconda Distribution", "https://www.anaconda.com/download", "Anaconda", "tool", "free", 8, "python", 0.5, None,
    "Installer bundling Python, Jupyter, JupyterLab and common data libraries for local analysis.")
add("jupyter-install-docs", "Installing Jupyter Notebook", "https://docs.jupyter.org/en/latest/install/notebook-classic.html", "Project Jupyter",
    "tool", "free", 8, "python", 0.3, None,
    "Official instructions for installing the notebook interface with Anaconda or pip.")
add("google-colab", "Google Colab", "https://colab.research.google.com/", "Google", "tool", "free", 8, "python pandas", 0.2, None,
    "Free hosted Jupyter notebooks in the browser; nothing to install, needs a Google account.")
add("vscode-jupyter-notebooks", "Jupyter Notebooks in VS Code", "https://code.visualstudio.com/docs/datascience/jupyter-notebooks",
    "Visual Studio Code", "tool", "free", 8, "python", 0.5, None,
    "Running notebooks inside VS Code, choosing kernels and inspecting DataFrames.")
add("vscode-data-science-tutorial", "Data Science in VS Code Tutorial", "https://code.visualstudio.com/docs/datascience/data-science-tutorial",
    "Visual Studio Code", "article", "free", 8, "python pandas", 1, None,
    "Guided setup of a Python environment and a small end-to-end analysis in VS Code.")
add("vscode-data-wrangler", "Data Wrangler in VS Code", "https://code.visualstudio.com/docs/datascience/data-wrangler", "Visual Studio Code",
    "tool", "free", 8, "python pandas", 0.3, None,
    "Visual data-cleaning tool that generates pandas code as you work.")
add("r4ds-2e", "R for Data Science (2e)", "https://r4ds.hadley.nz/", "Wickham, Cetinkaya-Rundel & Grolemund", "book", "free", 8,
    "r visualization", 40, None,
    "Free online book on importing, tidying, transforming and visualising data with the tidyverse; the R alternative to pandas.")
add("rstudio-desktop", "RStudio Desktop (Posit)", "https://posit.co/download/rstudio-desktop", "Posit", "tool", "free", 8, "r", 0.3, None,
    "Free IDE for R; install R from CRAN first.")
add("cran-r-project", "CRAN: The R Project", "https://cran.r-project.org/", "R Foundation", "tool", "free", 8, "r", 0.2, None,
    "Official download site for the R language and its packages.")
add("islr-statlearning", "An Introduction to Statistical Learning (free PDF, R and Python editions)", "https://statlearning.com",
    "James, Witten, Hastie, Tibshirani", "book", "free", 8, "statistics python r", 60, None,
    "Free textbook on regression, classification and resampling with labs; a stretch resource beyond core analyst work.")

# ---------------------------------------------------------------- Level 9: Business / A/B testing / case studies
add("udacity-ab-testing", "Introduction to A/B Testing (Udacity, with Google)", "https://www.udacity.com/course/ab-testing--ud257",
    "Udacity", "course", "free", 9, "ab-testing statistics business", 30, None,
    "Free course on choosing metrics, sizing experiments, analysing results and ethics, taught by Google practitioners.")
add("udacity-ab-testing-business-analysts", "A/B Testing for Business Analysts (Udacity)",
    "https://www.udacity.com/course/ab-testing-business-analysts--ud979", "Udacity", "course", "free", 9, "ab-testing business", 10, None,
    "Designing business experiments, randomised and matched-pair designs, and interpreting results.")
add("evan-miller-how-not-to-ab-test", "How Not To Run an A/B Test", "https://www.evanmiller.org/how-not-to-run-an-ab-test.html",
    "Evan Miller", "article", "free", 9, "ab-testing statistics", 0.3, None,
    "Classic essay on why peeking and stopping early inflates false positives, and how to fix sample size in advance.")
add("evan-miller-sample-size", "Sample Size Calculator (Evan's Awesome A/B Tools)", "https://www.evanmiller.org/ab-testing/sample-size.html",
    "Evan Miller", "tool", "free", 9, "ab-testing statistics", 0.2, None,
    "Calculator for subjects needed per variant given baseline rate, minimum detectable effect, power and significance.")
add("evan-miller-ab-tools", "Evan's Awesome A/B Tools", "https://www.evanmiller.org/ab-testing/", "Evan Miller", "tool", "free", 9,
    "ab-testing statistics", 0.5, None,
    "Suite of free calculators: chi-squared, t-test, sequential sampling, survival curves and more.")
add("evan-miller-low-base-rate", "The Low Base Rate Problem", "https://www.evanmiller.org/the-low-base-rate-problem.html", "Evan Miller",
    "article", "free", 9, "ab-testing statistics", 0.3, None,
    "Why experiments on low conversion rates need very large samples.")
add("hbr-refresher-ab-testing", "A Refresher on A/B Testing", "https://hbr.org/2017/06/a-refresher-on-ab-testing", "Harvard Business Review",
    "article", "freemium", 9, "ab-testing business", 0.2, None,
    "Manager-friendly overview of randomisation, blocking, multivariate tests and common mistakes.")
add("hbr-pick-metrics-ahead", "When Designing an A/B Test, Pick Your Metrics Ahead of Time",
    "https://hbr.org/tip/2017/12/when-designing-an-ab-test-pick-your-metrics-ahead-of-time", "Harvard Business Review", "article", "freemium", 9,
    "ab-testing business", 0.1, None,
    "Short tip on avoiding metric-shopping after a test runs.")
add("hbr-4-analytics-concepts", "4 Analytics Concepts Every Manager Should Understand",
    "https://hbr.org/2018/10/4-analytics-concepts-every-manager-should-understand", "Harvard Business Review", "article", "freemium", 9,
    "business statistics", 0.2, None,
    "Business framing of core analytical ideas analysts must explain to stakeholders.")
add("hbr-guide-data-analytics-basics", "HBR Guide to Data Analytics Basics for Managers",
    "https://store.hbr.org/product/hbr-guide-to-data-analytics-basics-for-managers-toolkit-updated-and-expanded/10849", "Harvard Business Review",
    "book", "paid", 9, "business storytelling", 6, None,
    "Paid guide on asking the right questions of data and communicating results to decision-makers.")
add("trustworthy-online-controlled-experiments", "Trustworthy Online Controlled Experiments (Kohavi, Tang, Xu)",
    "https://www.goodreads.com/book/show/51635906", "Cambridge University Press", "book", "paid", 9, "ab-testing business statistics", 15, None,
    "Practitioner book on running reliable online experiments: metrics, OEC, trustworthiness checks and pitfalls.")
add("mode-sql-analytics-training", "Mode SQL Analytics Training (business cases)",
    "https://mode.com/resources/sql-tutorial/sql-business-analytics-training", "Mode", "practice", "free", 9, "sql business ab-testing", 6, None,
    "Three realistic case studies that require strong SQL: engagement drop, search analysis and A/B test validation.")
add("mode-drop-in-user-engagement", "Case: Investigating a Drop in User Engagement", "https://mode.com/sql-tutorial/a-drop-in-user-engagement/",
    "Mode", "practice", "free", 9, "sql business", 2, None,
    "Diagnose a weekly engagement dip by ranking hypotheses and testing them with SQL cohorts and segments.")
add("mode-validating-ab-test", "Case: Validating A/B Test Results", "https://mode.com/resources/sql-tutorial/validating-ab-test-results",
    "Mode", "practice", "free", 9, "sql ab-testing", 2, None,
    "Check whether a surprising experiment result holds up by examining assignment and metric logic.")
add("amplitude-product-analytics-guide", "What Is Product Analytics? A Data-Backed Guide",
    "https://amplitude.com/explore/analytics/product-analytics-guide", "Amplitude", "article", "free", 9, "business", 0.5, None,
    "Overview of product analytics: events, funnels, retention and setting up a tracking plan.")
add("amplitude-product-metrics", "15 Important Product Metrics You Should Track", "https://amplitude.com/blog/product-metrics-guide",
    "Amplitude", "article", "free", 9, "business", 0.3, None,
    "Definitions of common product KPIs such as activation, retention, stickiness and churn.")
add("amplitude-north-star", "Find Your North Star (North Star Framework hub)", "https://amplitude.com/north-star-hub", "Amplitude",
    "article", "free", 9, "business", 1, None,
    "Resources on choosing one metric that reflects customer value and leads revenue.")
add("amplitude-7-percent-retention", "The 7% Retention Rule Explained", "https://amplitude.com/blog/7-percent-retention-rule", "Amplitude",
    "article", "free", 9, "business", 0.2, None,
    "Benchmark-based discussion of early retention as a signal of long-term product health (vendor data).")
add("amplitude-customer-analytics", "What Is Customer Analytics? Metrics & Best Practices", "https://amplitude.com/blog/customer-analytics-metrics",
    "Amplitude", "article", "free", 9, "business", 0.3, None,
    "Customer-level metrics such as lifetime value, segmentation and cohort comparisons.")
add("mixpanel-product-analytics", "What Is Product Analytics? A Complete Guide", "https://mixpanel.com/blog/what-is-product-management-analytics/",
    "Mixpanel", "article", "free", 9, "business", 0.5, None,
    "Explains goals vs KPIs vs metrics, cohort analysis and avoiding vanity metrics.")
add("mixpanel-north-star-vs-kpi-tree", "North Star Maps vs Algebraic KPI Trees", "https://mixpanel.com/blog/north-star-framework-vs-kpi-tree/",
    "Mixpanel", "article", "free", 9, "business", 0.3, None,
    "Two ways to break a top-level metric into drivers analysts can measure and influence.")
add("ga4-demo-account", "Google Analytics Demo Account", "https://support.google.com/analytics/answer/10993011?hl=en", "Google",
    "dataset", "free", 9, "business visualization", 1, None,
    "Fully functional GA4 account with real e-commerce demo data for practising web and marketing analysis.")
add("ga-analytics-academy", "Analytics Academy on Skillshop", "https://support.google.com/analytics/answer/15440208?hl=en", "Google",
    "course", "free", 9, "business", 6, None,
    "Free Google Analytics courses and certification hosted on Skillshop.")
add("google-skillshop", "Google Skillshop", "https://skillshop.withgoogle.com/", "Google", "certification", "free", 9, "business career", None, None,
    "Free training and certifications for Google Analytics and Google's marketing tools.")
add("fcc-python-eda-ab-testing", "Learn Python for Data Science: EDA, A/B Testing & BI Case Studies", yt("FTpmwX94_Yo"), "freeCodeCamp",
    "video", "free", 9, "python pandas ab-testing business", 5.5, "FTpmwX94_Yo",
    "Python analytics course with A/B testing fundamentals and two end-to-end business case studies.")
add("statquest-statistical-power", "Statistical Power, Clearly Explained", yt("Rsc5znwR5FA"), "StatQuest (YouTube)", "video", "free", 9,
    "statistics ab-testing", 0.2, "Rsc5znwR5FA",
    "Intuition for power and why sample size matters before running an experiment.")
add("google-advanced-da-bi-certificates", "Google Advanced Data Analytics & Business Intelligence Certificates (announcement)",
    "https://blog.coursera.org/google-advanced-data-analytics-business-intelligence-certificates/", "Coursera Blog", "certification", "paid", 9,
    "business statistics python career", 150, None,
    "Describes Google's follow-on certificates for learners who finished the entry-level program.")

# ---------------------------------------------------------------- Level 10: Capstone, portfolio, career, interview
add("ibm-data-analyst-capstone", "IBM Data Analyst Capstone Project", "https://www.coursera.org/learn/ibm-data-analyst-capstone-project",
    "IBM / Coursera", "course", "freemium", 10, "portfolio python sql visualization", 20, None,
    "Capstone using developer-survey data: collect, wrangle, analyse and build a dashboard for a portfolio piece.")
add("alex-portfolio-project-sql", "Data Analyst Portfolio Project: SQL Data Exploration", yt("qfyynHBFOsM"), "Alex The Analyst (YouTube)",
    "video", "free", 10, "portfolio sql", 1.5, "qfyynHBFOsM",
    "First of a guided project series exploring COVID data in SQL before visualising it in Tableau.")
add("mo-chen-portfolio-projects-playlist", "Data Analysis Portfolio Projects (playlist)", ytpl("PLodYDTuHA29aa_5UPCNg_g5fyleHxTZPU"),
    "Mo Chen (YouTube)", "video", "free", 10, "portfolio", 5, None,
    "Collection of project walkthroughs showing how to scope and present analyst portfolio work.")
add("mo-chen-channel", "Mo Chen (YouTube channel)", "https://www.youtube.com/@mo-chen", "Mo Chen", "video", "free", 10,
    "career portfolio", None, None,
    "Career-switcher focused channel on analyst job hunting, portfolios and day-to-day work.")
add("ken-jee-channel", "Ken Jee (YouTube channel)", "https://www.youtube.com/channel/UCiT9RITQ9PW6BhXK0y2jaeg", "Ken Jee", "video", "free", 10,
    "career portfolio", None, None,
    "Data career advice, project ideas and the 66 Days of Data habit challenge.")
add("tina-huang-first-data-job", "How to Land Your First Data Science Job (Tina Huang)", yt("a5rIgAjMNQM"), "YouTube", "video", "free", 10,
    "career interview", 1, "a5rIgAjMNQM",
    "Talk on resumes, projects and interview preparation for first data roles.")
add("maven-portfolio-guide", "How to Build a Strong Data Analyst Project Portfolio",
    "https://mavenanalytics.io/blog/how-to-build-a-strong-data-analyst-project-portfolio", "Maven Analytics", "article", "free", 10,
    "portfolio storytelling", 0.3, None,
    "Advice on framing each project around a business question and leading with the key dashboard.")
add("careerfoundry-portfolio-guide", "How to Build a Data Analyst Portfolio That Will Get You Hired",
    "https://careerfoundry.com/en/blog/data-analytics/data-analyst-portfolio/", "CareerFoundry", "article", "free", 10, "portfolio", 0.3, None,
    "What to include: varied data sources, documented cleaning and a range of analysis methods.")
add("365ds-portfolio-guide", "How to Build a Data Analyst Portfolio: 8-Step Guide",
    "https://365datascience.com/career-advice/how-to-build-a-data-analyst-portfolio/", "365 Data Science", "article", "free", 10, "portfolio", 0.3, None,
    "Step-by-step checklist from choosing projects to publishing them.")
add("edgewood-portfolio-guide", "How to Build a Data Analyst Portfolio (Edgewood)",
    "https://online.edgewood.edu/blog/how-to-build-a-data-analyst-portfolio/", "Edgewood University", "article", "free", 10, "portfolio", 0.3, None,
    "Suggests a case-study structure: problem, data, method, insights and recommendations.")
add("maven-data-playground", "Maven Analytics Data Playground", "https://mavenanalytics.io/data-playground", "Maven Analytics", "dataset", "free", 10,
    "portfolio", None, None,
    "Free practice datasets (retail, finance, sports, healthcare...) sized for portfolio projects; some need a free login.")
add("maven-restaurant-orders", "Maven Dataset: Restaurant Orders", "https://mavenanalytics.io/data-playground/restaurant-orders",
    "Maven Analytics", "dataset", "free", 10, "portfolio sql excel", None, None,
    "Small fictional restaurant order dataset ideal for a first SQL or Excel project.")
add("maven-marketing-campaign", "Maven Dataset: Marketing Campaign Results", "https://mavenanalytics.io/data-playground/marketing-campaign-results",
    "Maven Analytics", "dataset", "free", 10, "portfolio business ab-testing", None, None,
    "Customer-level campaign data suited to segmentation and response analysis.")
add("maven-crm-sales", "Maven Dataset: CRM Sales Opportunities", "https://mavenanalytics.io/data-playground/crm-sales-opportunities",
    "Maven Analytics", "dataset", "free", 10, "portfolio powerbi tableau", None, None,
    "B2B sales pipeline data good for a sales dashboard project.")
add("kaggle-datasets", "Kaggle Datasets", "https://www.kaggle.com/datasets", "Kaggle", "dataset", "free", 10, "portfolio", None, None,
    "Hundreds of thousands of public datasets searchable by topic, size, file type and licence.")
add("data-gov", "Data.gov", "https://www.data.gov/", "U.S. General Services Administration", "dataset", "free", 10, "portfolio", None, None,
    "U.S. government open-data catalogue linking to hundreds of thousands of federal, state and local datasets.")
add("our-world-in-data", "Our World in Data", "https://ourworldindata.org/", "Our World in Data", "dataset", "free", 10,
    "portfolio visualization", None, None,
    "CC-BY research data and charts on global development topics, each downloadable as CSV with metadata.")
add("owid-reuse-data", "Our World in Data: Easier to Reuse Our Data", "https://ourworldindata.org/easier-to-reuse-our-data",
    "Our World in Data", "article", "free", 10, "portfolio", 0.2, None,
    "How to download chart data as CSV/JSON or pull it by URL for your own analysis.")
add("google-dataset-search", "Google Dataset Search", "https://datasetsearch.research.google.com/", "Google", "dataset", "free", 10,
    "portfolio", None, None,
    "Search engine for datasets across government, academic and news publishers, filterable by format and licence.")
add("tableau-public-about", "Tableau Public: Build a Public Portfolio", "https://public.tableau.com/app/about", "Tableau Public", "tool", "free", 10,
    "portfolio tableau", None, None,
    "Free profile for publishing interactive dashboards that recruiters can explore.")
add("github-pages", "GitHub Pages", "https://pages.github.com/", "GitHub", "tool", "free", 10, "portfolio git", 1, None,
    "Free static hosting for a personal portfolio site straight from a GitHub repository.")
add("github-pages-quickstart", "Quickstart for GitHub Pages", "https://docs.github.com/en/pages/quickstart", "GitHub Docs", "article", "free", 10,
    "portfolio git", 0.5, None,
    "Official step-by-step guide to publishing a username.github.io site.")
add("git-scm-learn", "Git - Learn (incl. Pro Git book)", "https://git-scm.com/learn", "git-scm.com", "book", "free", 10, "git", 10, None,
    "Official Git learning page with the free Pro Git book, videos and cheat sheets.")
add("pro-git-repo", "Pro Git 2nd Edition (source)", "https://github.com/progit/progit2", "Scott Chacon & Ben Straub", "book", "free", 10, "git", 10, None,
    "Open-source repository of the Pro Git book under a Creative Commons licence.")
add("github-learning-resources", "Git and GitHub Learning Resources",
    "https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources", "GitHub Docs", "article", "free", 10, "git", 1, None,
    "Official list of GitHub Skills interactive courses, videos and docs for learning version control.")
add("datalemur-sql-cheat-sheet", "SQL Interview Cheat Sheet", "https://datalemur.com/blog/sql-interview-cheat-sheet", "DataLemur", "article", "free", 10,
    "sql interview", 0.5, None,
    "Condensed reference of SQL syntax and patterns most often tested in interviews.")
add("datalemur-data-analyst-sql-questions", "SQL Interview Questions for Data Analysts", "https://datalemur.com/blog/data-analyst-sql-interview-questions",
    "DataLemur", "article", "free", 10, "sql interview", 1, None,
    "Analyst-specific SQL interview problems with explanations.")
add("datalemur-cram-sql-interviews", "How to Cram for SQL Interview Tests & Assessments",
    "https://datalemur.com/blog/how-to-cram-for-sql-interview-tests-assessments", "DataLemur", "article", "free", 10, "sql interview", 0.3, None,
    "Short-timeline study plan for take-home or timed SQL assessments.")
add("stratascratch-sql-ultimate-guide", "SQL Interview Questions You Must Prepare: The Ultimate Guide",
    "https://www.stratascratch.com/blog/sql-interview-questions-you-must-prepare-the-ultimate-guide", "StrataScratch", "article", "free", 10,
    "sql interview", 1, None,
    "Structured guide covering conceptual and coding SQL questions with real company examples.")
add("stratascratch-data-analyst-sql", "SQL Interview Questions for the Data Analyst Position",
    "https://www.stratascratch.com/blog/sql-interview-questions-for-the-data-analyst-position", "StrataScratch", "article", "free", 10,
    "sql interview", 0.5, None,
    "Analyst-role SQL problems with worked solutions.")
add("stratascratch-500-sql-questions", "500 SQL Interview Questions from Real Companies",
    "https://www.stratascratch.com/blog/500-sql-interview-questions-from-real-companies", "StrataScratch", "practice", "freemium", 10,
    "sql interview", 30, None,
    "Large bank of company-tagged SQL questions; many free, full access with a subscription.")
add("interview-query-data-analyst-questions", "Data Analyst Interview Questions (Interview Query)",
    "https://interviewquery.com/p/data-analyst-interview-questions", "Interview Query", "article", "freemium", 10,
    "interview sql statistics business", 1, None,
    "Overview of SQL, statistics, product-sense and behavioural questions asked of analysts.")
add("interview-query-sql-platforms", "Best Platforms to Practice SQL", "https://www.interviewquery.com/p/platforms-to-practice-sql",
    "Interview Query", "article", "free", 10, "sql interview", 0.3, None,
    "Compares SQL practice platforms by purpose: beginners, interview prep and real-world data.")
add("nau-data-analyst-interview-guide", "Top Data Analyst Interview Questions (2025 Guide)",
    "https://frankecareer.nau.edu/blog/2025/06/24/top-data-analyst-interview-questions-2025-guide/", "Northern Arizona University Career",
    "article", "free", 10, "interview career", 0.3, None,
    "University career-office guide covering the interview process, STAR answers and common technical prompts.")
add("analystbuilder-mysql-interview-course", "MySQL Interview Crash Course (Analyst Builder)",
    "https://analystbuilder.com/courses/mysql-interview-crash-course", "Analyst Builder", "course", "freemium", 10, "sql interview", 6, None,
    "Lessons and real interview-style questions to prepare for SQL technical rounds.")
add("analystbuilder-home", "Analyst Builder", "https://analystbuilder.com/", "Analyst Builder", "practice", "freemium", 10,
    "sql python interview portfolio", None, None,
    "Alex Freberg's platform of practice questions, courses and projects; free tier plus paid plans.")
add("enhancv-data-analyst-resume", "Data Analyst Resume Examples & Guide", "https://enhancv.com/resume-examples/data-analyst/", "Enhancv",
    "article", "free", 10, "career", 0.5, None,
    "Annotated resume examples with section-by-section advice on summaries, skills and quantified impact.")
add("beamjobs-data-analyst-resume", "Data Analyst Resume Examples", "https://www.beamjobs.com/resumes/data-analyst-resume-examples", "BeamJobs",
    "article", "free", 10, "career", 0.5, None,
    "Many sample resumes for entry-level and specialised analyst roles.")
add("analytixlabs-resume-guide", "Data Analyst Resume: A Complete Guide", "https://www.analytixlabs.co.in/blog/data-analyst-resume-a-complete-guide/",
    "AnalytixLabs", "article", "free", 10, "career", 0.5, None,
    "Explains how to present projects in place of experience for fresher resumes, with examples by level.")
add("linkedin-student-profile-tips", "Student Job Seekers: Tips to Building the Perfect LinkedIn Profile",
    "https://www.linkedin.com/blog/member/product/student-job-seekers-tips-to-building-the-perfect-linkedin-profile", "LinkedIn", "article", "free", 10,
    "career", 0.2, None,
    "Official advice on photos, headlines, summaries and listing projects or volunteer work.")
add("linkedin-find-jobs-help", "Find Jobs on LinkedIn (Help)", "https://www.linkedin.com/help/linkedin/answer/a509392", "LinkedIn", "article", "free", 10,
    "career", 0.2, None,
    "Official tips on job search, Open to Work and tracking applications.")
add("linkedin-learning-become-data-analyst", "Become a Data Analyst (LinkedIn Learning path)",
    "https://www.linkedin.com/learning/paths/become-a-data-analyst", "LinkedIn Learning", "course", "paid", 10, "career excel sql powerbi", 41, None,
    "Subscription path of about a dozen courses across analyst tools and soft skills, with a certificate.")
add("coursera-data-analytics-certifications", "Popular Data Analytics Certifications: 2026 Guide",
    "https://www.coursera.org/articles/data-analytics-certification", "Coursera", "article", "free", 10, "career", 0.3, None,
    "Survey of common analytics certificates and what each signals to employers.")
add("coursera-google-career-certificates", "Google Career Certificates on Coursera", "https://www.coursera.org/google-career-certificates",
    "Google / Coursera", "certification", "paid", 10, "career", None, None,
    "Listing of Google's professional certificates, including Data Analytics, Advanced Data Analytics and Business Intelligence.")
add("comptia-data-plus", "CompTIA Data+ vs Other Certifications",
    "https://www.comptia.org/en-us/blog/comptia-data-vs.-other-certifications-is-data-worth-the-investment", "CompTIA", "certification", "paid", 10,
    "career", 40, None,
    "Explains the vendor-neutral Data+ exam domains and how it compares with tool-specific certificates.")
add("google-comptia-dual-credential", "Google Advanced Data Analytics + CompTIA Data+ Dual Credential",
    "https://www.credly.com/org/coursera/badge/google-advanced-data-analytics-certificate-comptia-", "Credly / Coursera", "certification", "paid", 10,
    "career", None, None,
    "Badge description for learners who complete Google's advanced certificate and pass Data+.")
add("datatalks-club-slack", "DataTalks.Club Slack Community", "https://datatalks.club/slack.html", "DataTalks.Club", "community", "free", 10,
    "career", None, None,
    "Large free Slack community for data professionals with career channels and course cohorts.")
add("datatalks-club-courses", "Guide to Free Online Courses at DataTalks.Club", "https://datatalks.club/blog/guide-to-free-online-courses-at-datatalks-club.html", "DataTalks.Club", "article", "free", 10,
    "career python sql", None, None,
    "Free open-source zoomcamps (data engineering, ML and more) for after you land the analyst basics.")
add("reddit-dataanalysis", "r/dataanalysis", "https://www.reddit.com/r/dataanalysis/", "Reddit", "community", "free", 10, "career", None, None,
    "Subreddit for analysis techniques, tools and resources; career-entry questions are redirected to r/DataAnalysisCareers.")
add("reddit-dataanalysiscareers", "r/DataAnalysisCareers", "https://www.reddit.com/r/DataAnalysisCareers/", "Reddit", "community", "free", 10,
    "career", None, None,
    "Companion subreddit for breaking-in, certificate, resume and interview questions.")
add("reddit-analytics", "r/analytics", "https://www.reddit.com/r/analytics/", "Reddit", "community", "free", 10, "career business", None, None,
    "Discussion community for working analytics professionals on tools, careers and practice.")
add("skyvia-best-subreddits", "Best Subreddits for Data Analysts", "https://skyvia.com/blog/best-subreddits-for-data-analysts/", "Skyvia",
    "article", "free", 10, "career", 0.2, None,
    "Guide to which subreddits suit beginners, practitioners and specific tools.")
add("superdatascience-avery-smith", "SDS 893: How to Jumpstart Your Data Career (Avery Smith)", "https://superdatascience.com/893",
    "Super Data Science Podcast", "video", "free", 10, "career portfolio", 1, None,
    "Podcast episode with Avery Smith on a project-first ladder for landing a first data job.")
add("talkpython-land-first-data-job", "Talk Python #455: Land Your First Data Job", "https://talkpython.fm/455", "Talk Python To Me",
    "video", "free", 10, "career", 1, None,
    "Podcast interview with Avery Smith on skills, projects and job-search tactics for aspiring analysts.")
add("datacamp-best-analytics-courses", "The Best Analytics Courses for All Levels", "https://www.datacamp.com/blog/best-analytics-courses",
    "DataCamp", "article", "free", 10, "career", 0.3, None,
    "Vendor round-up of analytics courses by level, useful for planning next steps after this path.")


def slug_ok(s):
    return re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", s) is not None


def build():
    out, seen_ids, seen_urls = [], set(), set()
    for (id_, title, url, provider, type_, cost, level, skills, hours, ytid, summary) in R:
        skills_l = skills.split()
        problems = []
        if not slug_ok(id_): problems.append("bad id")
        if id_ in seen_ids: problems.append("duplicate id")
        if url in seen_urls: problems.append("duplicate url")
        if type_ not in ALLOWED_TYPES: problems.append("type " + type_)
        if cost not in ALLOWED_COST: problems.append("cost " + cost)
        if not (1 <= level <= 10): problems.append("level")
        bad = [s for s in skills_l if s not in ALLOWED_SKILLS]
        if bad: problems.append("skills %s" % bad)
        if problems:
            sys.exit("Invalid entry %s: %s" % (id_, "; ".join(problems)))
        seen_ids.add(id_)
        seen_urls.add(url)
        out.append({
            "id": id_, "title": title, "url": url, "provider": provider, "type": type_,
            "cost": cost, "level": level, "skills": skills_l, "est_hours": hours,
            "summary": summary, "youtube_id": ytid, "verified_at": VERIFIED_AT,
        })
    return out


def main():
    data = build()
    # Preserve link-check results ("dead" flags) from a previous run when present.
    if os.path.exists(OUT):
        try:
            with open(OUT, encoding="utf-8") as f:
                old = {e["id"]: e for e in json.load(f)}
            for e in data:
                if old.get(e["id"], {}).get("dead"):
                    e["dead"] = True
        except (ValueError, KeyError):
            pass
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("Wrote %d resources to %s" % (len(data), os.path.normpath(OUT)))


if __name__ == "__main__":
    main()
