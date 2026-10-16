import type { Floor } from '../types';

export const floor8: Floor = {
  id: 8,
  title: "Python for Analysis",
  tagline: "Automate the boring parts and handle data too big for a spreadsheet with Python and pandas.",
  color: "#a855f7",
  icon: "🐍",
  outcomes: [
    "Write basic Python (variables, lists, dicts, loops, functions) in Jupyter or Colab",
    "Load, inspect and select data with pandas DataFrames",
    "Filter, clean and fix data types and duplicates reliably",
    "Summarize and combine data with groupby, agg and merge",
    "Run a quick exploratory analysis with matplotlib and seaborn charts",
  ],
  steps: [
    {
      id: "f8-s1",
      title: "Python Basics for Analysts (in a Notebook)",
      minutes: 18,
      xp: 120,
      skills: ["python"],
      game: { kind: "pandas-lab", stage: 0 },
      lesson: [
        {
          heading: "Why Python, and where to write it",
          body: "Excel struggles past a million rows and every manual step must be repeated by hand. Python lets you write the steps once and re-run them on any new file in seconds.\n\nAnalysts mostly work in **notebooks**: **Jupyter** (installed locally, often via Anaconda) or **Google Colab** (free in the browser, nothing to install). A notebook has **cells**: you run one with **Shift+Enter** and the output appears right underneath. You can mix code, charts and notes in one document.",
          tip: "Start with Google Colab. It has pandas, matplotlib and seaborn pre-installed.",
        },
        {
          heading: "Variables and data types",
          body: "A **variable** is a name that stores a value. The common types:\n\n- `int` whole numbers: `orders = 42`\n- `float` decimals: `price = 19.99`\n- `str` text: `region = 'West'`\n- `bool` True/False: `is_active = True`\n\nUse `type(x)` to check a type and `print(x)` to display a value. In a notebook, the last line of a cell displays automatically.",
          example: `revenue = 12500.0
orders = 250
aov = revenue / orders          # average order value
print(f"AOV is {aov:.2f}")      # AOV is 50.00`,
          exampleLang: "python",
        },
        {
          heading: "Lists and dictionaries",
          body: "- A **list** is an ordered collection: `[ ... ]`. Access items by position, starting at **0**.\n- A **dictionary** stores **key: value** pairs: `{ ... }`. Look things up by key.\n\nDictionaries are everywhere in data work: a row of data, a mapping of codes to names, or settings for a chart.",
          example: `regions = ["North", "South", "East", "West"]
print(regions[0])        # North
print(len(regions))      # 4
regions.append("Central")

target = {"North": 50000, "South": 42000}
print(target["South"])   # 42000
target["East"] = 39000   # add a new key`,
          exampleLang: "python",
        },
        {
          heading: "Loops and conditions",
          body: "A `for` loop repeats code for each item. `if / elif / else` makes decisions. Indentation (4 spaces) shows what's inside the loop or condition — Python is strict about it.",
          example: `sales = {"North": 52000, "South": 38000, "East": 41000}
target = 40000

for region, amount in sales.items():
    if amount >= target:
        print(f"{region}: hit target")
    else:
        print(f"{region}: missed by {target - amount}")`,
          exampleLang: "python",
          tip: "With pandas you'll rarely loop over rows — vectorized operations are faster. But loops are great for repeating a task across files or columns.",
        },
        {
          heading: "Functions: reusable steps",
          body: "A **function** wraps logic you use repeatedly. Define it with `def`, give it inputs (parameters) and `return` a result. If you've copy-pasted the same code three times, make it a function.",
          example: `def pct_change(old, new):
    """Return percentage change from old to new."""
    if old == 0:
        return None
    return round((new - old) / old * 100, 1)

pct_change(200, 250)   # 25.0`,
          exampleLang: "python",
        },
      ],
      quiz: [
        {
          q: "Given regions = ['North', 'South', 'East'], what is regions[1]?",
          options: ["North", "South", "East", "An error"],
          answer: 1,
          explain: "Python counts from 0, so index 1 is the second item.",
        },
        {
          q: "Which data structure best maps product codes to product names?",
          options: ["List", "Dictionary", "Integer", "Boolean"],
          answer: 1,
          explain: "Dictionaries store key: value pairs, perfect for lookups like code -> name.",
        },
        {
          q: "How do you run the current cell in Jupyter or Colab?",
          options: ["Ctrl+S", "Shift+Enter", "Alt+F4", "Tab"],
          answer: 1,
          explain: "Shift+Enter runs the cell and moves to the next one.",
        },
        {
          q: "What does this return? def double(x): return x * 2 ... double(7)",
          options: ["7", "14", "x * 2", "None"],
          answer: 1,
          explain: "The function returns its input multiplied by 2.",
        },
      ],
    },
    {
      id: "f8-s2",
      title: "pandas DataFrames: Load, Inspect, Select",
      minutes: 18,
      xp: 140,
      skills: ["python", "pandas"],
      game: { kind: "pandas-lab", stage: 1 },
      lesson: [
        {
          heading: "Meet the DataFrame",
          body: "**pandas** is the Python library for tables. Its core object is the **DataFrame**: rows and named columns, like a spreadsheet tab or SQL table. Each single column is a **Series**.\n\nBy convention you import it as `pd`.",
          example: `import pandas as pd

df = pd.read_csv("orders.csv")
# also: pd.read_excel("file.xlsx", sheet_name="Sales")`,
          exampleLang: "python",
        },
        {
          heading: "First look: the inspection routine",
          body: "Every time you load data, run the same quick checks before analysing anything:\n\n- `df.head()` first 5 rows (`df.tail()` for the last)\n- `df.shape` (rows, columns)\n- `df.info()` column names, data types and non-null counts\n- `df.describe()` count, mean, std, min, quartiles, max for numeric columns\n- `df.columns` list of column names\n- `df['col'].value_counts()` how often each category appears",
          example: `df.shape              # (48213, 9)
df.info()             # spot missing values and wrong types
df.describe()         # spot weird mins/maxes (negative prices?)
df["region"].value_counts()`,
          exampleLang: "python",
          tip: "`info()` showing 'order_date ... object' means dates were read as text. You'll fix that in the cleaning steps.",
        },
        {
          heading: "Selecting columns",
          body: "- One column (returns a Series): `df['amount']`\n- Several columns (returns a DataFrame): `df[['order_id', 'amount']]` — note the **double brackets**, because you're passing a list\n\nYou can create new columns with simple arithmetic that applies to every row at once.",
          example: `df["revenue"] = df["quantity"] * df["unit_price"]
df[["order_id", "region", "revenue"]].head()`,
          exampleLang: "python",
        },
        {
          heading: "loc and iloc",
          body: "- `df.loc[rows, columns]` selects by **labels** (index labels and column names)\n- `df.iloc[rows, columns]` selects by **position** (numbers, starting at 0)\n\nWith `loc`, slices include the end label; with `iloc`, the end is excluded, just like Python lists.",
          example: `df.loc[0:4, ["order_id", "amount"]]   # rows labelled 0..4 (5 rows)
df.iloc[0:5, 0:3]                      # first 5 rows, first 3 columns
df.sort_values("amount", ascending=False).head(10)  # top 10 orders`,
          exampleLang: "python",
        },
      ],
      quiz: [
        {
          q: "Which method shows column data types and non-null counts?",
          options: ["df.head()", "df.info()", "df.describe()", "df.shape"],
          answer: 1,
          explain: "info() lists each column with its dtype and how many non-null values it has.",
        },
        {
          q: "What does df[['region', 'amount']] return?",
          options: ["A Series", "A DataFrame with two columns", "An error", "A list"],
          answer: 1,
          explain: "Passing a list of column names (double brackets) returns a DataFrame.",
        },
        {
          q: "df.shape returns (1200, 8). What does that mean?",
          options: ["8 rows, 1200 columns", "1200 rows, 8 columns", "1200 missing values", "8 data types"],
          answer: 1,
          explain: "shape is (rows, columns).",
        },
        {
          q: "What's the difference between loc and iloc?",
          options: [
            "loc selects by labels; iloc selects by integer position",
            "loc is for rows only; iloc is for columns only",
            "They are identical",
            "iloc is for strings; loc is for numbers",
          ],
          answer: 0,
          explain: "loc uses index labels and column names; iloc uses numeric positions.",
        },
      ],
    },
    {
      id: "f8-s3",
      title: "Filtering with Boolean Masks",
      minutes: 15,
      xp: 140,
      skills: ["pandas"],
      game: { kind: "pandas-lab", stage: 2 },
      lesson: [
        {
          heading: "The pandas WHERE clause",
          body: "A comparison on a column produces a **boolean mask**: a Series of True/False, one per row. Put that mask inside `df[...]` and pandas keeps only the True rows.",
          example: `mask = df["amount"] > 100      # True/False for every row
big_orders = df[mask]

# same thing in one line
big_orders = df[df["amount"] > 100]`,
          exampleLang: "python",
        },
        {
          heading: "Combining conditions",
          body: "- AND is `&`, OR is `|`, NOT is `~`\n- **Wrap each condition in parentheses** — this is the #1 beginner error\n- Don't use the words `and` / `or` with pandas columns; they raise an error",
          example: `west_big = df[(df["region"] == "West") & (df["amount"] > 100)]

west_or_east = df[(df["region"] == "West") | (df["region"] == "East")]

not_cancelled = df[~(df["status"] == "cancelled")]`,
          exampleLang: "python",
        },
        {
          heading: "Handy filter helpers",
          body: "- `isin([...])` matches any value in a list (like SQL IN)\n- `between(a, b)` inclusive range\n- `str.contains('text')` partial text match\n- `isna()` / `notna()` find missing values\n- `df.query('amount > 100 and region == \"West\"')` lets you write filters as a string",
          example: `df[df["region"].isin(["West", "East"])]
df[df["amount"].between(50, 200)]
df[df["product"].str.contains("Pro", case=False, na=False)]
df[df["email"].isna()]`,
          exampleLang: "python",
        },
        {
          heading: "Filter, then select with loc",
          body: "Use `loc` to filter rows and choose columns at the same time. It's also the safe way to **change** values for filtered rows (avoids the 'SettingWithCopyWarning').",
          example: `# view: big West orders, just two columns
df.loc[(df["region"] == "West") & (df["amount"] > 100), ["order_id", "amount"]]

# update: flag those orders
df.loc[df["amount"] > 1000, "review_flag"] = True`,
          exampleLang: "python",
        },
      ],
      quiz: [
        {
          q: "Which filter correctly keeps rows where region is 'West' AND amount > 100?",
          options: [
            "df[df['region'] == 'West' and df['amount'] > 100]",
            "df[(df['region'] == 'West') & (df['amount'] > 100)]",
            "df[df['region'] == 'West' & df['amount'] > 100]",
            "df.filter('West', 100)",
          ],
          answer: 1,
          explain: "Use & with each condition wrapped in parentheses. Python's 'and' doesn't work element-wise.",
        },
        {
          q: "What does df['amount'] > 100 return on its own?",
          options: ["The filtered DataFrame", "A Series of True/False values", "A single True or False", "The count of rows"],
          answer: 1,
          explain: "It's a boolean mask with one True/False per row.",
        },
        {
          q: "Which is the pandas equivalent of SQL's WHERE status IN ('paid', 'shipped')?",
          options: [
            "df[df['status'].isin(['paid', 'shipped'])]",
            "df[df['status'] == ['paid', 'shipped']]",
            "df.in('paid', 'shipped')",
            "df[df['status'].contains('paid', 'shipped')]",
          ],
          answer: 0,
          explain: "isin() checks membership in a list.",
        },
        {
          q: "What does the ~ operator do in a pandas filter?",
          options: ["Rounds values", "Negates the mask (NOT)", "Means approximately equal", "Combines with OR"],
          answer: 1,
          explain: "~ flips True to False and vice versa.",
        },
      ],
    },
    {
      id: "f8-s4",
      title: "Data Types & Quality Checks",
      minutes: 15,
      xp: 140,
      skills: ["pandas"],
      game: { kind: "clean-sweep", stage: 1 },
      lesson: [
        {
          heading: "Wrong types break analysis quietly",
          body: "If `amount` was read as text (dtype `object`) because one row says '$1,200', you can't sum it. If `order_date` is text, you can't group by month. Always check `df.dtypes` after loading.\n\nCommon pandas dtypes: `int64`, `float64`, `object` (text/mixed), `bool`, `datetime64`, `category`.",
          example: `df.dtypes
# order_id        int64
# order_date     object   <- should be datetime
# amount         object   <- should be float
# region         object`,
          exampleLang: "python",
        },
        {
          heading: "Converting types",
          body: "- `astype()` converts when the data is already clean\n- `pd.to_numeric(..., errors='coerce')` turns unparseable values into NaN instead of crashing\n- `pd.to_datetime()` parses dates; then the `.dt` accessor gives you parts",
          example: `df["amount"] = (df["amount"].astype(str)
                .str.replace("$", "", regex=False)
                .str.replace(",", "", regex=False))
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")

df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")
df["order_month"] = df["order_date"].dt.to_period("M")
df["weekday"] = df["order_date"].dt.day_name()

df["customer_id"] = df["customer_id"].astype(str)   # IDs are labels, not numbers`,
          exampleLang: "python",
          tip: "After `errors='coerce'`, count the new NaNs. If 30% of rows failed to parse, investigate before moving on.",
        },
        {
          heading: "A quick data-quality checklist",
          body: "Run these checks on every new dataset and note what you find:\n\n- **Completeness**: `df.isna().sum()` missing values per column\n- **Uniqueness**: `df['order_id'].is_unique` or `df.duplicated().sum()`\n- **Validity**: impossible values — negative quantities, ages of 200, dates in the future\n- **Consistency**: 'NY' vs 'New York', mixed units\n- **Range**: `describe()` mins and maxes",
          example: `df.isna().sum()
df.duplicated().sum()
(df["quantity"] < 0).sum()
df["order_date"].min(), df["order_date"].max()
df["state"].value_counts().head(20)`,
          exampleLang: "python",
        },
        {
          heading: "Document what you find",
          body: "Keep a short **data-quality log** in a notebook markdown cell: what was wrong, how many rows, and what you did. When a stakeholder asks why your total differs from another report by 2%, you'll have the answer ready.",
          example: `Data quality notes - orders_2025.csv
- 312 rows (0.6%) had amount as text with '$' -> converted
- 48 rows with negative quantity = returns -> moved to returns table
- 1,140 duplicate order_ids from double import -> kept latest
- order_date range: 2025-01-01 to 2025-12-31 (as expected)`,
          exampleLang: "text",
        },
      ],
      quiz: [
        {
          q: "info() shows 'amount' as dtype object. What's the likely problem?",
          options: [
            "The column is perfectly fine",
            "Some values contain text like '$' or ',' so pandas read it as strings",
            "The column has too many rows",
            "pandas can't handle decimals",
          ],
          answer: 1,
          explain: "object usually means text. Clean the symbols, then convert with to_numeric.",
        },
        {
          q: "What does pd.to_numeric(col, errors='coerce') do with the value 'N/A'?",
          options: ["Raises an error", "Converts it to NaN", "Converts it to 0", "Leaves it as 'N/A'"],
          answer: 1,
          explain: "coerce turns anything it can't parse into NaN.",
        },
        {
          q: "Why convert customer_id from int to string?",
          options: [
            "To make the file smaller",
            "IDs are labels — you never add or average them, and leading zeros may matter",
            "Strings sort faster",
            "pandas requires it",
          ],
          answer: 1,
          explain: "Treat identifiers as text so nobody accidentally sums them and leading zeros aren't lost.",
        },
        {
          q: "Which line counts missing values in every column?",
          options: ["df.count()", "df.isna().sum()", "df.missing()", "df.dropna()"],
          answer: 1,
          explain: "isna() gives True for missing; sum() counts the Trues per column.",
        },
      ],
    },
    {
      id: "f8-s5",
      title: "Cleaning: Missing Values, Text & Duplicates",
      minutes: 18,
      xp: 160,
      skills: ["pandas"],
      game: { kind: "pandas-lab", stage: 3 },
      lesson: [
        {
          heading: "Deciding what to do with missing values",
          body: "There's no single right answer. Ask **why** it's missing and how it affects your question:\n\n- **Drop** rows if few are missing and they're random: `dropna()`\n- **Fill** with a sensible default: 0 for 'no discount', 'Unknown' for a category\n- **Fill** with a statistic (median) cautiously, and only when it won't distort the result\n- **Keep** as missing and report it, when the missingness itself is meaningful",
          example: `df = df.dropna(subset=["customer_id"])          # can't use orders with no customer
df["discount"] = df["discount"].fillna(0)        # missing = no discount
df["region"] = df["region"].fillna("Unknown")
df["age"] = df["age"].fillna(df["age"].median())`,
          exampleLang: "python",
          tip: "`dropna()` with no arguments drops a row if ANY column is missing. Use `subset=` to target only the columns that matter.",
        },
        {
          heading: "Tidying text with .str",
          body: "Text columns are messy: extra spaces, inconsistent capitals, typos. The `.str` accessor applies string methods to every row at once:\n\n- `.str.strip()` remove leading/trailing spaces\n- `.str.lower()` / `.str.title()` fix capitalization\n- `.str.replace(old, new)` swap characters\n- `.str.split()` break text into parts",
          example: `df["city"] = df["city"].str.strip().str.title()      # '  new york ' -> 'New York'
df["email"] = df["email"].str.strip().str.lower()

df["state"] = df["state"].replace({"Calif.": "CA", "California": "CA"})

df[["first_name", "last_name"]] = df["full_name"].str.split(" ", n=1, expand=True)`,
          exampleLang: "python",
        },
        {
          heading: "Removing duplicates",
          body: "- `df.duplicated()` flags rows identical to an earlier row\n- `df.drop_duplicates()` removes fully identical rows\n- `subset=` defines which columns make a row 'the same'\n- `keep='last'` keeps the latest occurrence (sort first!)",
          example: `print(df.duplicated(subset=["order_id"]).sum())   # how many?

df = (df.sort_values("updated_at")
        .drop_duplicates(subset=["order_id"], keep="last"))`,
          exampleLang: "python",
        },
        {
          heading: "Build a repeatable cleaning function",
          body: "Wrap your steps in one function so next month's file gets exactly the same treatment. This is the real advantage over manual spreadsheet cleaning.",
          example: `def clean_orders(raw):
    df = raw.copy()
    df["email"] = df["email"].str.strip().str.lower()
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["discount"] = df["discount"].fillna(0)
    df = df.dropna(subset=["customer_id", "amount"])
    df = df.drop_duplicates(subset=["order_id"], keep="last")
    return df

clean = clean_orders(pd.read_csv("orders_oct.csv"))`,
          exampleLang: "python",
        },
      ],
      quiz: [
        {
          q: "A 'discount' column is NaN when no discount was applied. Best fix?",
          options: ["Drop those rows", "fillna(0)", "Fill with the mean discount", "Delete the column"],
          answer: 1,
          explain: "Missing means 'no discount', so 0 is the accurate value. Dropping would lose real orders.",
        },
        {
          q: "What does df.dropna(subset=['email']) do?",
          options: [
            "Drops the email column",
            "Drops rows where email is missing",
            "Fills missing emails",
            "Drops rows with any missing value",
          ],
          answer: 1,
          explain: "subset limits the check to the listed columns.",
        },
        {
          q: "'  Boston', 'boston ', 'BOSTON' should be one city. Which chain fixes it?",
          options: [
            ".str.strip().str.title()",
            ".str.upper().str.split()",
            ".astype(int)",
            ".fillna('Boston')",
          ],
          answer: 0,
          explain: "strip removes spaces; title standardizes capitalization to 'Boston'.",
        },
        {
          q: "You want to keep only the most recent record per order_id. What's needed?",
          options: [
            "drop_duplicates() with no arguments",
            "Sort by updated_at, then drop_duplicates(subset=['order_id'], keep='last')",
            "dropna()",
            "value_counts()",
          ],
          answer: 1,
          explain: "Sorting ensures 'last' really is the latest; subset defines duplicates by order_id.",
        },
      ],
    },
    {
      id: "f8-s6",
      title: "groupby, agg & Quick EDA Charts",
      minutes: 20,
      xp: 180,
      skills: ["pandas", "visualization"],
      game: { kind: "pandas-lab", stage: 4 },
      lesson: [
        {
          heading: "groupby = SQL GROUP BY",
          body: "`groupby` splits rows into groups, applies a calculation, and combines the results. You already know this logic from SQL and pivot tables.",
          example: `df.groupby("region")["revenue"].sum()

# SQL equivalent:
# SELECT region, SUM(revenue) FROM df GROUP BY region;`,
          exampleLang: "python",
        },
        {
          heading: "Multiple metrics with agg",
          body: "Use `agg` with **named aggregations** to calculate several metrics with clear column names. Add `.reset_index()` to turn the group labels back into normal columns.",
          example: `summary = (df.groupby("region")
             .agg(orders=("order_id", "count"),
                  customers=("customer_id", "nunique"),
                  revenue=("revenue", "sum"),
                  avg_order=("revenue", "mean"))
             .reset_index()
             .sort_values("revenue", ascending=False))`,
          exampleLang: "python",
          tip: "Group by several columns with a list: `df.groupby(['region', 'channel'])`.",
        },
        {
          heading: "Pivot tables in pandas",
          body: "`pivot_table` builds the same cross-tab you'd make in Excel: rows, columns, values and an aggregate function.",
          example: `pd.pivot_table(df,
               index="region",
               columns="order_month",
               values="revenue",
               aggfunc="sum",
               fill_value=0)`,
          exampleLang: "python",
        },
        {
          heading: "Quick EDA: what to look at first",
          body: "**Exploratory Data Analysis** is a fast, curious first pass before you commit to answers:\n\n- **Distributions**: histograms of key numbers (are there outliers?)\n- **Categories**: `value_counts()` and bar charts\n- **Trends**: metrics over time with line charts\n- **Relationships**: scatter plots and `df.corr(numeric_only=True)`\n\nWrite down surprises as questions to dig into.",
        },
        {
          heading: "Charts with matplotlib and seaborn",
          body: "**matplotlib** is the foundation plotting library; **seaborn** sits on top and makes good-looking statistical charts with less code. pandas also has a built-in `.plot()` for quick looks.",
          example: `import matplotlib.pyplot as plt
import seaborn as sns

# quick pandas plot
monthly = df.groupby("order_month")["revenue"].sum()
monthly.plot(kind="line", title="Monthly revenue")
plt.show()

# seaborn: distribution and comparison
sns.histplot(data=df, x="revenue", bins=30)
plt.show()

sns.barplot(data=summary, x="revenue", y="region")
plt.title("West leads revenue in 2025")
plt.show()`,
          exampleLang: "python",
        },
      ],
      quiz: [
        {
          q: "Which code gives total revenue per region?",
          options: [
            "df['region'].sum()",
            "df.groupby('region')['revenue'].sum()",
            "df.sum('region')",
            "df.groupby('revenue')['region'].count()",
          ],
          answer: 1,
          explain: "Group by the category, select the value column, then aggregate.",
        },
        {
          q: "What does 'nunique' count in agg(customers=('customer_id', 'nunique'))?",
          options: ["All rows", "Distinct customer IDs", "Missing IDs", "The largest ID"],
          answer: 1,
          explain: "nunique counts unique values — like COUNT(DISTINCT) in SQL.",
        },
        {
          q: "Why add .reset_index() after a groupby?",
          options: [
            "To delete the results",
            "To turn the group labels back into regular columns",
            "To sort the data",
            "To remove duplicates",
          ],
          answer: 1,
          explain: "groupby puts the group keys in the index; reset_index makes them normal columns, which is easier to chart or export.",
        },
        {
          q: "Which chart is best for a first look at the distribution of order values?",
          options: ["Pie chart", "Histogram", "Line chart", "Map"],
          answer: 1,
          explain: "Histograms show how values are spread and reveal skew and outliers.",
        },
      ],
    },
    {
      id: "f8-s7",
      title: "Combining Data: merge, concat & Dedupe",
      minutes: 16,
      xp: 170,
      skills: ["pandas"],
      game: { kind: "clean-sweep", stage: 2 },
      lesson: [
        {
          heading: "merge = SQL JOIN",
          body: "`pd.merge()` (or `df.merge()`) joins two DataFrames on matching keys. The `how` parameter mirrors SQL join types:\n\n- `how='inner'` only matching rows (default)\n- `how='left'` all rows from the left, matches from the right\n- `how='right'`, `how='outer'` for the other cases",
          example: `orders_full = orders.merge(customers, on="customer_id", how="left")

# when key names differ
orders.merge(products, left_on="sku", right_on="product_sku", how="left")`,
          exampleLang: "python",
        },
        {
          heading: "Check your merge every time",
          body: "Merges are the most common place for silent errors. Before and after merging:\n\n- Compare row counts: did a left merge **add** rows? Then the right table has duplicate keys.\n- Use `indicator=True` to see which rows matched\n- Use `validate='many_to_one'` to make pandas raise an error if the right side isn't unique",
          example: `print(len(orders))
merged = orders.merge(customers, on="customer_id", how="left",
                      indicator=True, validate="many_to_one")
print(len(merged))
print(merged["_merge"].value_counts())   # both / left_only`,
          exampleLang: "python",
          tip: "A spike of 'left_only' rows often means key formats differ — e.g. '00123' vs 123. Fix types before merging.",
        },
        {
          heading: "Stacking with concat",
          body: "When you have the same columns split across files (one CSV per month), stack them with `pd.concat`. Then dedupe, because overlapping exports often repeat records.",
          example: `import glob

files = glob.glob("exports/orders_2025_*.csv")
all_orders = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)

before = len(all_orders)
all_orders = all_orders.drop_duplicates(subset=["order_id"])
print(f"Removed {before - len(all_orders)} duplicate orders")`,
          exampleLang: "python",
        },
        {
          heading: "Workplace example: matching two systems",
          body: "Finance's billing export and the CRM disagree on customer counts. Normalize the key, merge with `how='outer'` and `indicator=True`, and you instantly get three lists: in both, only in billing, only in CRM. That reconciliation table is often the most valuable thing you deliver that week.",
          example: `billing["email"] = billing["email"].str.strip().str.lower()
crm["email"] = crm["email"].str.strip().str.lower()

recon = billing.merge(crm, on="email", how="outer", indicator=True)
recon["_merge"].value_counts()
# both          9,412
# left_only       318   <- paying but missing from CRM
# right_only      205   <- in CRM but not billed`,
          exampleLang: "python",
        },
      ],
      quiz: [
        {
          q: "Which merge keeps every order, even ones without a matching customer record?",
          options: [
            "orders.merge(customers, how='inner')",
            "orders.merge(customers, on='customer_id', how='left')",
            "pd.concat([orders, customers])",
            "orders.merge(customers, how='right')",
          ],
          answer: 1,
          explain: "A left merge keeps all rows from the left DataFrame (orders).",
        },
        {
          q: "You left-merge 10,000 orders and get 10,450 rows. What happened?",
          options: [
            "pandas made an error",
            "The right table has duplicate keys, so some orders matched more than once",
            "Some orders were deleted",
            "The merge used the wrong 'how'",
          ],
          answer: 1,
          explain: "Duplicate keys on the right multiply matching rows. Dedupe the lookup table or use validate='many_to_one'.",
        },
        {
          q: "You have 12 monthly CSVs with identical columns. How do you combine them?",
          options: ["merge", "pd.concat", "groupby", "pivot_table"],
          answer: 1,
          explain: "concat stacks DataFrames with the same columns on top of each other.",
        },
        {
          q: "What does indicator=True add to a merge result?",
          options: [
            "A column showing whether each row matched in both, left only, or right only",
            "Row numbers",
            "A chart",
            "A list of duplicates removed",
          ],
          answer: 0,
          explain: "The _merge column is perfect for checking match rates and building reconciliations.",
        },
      ],
    },
  ],
};
