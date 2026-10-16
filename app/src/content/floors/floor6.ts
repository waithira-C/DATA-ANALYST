import type { Floor } from '../types';

export const floor6: Floor = {
  id: 6,
  title: "SQL II: Thinking in Queries",
  tagline: "Go beyond SELECT * — label, nest, stage and rank your data like a working analyst.",
  color: "#ef4444",
  icon: "⚙️",
  outcomes: [
    "Create custom categories on the fly with CASE WHEN",
    "Break hard questions into readable pieces with subqueries and CTEs",
    "Rank, number and compare rows with window functions like ROW_NUMBER, RANK, SUM OVER and LAG",
    "Handle dates and NULLs safely with date functions and COALESCE",
    "Write clean, debuggable SQL that teammates can read and trust",
  ],
  steps: [
    {
      id: "f6-s1",
      title: "CASE WHEN: If-Then Logic in SQL",
      minutes: 12,
      xp: 100,
      skills: ["sql"],
      game: { kind: "query-quest", stage: 5 },
      lesson: [
        {
          heading: "SQL's version of IF",
          body: "In spreadsheets you used `IF()` to label rows. In SQL the same idea is called **CASE WHEN**. It checks conditions top to bottom and returns the value for the **first** condition that is true.\n\nAnalysts use it constantly: bucketing customers into tiers, turning status codes into readable labels, or flagging rows that need attention.",
          example: `SELECT order_id,
       amount,
       CASE
         WHEN amount >= 500 THEN 'Large'
         WHEN amount >= 100 THEN 'Medium'
         ELSE 'Small'
       END AS order_size
FROM orders;`,
          exampleLang: "sql",
          tip: "Order matters. If you put `WHEN amount >= 100` first, a $700 order would be labelled 'Medium' because that condition is true first.",
        },
        {
          heading: "Anatomy of a CASE expression",
          body: "Every CASE expression has the same parts:\n\n- `CASE` opens it\n- one or more `WHEN condition THEN value` lines\n- an optional `ELSE value` for everything that matched nothing\n- `END` closes it, usually followed by `AS column_name`\n\nIf you leave out ELSE, unmatched rows get **NULL**. That is a classic source of 'missing' categories in reports, so include ELSE unless you deliberately want NULLs.",
        },
        {
          heading: "Counting with CASE (conditional aggregation)",
          body: "CASE becomes a superpower inside aggregate functions. Instead of running three separate queries, you can count several categories in one pass. This is how many 'summary row' reports are built.\n\nThe trick: return 1 when the condition is met and 0 otherwise, then SUM it.",
          example: `SELECT region,
       COUNT(*) AS total_orders,
       SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) AS returns,
       SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) * 1.0
         / COUNT(*) AS return_rate
FROM orders
GROUP BY region;`,
          exampleLang: "sql",
          tip: "Multiplying by `1.0` forces decimal division. In some databases, integer / integer gives a rounded-down whole number like 0.",
        },
        {
          heading: "Workplace example: cleaning messy labels",
          body: "Your CRM stores country as 'US', 'USA', 'United States' and 'u.s.'. Before you can group by country you need one consistent value. CASE WHEN lets you standardise without changing the source table.",
          example: `SELECT CASE
         WHEN UPPER(country) IN ('US', 'USA', 'U.S.', 'UNITED STATES') THEN 'United States'
         ELSE country
       END AS country_clean,
       COUNT(*) AS customers
FROM customers
GROUP BY 1;`,
          exampleLang: "sql",
        },
      ],
      quiz: [
        {
          q: "An order has amount = 250. Which label does this return? CASE WHEN amount >= 100 THEN 'Medium' WHEN amount >= 200 THEN 'Large' ELSE 'Small' END",
          options: ["Large", "Medium", "Small", "NULL"],
          answer: 1,
          explain: "CASE stops at the first true condition. 250 >= 100 is true, so it returns 'Medium' and never checks the second line. Put the strictest condition first.",
        },
        {
          q: "What does a CASE expression return for a row that matches no WHEN and has no ELSE?",
          options: ["0", "An error", "NULL", "An empty string"],
          answer: 2,
          explain: "Without an ELSE, unmatched rows get NULL. Add ELSE when you want a default label.",
        },
        {
          q: "Which expression counts only the orders where status is 'cancelled'?",
          options: [
            "COUNT(status = 'cancelled')",
            "SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)",
            "CASE WHEN COUNT(*) = 'cancelled' END",
            "SUM(status) WHERE status = 'cancelled'",
          ],
          answer: 1,
          explain: "Conditional aggregation: return 1 for matching rows and 0 otherwise, then SUM. This lets you count multiple categories in one query.",
        },
        {
          q: "Why might `SUM(CASE ...) / COUNT(*)` return 0 when you expected 0.12?",
          options: [
            "CASE cannot be used with SUM",
            "Integer division rounds the result down",
            "COUNT(*) ignores NULLs",
            "The GROUP BY is missing a column",
          ],
          answer: 1,
          explain: "Dividing two integers can produce an integer in many databases. Multiply by 1.0 or CAST to a decimal first.",
        },
      ],
    },
    {
      id: "f6-s2",
      title: "Subqueries: Queries Inside Queries",
      minutes: 14,
      xp: 120,
      skills: ["sql"],
      game: { kind: "query-quest", stage: 6 },
      lesson: [
        {
          heading: "When one query isn't enough",
          body: "Some questions need an answer to another question first. 'Which products sell above the **average** price?' You need the average before you can compare.\n\nA **subquery** is a SELECT wrapped in parentheses and used inside another query. The inner query runs, then its result is used by the outer query.",
          example: `SELECT product_name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);`,
          exampleLang: "sql",
        },
        {
          heading: "Three places subqueries live",
          body: "- **In WHERE**: filter using a value or list from another query (most common)\n- **In FROM**: treat a query's result as a temporary table (it must have an alias)\n- **In SELECT**: return one value per row, like a company-wide average shown next to each row\n\nA subquery that returns a single value is called **scalar**. One that returns a list is used with `IN`.",
          example: `-- Subquery in FROM: average spend of customers per city
SELECT city, AVG(total_spent) AS avg_customer_spend
FROM (
  SELECT customer_id, city, SUM(amount) AS total_spent
  FROM orders
  GROUP BY customer_id, city
) AS customer_totals
GROUP BY city;`,
          exampleLang: "sql",
          tip: "Notice the two-step aggregation: first total per customer, then average those totals. A single GROUP BY can't do that.",
        },
        {
          heading: "Filtering with IN and NOT IN",
          body: "Marketing asks: 'Which customers signed up but never ordered?' A subquery returning a list of IDs answers it neatly.\n\n**Watch out:** if the subquery list contains a NULL, `NOT IN` returns no rows at all. Filter NULLs out inside the subquery or use `NOT EXISTS` instead.",
          example: `SELECT customer_id, email
FROM customers
WHERE customer_id NOT IN (
  SELECT customer_id FROM orders WHERE customer_id IS NOT NULL
);`,
          exampleLang: "sql",
        },
        {
          heading: "EXISTS and correlated subqueries",
          body: "A **correlated** subquery references the outer query, so it runs once per outer row. `EXISTS` asks 'is there at least one matching row?' and is often faster and NULL-safe.\n\nThey are powerful but can be slow on big tables. If a correlated subquery gets complicated, a JOIN or CTE is often clearer.",
          example: `SELECT c.customer_id, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id
    AND o.order_date >= '2025-01-01'
);`,
          exampleLang: "sql",
        },
      ],
      quiz: [
        {
          q: "What does `WHERE price > (SELECT AVG(price) FROM products)` do?",
          options: [
            "Returns the average price",
            "Returns products priced above the overall average",
            "Returns an error because subqueries can't be in WHERE",
            "Groups products by price",
          ],
          answer: 1,
          explain: "The inner query returns one number (the average), and the outer WHERE keeps rows priced above it.",
        },
        {
          q: "A subquery in the FROM clause must have…",
          options: ["An ORDER BY", "An alias", "A LIMIT", "A WHERE clause"],
          answer: 1,
          explain: "Most databases require a name (alias) for a derived table so the outer query can refer to it.",
        },
        {
          q: "Your `NOT IN (subquery)` returns zero rows, even though you know some customers never ordered. Most likely cause?",
          options: [
            "The subquery returns a NULL value",
            "NOT IN only works with numbers",
            "You forgot GROUP BY",
            "The tables have too many rows",
          ],
          answer: 0,
          explain: "If any value in the NOT IN list is NULL, the comparison becomes unknown for every row and nothing is returned. Exclude NULLs or use NOT EXISTS.",
        },
        {
          q: "Which statement about correlated subqueries is TRUE?",
          options: [
            "They run only once for the whole query",
            "They reference columns from the outer query",
            "They can only appear in SELECT",
            "They cannot use EXISTS",
          ],
          answer: 1,
          explain: "Correlated subqueries refer to the outer row (like o.customer_id = c.customer_id), so they are evaluated per outer row.",
        },
      ],
    },
    {
      id: "f6-s3",
      title: "CTEs: Write Queries Like a Recipe",
      minutes: 14,
      xp: 130,
      skills: ["sql"],
      game: { kind: "query-quest", stage: 7 },
      lesson: [
        {
          heading: "Meet WITH",
          body: "A **Common Table Expression (CTE)** is a named, temporary result you define at the top of a query with `WITH`. Think of it as a labelled prep bowl in a recipe: you prepare ingredients first, then combine them.\n\nCTEs do the same job as subqueries in FROM, but they read top to bottom, which makes them far easier to review and debug.",
          example: `WITH customer_totals AS (
  SELECT customer_id, SUM(amount) AS total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT AVG(total_spent) AS avg_spend_per_customer
FROM customer_totals;`,
          exampleLang: "sql",
        },
        {
          heading: "Chaining several CTEs",
          body: "You can define multiple CTEs separated by commas, and later ones can use earlier ones. Each step does one small job.\n\n- Step 1: filter to the data you need\n- Step 2: aggregate it\n- Step 3: join or compare\n- Final SELECT: present the answer",
          example: `WITH orders_2025 AS (
  SELECT * FROM orders
  WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
),
customer_totals AS (
  SELECT customer_id, SUM(amount) AS total_spent
  FROM orders_2025
  GROUP BY customer_id
),
vip AS (
  SELECT customer_id FROM customer_totals WHERE total_spent >= 1000
)
SELECT COUNT(*) AS vip_customers FROM vip;`,
          exampleLang: "sql",
          tip: "Only one WITH keyword at the start. After that, each new CTE is just `, name AS (...)`.",
        },
        {
          heading: "Why teams love CTEs",
          body: "- **Readable**: each block has a descriptive name like `active_users`\n- **Debuggable**: you can SELECT from any single CTE to check its output\n- **Reusable**: reference the same CTE more than once without copy-pasting\n\nIn code reviews, a 60-line query made of four named CTEs is much easier to approve than a nested tower of subqueries.",
        },
        {
          heading: "Workplace example: monthly active vs new customers",
          body: "Your manager wants each month's total ordering customers and how many were ordering for the first time. Breaking it into CTEs keeps the logic clear.",
          example: `WITH first_orders AS (
  SELECT customer_id, MIN(order_date) AS first_order_date
  FROM orders
  GROUP BY customer_id
),
monthly AS (
  SELECT DATE_TRUNC('month', o.order_date) AS month,
         o.customer_id,
         DATE_TRUNC('month', f.first_order_date) AS first_month
  FROM orders o
  JOIN first_orders f ON o.customer_id = f.customer_id
)
SELECT month,
       COUNT(DISTINCT customer_id) AS active_customers,
       COUNT(DISTINCT CASE WHEN month = first_month THEN customer_id END) AS new_customers
FROM monthly
GROUP BY month
ORDER BY month;`,
          exampleLang: "sql",
        },
      ],
      quiz: [
        {
          q: "Which keyword starts a Common Table Expression?",
          options: ["CREATE", "WITH", "DEFINE", "TEMP"],
          answer: 1,
          explain: "CTEs begin with WITH name AS ( ... ). They exist only for the duration of that one query.",
        },
        {
          q: "How do you define a second CTE after the first one?",
          options: [
            "Write WITH again before it",
            "Add a comma, then name AS ( ... )",
            "Use UNION",
            "You can only have one CTE per query",
          ],
          answer: 1,
          explain: "Multiple CTEs share one WITH and are separated by commas. Later CTEs can reference earlier ones.",
        },
        {
          q: "What is the main advantage of a CTE over a nested subquery?",
          options: [
            "CTEs permanently save data to the database",
            "CTEs are always much faster",
            "CTEs make the logic readable top-to-bottom and easy to debug step by step",
            "CTEs remove the need for GROUP BY",
          ],
          answer: 2,
          explain: "CTEs mainly improve readability and debuggability. Performance is usually similar; they do not store data permanently.",
        },
        {
          q: "Your final result looks wrong. What's a smart CTE debugging move?",
          options: [
            "Delete all the CTEs and start over",
            "Temporarily change the final SELECT to select from one CTE at a time and check each output",
            "Add DISTINCT everywhere",
            "Increase the LIMIT",
          ],
          answer: 1,
          explain: "Inspecting each named step isolates exactly where the numbers go wrong.",
        },
      ],
    },
    {
      id: "f6-s4",
      title: "Window Functions I: ROW_NUMBER, RANK & PARTITION BY",
      minutes: 18,
      xp: 160,
      skills: ["sql"],
      game: { kind: "query-quest", stage: 8 },
      lesson: [
        {
          heading: "Aggregates without collapsing rows",
          body: "GROUP BY squashes many rows into one. Sometimes you want to **keep every row** but add a calculation across related rows, like a rank or a group total. That is what **window functions** do.\n\nThe giveaway is the `OVER (...)` clause. It defines the 'window' of rows the function looks at.",
          example: `SELECT employee, department, salary,
       AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary
FROM employees;`,
          exampleLang: "sql",
          tip: "Every employee row stays in the result, and each one now shows its department's average next to it.",
        },
        {
          heading: "PARTITION BY and ORDER BY inside OVER",
          body: "- `PARTITION BY` splits rows into groups. The function restarts for each group (like a separate leaderboard per department).\n- `ORDER BY` inside OVER sets the order the function walks through the rows (needed for ranking and running totals).\n\nYou can use either, both, or neither. `OVER ()` with nothing inside means 'all rows'.",
        },
        {
          heading: "ROW_NUMBER vs RANK vs DENSE_RANK",
          body: "All three number rows, but they treat ties differently. Suppose two reps tie for second place:\n\n- **ROW_NUMBER**: 1, 2, 3, 4 (ties get different numbers, arbitrarily)\n- **RANK**: 1, 2, 2, 4 (ties share, then a gap)\n- **DENSE_RANK**: 1, 2, 2, 3 (ties share, no gap)\n\nUse ROW_NUMBER when you need exactly one row per position; RANK or DENSE_RANK when ties should be honoured.",
          example: `SELECT rep, region, revenue,
       ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) AS row_num,
       RANK()       OVER (PARTITION BY region ORDER BY revenue DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS dense_rnk
FROM sales_reps;`,
          exampleLang: "sql",
        },
        {
          heading: "The 'top N per group' pattern",
          body: "One of the most-asked interview questions: 'Find the top 3 products by revenue in each category.' You cannot filter a window function in WHERE (it is calculated after WHERE), so wrap it in a CTE and filter outside.",
          example: `WITH ranked AS (
  SELECT category, product_name, revenue,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) AS rn
  FROM product_sales
)
SELECT category, product_name, revenue
FROM ranked
WHERE rn <= 3;`,
          exampleLang: "sql",
        },
        {
          heading: "Deduplicating with ROW_NUMBER",
          body: "Your customer table has duplicate rows from repeated imports. Keep only the most recent record per email by numbering each email's rows newest-first and keeping row 1. This trick shows up in real data pipelines every week.",
          example: `WITH numbered AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY updated_at DESC) AS rn
  FROM customers_raw
)
SELECT * FROM numbered WHERE rn = 1;`,
          exampleLang: "sql",
        },
      ],
      quiz: [
        {
          q: "Scores are 90, 85, 85, 70. What does RANK() give the score of 70 (ordering high to low)?",
          options: ["3", "4", "2", "5"],
          answer: 1,
          explain: "RANK gives ties the same rank (2, 2) and then skips, so 70 is ranked 4. DENSE_RANK would give 3.",
        },
        {
          q: "What does PARTITION BY region do inside OVER()?",
          options: [
            "Filters out all other regions",
            "Restarts the calculation separately for each region",
            "Sorts the final output by region",
            "Collapses rows to one per region",
          ],
          answer: 1,
          explain: "PARTITION BY creates independent groups for the window function while keeping all rows.",
        },
        {
          q: "Why can't you write WHERE ROW_NUMBER() OVER (...) <= 3 directly?",
          options: [
            "ROW_NUMBER only works in ORDER BY",
            "Window functions are calculated after WHERE, so you must filter in an outer query or CTE",
            "WHERE does not support numbers",
            "You can, it works fine",
          ],
          answer: 1,
          explain: "SQL evaluates WHERE before window functions. Compute the rank in a CTE or subquery, then filter outside it.",
        },
        {
          q: "You need exactly one row per customer (the latest), even if two rows share the same timestamp. Which function?",
          options: ["RANK", "DENSE_RANK", "ROW_NUMBER", "COUNT"],
          answer: 2,
          explain: "ROW_NUMBER always assigns unique numbers, so filtering rn = 1 guarantees exactly one row per partition.",
        },
        {
          q: "What's the key difference between a window function and GROUP BY?",
          options: [
            "Window functions keep every row; GROUP BY collapses rows",
            "GROUP BY is only for numbers",
            "Window functions can't use SUM",
            "There is no difference",
          ],
          answer: 0,
          explain: "Window functions add a calculated column to each row without collapsing them.",
        },
      ],
    },
    {
      id: "f6-s5",
      title: "Window Functions II: Running Totals, LAG & LEAD",
      minutes: 18,
      xp: 170,
      skills: ["sql"],
      game: { kind: "query-quest", stage: 9 },
      lesson: [
        {
          heading: "Running totals with SUM OVER",
          body: "Finance wants year-to-date revenue on every row of a daily report. Add `ORDER BY` inside OVER and SUM becomes **cumulative**: each row adds up everything up to and including itself.",
          example: `SELECT order_date,
       daily_revenue,
       SUM(daily_revenue) OVER (ORDER BY order_date) AS running_total
FROM daily_sales
ORDER BY order_date;`,
          exampleLang: "sql",
          tip: "Add PARTITION BY to restart the running total, e.g. `OVER (PARTITION BY EXTRACT(YEAR FROM order_date) ORDER BY order_date)` restarts every year.",
        },
        {
          heading: "Moving averages with frames",
          body: "A **frame** tells the window exactly which rows to include. A 7-day moving average smooths noisy daily data so trends are visible.\n\n`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` means 'this row plus the six before it'.",
          example: `SELECT order_date, daily_revenue,
       AVG(daily_revenue) OVER (
         ORDER BY order_date
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS revenue_7d_avg
FROM daily_sales;`,
          exampleLang: "sql",
        },
        {
          heading: "LAG and LEAD: peek at neighbours",
          body: "- `LAG(col)` returns the value from the **previous** row\n- `LEAD(col)` returns the value from the **next** row\n\nThey are perfect for month-over-month change, time between purchases, or spotting when a status changed. The first row has no previous value, so LAG returns NULL there.",
          example: `SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_month,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / LAG(revenue) OVER (ORDER BY month), 1) AS pct_change
FROM monthly_revenue;`,
          exampleLang: "sql",
        },
        {
          heading: "Workplace example: days between orders",
          body: "The retention team wants to know how long customers wait between purchases. Partition by customer so LAG only looks at that customer's own previous order.",
          example: `SELECT customer_id, order_date,
       LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_order,
       order_date - LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)
         AS days_since_prev
FROM orders;`,
          exampleLang: "sql",
          tip: "Date subtraction syntax varies: PostgreSQL allows `date - date`, SQL Server uses `DATEDIFF(day, a, b)`, BigQuery uses `DATE_DIFF(a, b, DAY)`.",
        },
      ],
      quiz: [
        {
          q: "What does SUM(revenue) OVER (ORDER BY month) produce?",
          options: [
            "The grand total on every row",
            "A running (cumulative) total up to each month",
            "Revenue for the previous month",
            "An error — SUM can't be used with OVER",
          ],
          answer: 1,
          explain: "Adding ORDER BY inside OVER makes the sum cumulative from the first row up to the current one.",
        },
        {
          q: "LAG(revenue) on the very first row of a window returns…",
          options: ["0", "The same row's revenue", "NULL", "The last row's revenue"],
          answer: 2,
          explain: "There's no previous row, so LAG returns NULL (unless you supply a default as the third argument).",
        },
        {
          q: "You want each customer's previous order date, not anyone's. What must you add?",
          options: ["GROUP BY customer_id", "PARTITION BY customer_id inside OVER", "DISTINCT customer_id", "A WHERE clause"],
          answer: 1,
          explain: "PARTITION BY customer_id keeps LAG within each customer's own history.",
        },
        {
          q: "Which frame gives a 3-month moving average including the current month?",
          options: [
            "ROWS BETWEEN 3 PRECEDING AND CURRENT ROW",
            "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW",
            "ROWS BETWEEN CURRENT ROW AND 3 FOLLOWING",
            "ROWS UNBOUNDED PRECEDING",
          ],
          answer: 1,
          explain: "2 preceding rows + the current row = 3 rows. '3 PRECEDING' would give a 4-month window.",
        },
      ],
    },
    {
      id: "f6-s6",
      title: "Dates, NULLs, Style & Debugging",
      minutes: 16,
      xp: 140,
      skills: ["sql"],
      lesson: [
        {
          heading: "Working with dates",
          body: "Almost every business question has a time element. The core moves:\n\n- **Truncate** a date to a period: `DATE_TRUNC('month', order_date)`\n- **Extract** a part: `EXTRACT(YEAR FROM order_date)`, `EXTRACT(DOW FROM order_date)`\n- **Do arithmetic**: `CURRENT_DATE - INTERVAL '30 days'`\n\nFunction names differ by database (SQL Server uses `DATEPART`, `DATEADD`, `DATEDIFF`). The concepts are the same, so keep a cheat sheet for whichever one your company uses.",
          example: `-- Orders in the last 30 days, grouped by week
SELECT DATE_TRUNC('week', order_date) AS week,
       COUNT(*) AS orders
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;`,
          exampleLang: "sql",
          tip: "For date ranges, prefer `>= start AND < next_start` over BETWEEN. It avoids missing records with timestamps late on the last day.",
        },
        {
          heading: "NULL is not zero",
          body: "NULL means **unknown or missing**. It behaves in surprising ways:\n\n- `NULL = NULL` is not true; use `IS NULL` / `IS NOT NULL`\n- Any arithmetic with NULL gives NULL: `5 + NULL` is NULL\n- `COUNT(column)` skips NULLs, `COUNT(*)` counts every row\n- `AVG` ignores NULLs, which can quietly inflate averages\n\n**COALESCE** returns the first non-NULL value in its list, so it is your go-to for defaults.",
          example: `SELECT customer_id,
       COALESCE(phone, email, 'no contact') AS best_contact,
       COALESCE(discount, 0) AS discount,
       price - COALESCE(discount, 0) AS final_price
FROM orders;`,
          exampleLang: "sql",
        },
        {
          heading: "Avoid divide-by-zero with NULLIF",
          body: "`NULLIF(a, b)` returns NULL when a equals b. Wrapping a denominator in `NULLIF(x, 0)` turns a crash into a NULL, which you can then display as blank or 0.",
          example: `SELECT campaign,
       clicks,
       conversions,
       ROUND(100.0 * conversions / NULLIF(clicks, 0), 2) AS conversion_rate_pct
FROM campaign_stats;`,
          exampleLang: "sql",
        },
        {
          heading: "Style that teammates thank you for",
          body: "- Write keywords in UPPERCASE and put each major clause on its own line\n- Use clear aliases: `o` for orders is fine; `t1`, `t2` is not\n- Name output columns in plain English: `avg_order_value`, not `col3`\n- Prefer CTEs over deep nesting\n- Add short comments with `--` explaining **why**, not what\n- Avoid `SELECT *` in final queries; list the columns you need",
        },
        {
          heading: "A debugging checklist",
          body: "When numbers look off, work through this in order:\n\n- **Row counts**: run `COUNT(*)` after each CTE or join. Did a join multiply rows (duplicate keys)?\n- **Grain**: what does one row represent? Customer? Order? Order line?\n- **Filters**: are dates inclusive/exclusive as intended? Did a WHERE on a LEFT JOINed table secretly turn it into an INNER JOIN?\n- **NULLs**: are missing values dropping rows or skewing averages?\n- **Sanity check**: compare a total against a known number (finance report, dashboard)",
          example: `-- Quick check: does the join duplicate orders?
SELECT COUNT(*) AS rows_after_join,
       COUNT(DISTINCT o.order_id) AS unique_orders
FROM orders o
JOIN order_items i ON o.order_id = i.order_id;`,
          exampleLang: "sql",
        },
      ],
      quiz: [
        {
          q: "What does COALESCE(discount, 0) return when discount is NULL?",
          options: ["NULL", "0", "An error", "The average discount"],
          answer: 1,
          explain: "COALESCE returns the first non-NULL argument. discount is NULL, so it returns 0.",
        },
        {
          q: "Which WHERE clause correctly finds rows with a missing email?",
          options: ["WHERE email = NULL", "WHERE email IS NULL", "WHERE email == ''", "WHERE NULL(email)"],
          answer: 1,
          explain: "Comparisons with = NULL are never true. Use IS NULL.",
        },
        {
          q: "A table has 100 rows; 20 have a NULL in `rating`. What does COUNT(rating) return?",
          options: ["100", "80", "20", "NULL"],
          answer: 1,
          explain: "COUNT(column) skips NULLs. COUNT(*) would return 100.",
        },
        {
          q: "After joining orders to order_items, total revenue is 3x higher than finance's number. Most likely cause?",
          options: [
            "The database is broken",
            "The join changed the grain to one row per item, duplicating order-level amounts",
            "You used uppercase keywords",
            "COALESCE was missing",
          ],
          answer: 1,
          explain: "Joining a one-to-many relationship repeats the 'one' side. Summing an order-level amount after that join inflates totals. Check row counts and grain.",
        },
        {
          q: "What is the purpose of NULLIF(clicks, 0) in a denominator?",
          options: [
            "Replaces NULL clicks with 0",
            "Prevents a divide-by-zero error by turning 0 into NULL",
            "Removes rows with zero clicks from the table",
            "Rounds the result",
          ],
          answer: 1,
          explain: "Dividing by NULL gives NULL instead of an error, so the query keeps running.",
        },
      ],
    },
  ],
};
