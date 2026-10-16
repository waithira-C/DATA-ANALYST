import type { Floor } from '../types';

export const floor5: Floor = {
  id: 5,
  title: "SQL I",
  tagline: "Talk to databases: select, filter, sort, summarise, and join tables.",
  color: "#f97316",
  icon: "🗄️",
  outcomes: [
    "Explain what databases, tables, rows, columns, and keys are",
    "Retrieve and filter data with SELECT, WHERE, and its operators",
    "Sort and limit results with ORDER BY and LIMIT",
    "Summarise data with aggregates, GROUP BY, and HAVING",
    "Combine tables with INNER JOIN and LEFT JOIN",
  ],
  steps: [
    {
      id: "f5-s1",
      title: "Databases, Tables, and SELECT",
      minutes: 14,
      xp: 90,
      skills: ["sql"],
      lesson: [
        {
          heading: "What a database is",
          body: `A **database** is an organised collection of data, built to store millions of rows safely and let many people query them at once.

Most business data lives in **relational databases**: data is split into **tables**, and tables are linked by shared columns. You'll hear names like PostgreSQL, MySQL, SQL Server, BigQuery, Snowflake. They all speak **SQL** (Structured Query Language), with small dialect differences.

As an analyst you mostly **read** data: you ask questions, the database answers.`,
        },
        {
          heading: "Tables, rows, columns, keys",
          body: `A **table** looks like a spreadsheet tab with strict rules:

- Each **column** has a name and a data type (integer, text, date, decimal).
- Each **row** is one record.
- A **primary key** uniquely identifies each row, like \`customer_id\`.
- A **foreign key** is a column that points to another table's primary key, like \`customer_id\` inside the \`orders\` table.

Throughout this floor we'll use two tables:`,
          example: `customers
customer_id | name     | city      | signup_date
1           | Aisha    | London    | 2024-01-15
2           | Marco    | Milan     | 2024-03-02
3           | Priya    | London    | 2024-06-20

orders
order_id | customer_id | amount | status     | order_date
101      | 1           | 42.50  | delivered  | 2025-01-05
102      | 2           | 18.00  | refunded   | 2025-01-07
103      | 1           | 99.99  | delivered  | 2025-02-11`,
          exampleLang: "text",
        },
        {
          heading: "SELECT and FROM",
          body: `Every query starts the same way: **which columns** do you want, **from which table**?

- \`SELECT\` lists the columns.
- \`FROM\` names the table.
- \`*\` means "all columns".
- End statements with a semicolon \`;\`.

SQL keywords aren't case-sensitive, but writing them in CAPITALS makes queries easier to read.`,
          example: `SELECT name, city
FROM customers;

SELECT *
FROM orders;`,
          exampleLang: "sql",
          tip: "On real tables with dozens of columns and millions of rows, avoid SELECT *. Ask only for what you need.",
        },
        {
          heading: "Aliases and calculated columns",
          body: `You can rename a column in the output with \`AS\`, and calculate new columns on the fly.

\`DISTINCT\` removes duplicate rows from the result, perfect for "which cities do we have customers in?"`,
          example: `SELECT order_id,
       amount,
       amount * 0.2 AS vat
FROM orders;

SELECT DISTINCT city
FROM customers;   -- London, Milan`,
          exampleLang: "sql",
        },
      ],
      game: { kind: "query-quest", stage: 0 },
      quiz: [
        {
          q: "Which query returns every column from the products table?",
          options: [
            "SELECT products;",
            "SELECT * FROM products;",
            "GET ALL FROM products;",
            "SELECT FROM products *;",
          ],
          answer: 1,
          explain: "SELECT * FROM table returns all columns. The other options aren't valid SQL.",
        },
        {
          q: "What is a primary key?",
          options: [
            "The first column alphabetically",
            "A column that uniquely identifies each row",
            "A password for the database",
            "The largest number in a table",
          ],
          answer: 1,
          explain: "A primary key's values are unique and not empty, so each row can be identified exactly.",
        },
        {
          q: "In the orders table, customer_id points to the customers table. In orders, customer_id is a...",
          options: ["Primary key", "Foreign key", "Alias", "Aggregate"],
          answer: 1,
          explain: "A foreign key references another table's primary key, linking the two.",
        },
        {
          q: "Which query lists each city only once?",
          options: [
            "SELECT city FROM customers;",
            "SELECT DISTINCT city FROM customers;",
            "SELECT UNIQUE * FROM customers;",
            "SELECT city AS distinct FROM customers;",
          ],
          answer: 1,
          explain: "DISTINCT removes duplicate values from the result.",
        },
      ],
    },
    {
      id: "f5-s2",
      title: "Filtering Rows with WHERE",
      minutes: 16,
      xp: 100,
      skills: ["sql"],
      lesson: [
        {
          heading: "WHERE: keep only matching rows",
          body: `\`WHERE\` filters rows **before** they're returned. It goes after FROM.

Text values go in **single quotes**. Numbers don't.

Comparison operators: \`=\`, \`<>\` or \`!=\` (not equal), \`>\`, \`<\`, \`>=\`, \`<=\`.`,
          example: `SELECT order_id, amount
FROM orders
WHERE status = 'delivered';

SELECT *
FROM orders
WHERE amount >= 50;`,
          exampleLang: "sql",
        },
        {
          heading: "AND, OR, and parentheses",
          body: `Combine conditions with \`AND\` (both must be true) and \`OR\` (either can be true).

When mixing them, **use parentheses**. Without them, AND is evaluated before OR, which often gives surprising results.`,
          example: `-- Delivered orders over 50
SELECT * FROM orders
WHERE status = 'delivered' AND amount > 50;

-- Refunded OR cancelled orders over 50
SELECT * FROM orders
WHERE (status = 'refunded' OR status = 'cancelled')
  AND amount > 50;`,
          exampleLang: "sql",
        },
        {
          heading: "IN and BETWEEN: cleaner filters",
          body: `- \`IN (...)\` matches any value in a list. Shorter than many ORs.
- \`BETWEEN a AND b\` matches a range, **including both ends**.

Both work with numbers, text, and dates.`,
          example: `SELECT * FROM customers
WHERE city IN ('London', 'Milan', 'Paris');

SELECT * FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-01-31';

SELECT * FROM orders
WHERE amount NOT BETWEEN 10 AND 100;`,
          exampleLang: "sql",
        },
        {
          heading: "LIKE: pattern matching",
          body: `\`LIKE\` matches text patterns using wildcards:

- \`%\` = any number of characters (including none).
- \`_\` = exactly one character.

Case sensitivity depends on the database. Some (like PostgreSQL) offer \`ILIKE\` for case-insensitive matching.`,
          example: `SELECT * FROM customers WHERE name LIKE 'A%';       -- starts with A
SELECT * FROM customers WHERE email LIKE '%@gmail.com'; -- ends with
SELECT * FROM products  WHERE name LIKE '%case%';     -- contains "case"`,
          exampleLang: "sql",
        },
        {
          heading: "NULL: the missing value",
          body: `\`NULL\` means "unknown / no value". It's not zero and not an empty string.

You **cannot** use \`= NULL\`. Comparisons with NULL never return true. Use \`IS NULL\` and \`IS NOT NULL\` instead.

Worked example: find customers who never gave a phone number.`,
          example: `SELECT customer_id, name
FROM customers
WHERE phone IS NULL;

SELECT COUNT(*) FROM customers
WHERE phone IS NOT NULL;`,
          exampleLang: "sql",
          tip: "WHERE phone = NULL runs without error but returns zero rows. It's one of the sneakiest beginner bugs.",
        },
      ],
      game: { kind: "query-quest", stage: 1 },
      quiz: [
        {
          q: "Which query finds customers in London or Paris?",
          options: [
            "SELECT * FROM customers WHERE city = 'London', 'Paris';",
            "SELECT * FROM customers WHERE city IN ('London', 'Paris');",
            "SELECT * FROM customers WHERE city BETWEEN 'London' AND 'Paris';",
            "SELECT * FROM customers WHERE city LIKE 'London Paris';",
          ],
          answer: 1,
          explain: "IN matches any value in the list. BETWEEN would match an alphabetical range, which is not what you want.",
        },
        {
          q: "How do you find orders where the discount_code is missing?",
          options: [
            "WHERE discount_code = NULL",
            "WHERE discount_code IS NULL",
            "WHERE discount_code = ''",
            "WHERE discount_code = 0",
          ],
          answer: 1,
          explain: "NULL must be tested with IS NULL. = NULL never matches anything.",
        },
        {
          q: "Does amount BETWEEN 10 AND 20 include an amount of exactly 20?",
          options: ["Yes, BETWEEN includes both ends", "No, it excludes the upper end", "Only if it's an integer", "No, it excludes both ends"],
          answer: 0,
          explain: "BETWEEN is inclusive on both sides: 10 and 20 both match.",
        },
        {
          q: "Which pattern matches product codes that start with 'SKU-'?",
          options: ["LIKE '%SKU-'", "LIKE 'SKU-%'", "LIKE '_SKU-'", "= 'SKU-%'"],
          answer: 1,
          explain: "The % after 'SKU-' allows anything to follow. = doesn't use wildcards.",
        },
        {
          q: "WHERE status = 'refunded' OR status = 'cancelled' AND amount > 100. What does this actually return?",
          options: [
            "Only refunded or cancelled orders over 100",
            "All refunded orders, plus cancelled orders over 100",
            "Nothing, it's invalid",
            "Only cancelled orders",
          ],
          answer: 1,
          explain: "AND binds before OR. Wrap the OR part in parentheses to get the intended result.",
        },
      ],
    },
    {
      id: "f5-s3",
      title: "Sorting and Limiting: ORDER BY and LIMIT",
      minutes: 10,
      xp: 80,
      skills: ["sql"],
      lesson: [
        {
          heading: "ORDER BY",
          body: `Databases don't guarantee any row order unless you ask. \`ORDER BY\` sorts the result.

- \`ASC\` = ascending (smallest first, A to Z, oldest first). This is the default.
- \`DESC\` = descending (largest first, Z to A, newest first).`,
          example: `SELECT order_id, amount
FROM orders
ORDER BY amount DESC;

SELECT name, signup_date
FROM customers
ORDER BY signup_date;     -- oldest first (ASC default)`,
          exampleLang: "sql",
        },
        {
          heading: "Sorting by several columns",
          body: `List multiple columns separated by commas. The second column only breaks ties in the first.

Worked example: customers grouped by city alphabetically, and within each city, newest sign-ups first.`,
          example: `SELECT name, city, signup_date
FROM customers
ORDER BY city ASC, signup_date DESC;`,
          exampleLang: "sql",
        },
        {
          heading: "LIMIT: top-N questions",
          body: `\`LIMIT n\` returns only the first n rows. Combined with ORDER BY, it answers the classic "top 10" questions.

It's also handy for peeking at a huge table without pulling millions of rows.

Note: SQL Server uses \`SELECT TOP 10 ...\` instead of LIMIT. Same idea, different dialect.`,
          example: `-- Top 5 biggest orders
SELECT order_id, customer_id, amount
FROM orders
ORDER BY amount DESC
LIMIT 5;

-- Quick peek at a table
SELECT * FROM orders LIMIT 10;`,
          exampleLang: "sql",
          tip: "LIMIT without ORDER BY gives you some arbitrary rows, not the \"first\" ones. Always sort when the order matters.",
        },
        {
          heading: "The order of clauses",
          body: `Clauses must be written in a fixed order. So far:

\`SELECT\` > \`FROM\` > \`WHERE\` > \`ORDER BY\` > \`LIMIT\`

Worked example: the 3 most recent delivered orders over 20.`,
          example: `SELECT order_id, amount, order_date
FROM orders
WHERE status = 'delivered'
  AND amount > 20
ORDER BY order_date DESC
LIMIT 3;`,
          exampleLang: "sql",
        },
      ],
      game: { kind: "query-quest", stage: 2 },
      quiz: [
        {
          q: "Which query returns the 10 cheapest products?",
          options: [
            "SELECT * FROM products ORDER BY price DESC LIMIT 10;",
            "SELECT * FROM products ORDER BY price ASC LIMIT 10;",
            "SELECT * FROM products LIMIT 10;",
            "SELECT * FROM products WHERE price LIMIT 10;",
          ],
          answer: 1,
          explain: "Sort ascending (lowest first), then take 10. Without ORDER BY you'd get arbitrary rows.",
        },
        {
          q: "What's the default sort direction for ORDER BY?",
          options: ["DESC", "ASC", "Random", "By primary key"],
          answer: 1,
          explain: "ORDER BY sorts ascending unless you specify DESC.",
        },
        {
          q: "Which clause order is valid?",
          options: [
            "SELECT, WHERE, FROM, ORDER BY",
            "SELECT, FROM, ORDER BY, WHERE",
            "SELECT, FROM, WHERE, ORDER BY, LIMIT",
            "FROM, SELECT, LIMIT, WHERE",
          ],
          answer: 2,
          explain: "SQL requires SELECT, FROM, WHERE, ORDER BY, LIMIT in that order.",
        },
        {
          q: "ORDER BY region ASC, revenue DESC means...",
          options: [
            "Sort by revenue only",
            "Sort by region A-Z; within each region, highest revenue first",
            "Sort by revenue, then by region",
            "It's invalid to mix ASC and DESC",
          ],
          answer: 1,
          explain: "The first column is the main sort; the second breaks ties within it.",
        },
      ],
    },
    {
      id: "f5-s4",
      title: "Summarising: Aggregates, GROUP BY, HAVING",
      minutes: 18,
      xp: 130,
      skills: ["sql"],
      lesson: [
        {
          heading: "Aggregate functions",
          body: `Aggregates collapse many rows into one number:

- \`COUNT(*)\`: number of rows.
- \`COUNT(column)\`: number of non-NULL values in that column.
- \`COUNT(DISTINCT column)\`: number of unique values.
- \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`: what you'd expect.`,
          example: `SELECT COUNT(*)                     AS total_orders,
       COUNT(DISTINCT customer_id) AS unique_customers,
       SUM(amount)                 AS revenue,
       ROUND(AVG(amount), 2)       AS avg_order
FROM orders
WHERE status = 'delivered';`,
          exampleLang: "sql",
        },
        {
          heading: "GROUP BY: one row per group",
          body: `\`GROUP BY\` splits rows into groups and runs the aggregate **for each group**. It's the SQL version of a pivot table.

The rule: every column in SELECT must either be **in the GROUP BY** or **inside an aggregate**.`,
          example: `SELECT status,
       COUNT(*)    AS orders,
       SUM(amount) AS revenue
FROM orders
GROUP BY status;

status    | orders | revenue
delivered | 2      | 142.49
refunded  | 1      | 18.00`,
          exampleLang: "sql",
          tip: "You can group by several columns, e.g. GROUP BY city, status gives one row per city-status combination.",
        },
        {
          heading: "HAVING: filter the groups",
          body: `\`WHERE\` filters **rows before** grouping. \`HAVING\` filters **groups after** aggregation.

So you can't write \`WHERE COUNT(*) > 5\`. Aggregates don't exist yet at the WHERE stage. Use HAVING.

Worked example: customers with more than 3 delivered orders.`,
          example: `SELECT customer_id,
       COUNT(*)    AS orders,
       SUM(amount) AS total_spent
FROM orders
WHERE status = 'delivered'      -- filter rows first
GROUP BY customer_id
HAVING COUNT(*) > 3             -- then filter groups
ORDER BY total_spent DESC;`,
          exampleLang: "sql",
        },
        {
          heading: "The full clause order",
          body: `Written order:

\`SELECT\` > \`FROM\` > \`WHERE\` > \`GROUP BY\` > \`HAVING\` > \`ORDER BY\` > \`LIMIT\`

The database actually runs them in a different logical order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT. That's why WHERE can't see aggregates, and why some databases won't let WHERE use an alias defined in SELECT.

Memory hook: **S**ome **F**riendly **W**izards **G**ive **H**elpful **O**rders **L**ater.`,
        },
        {
          heading: "Worked example: monthly revenue",
          body: `A finance manager asks for revenue per month, only for months above 10,000. Many databases have a function to cut a date down to its month. The exact name varies by dialect.`,
          example: `-- PostgreSQL style
SELECT DATE_TRUNC('month', order_date) AS month,
       SUM(amount)                     AS revenue
FROM orders
WHERE status = 'delivered'
GROUP BY DATE_TRUNC('month', order_date)
HAVING SUM(amount) > 10000
ORDER BY month;`,
          exampleLang: "sql",
        },
      ],
      game: { kind: "query-quest", stage: 3 },
      quiz: [
        {
          q: "What's the difference between WHERE and HAVING?",
          options: [
            "They're identical",
            "WHERE filters rows before grouping; HAVING filters groups after aggregation",
            "HAVING filters rows; WHERE filters columns",
            "WHERE only works with numbers",
          ],
          answer: 1,
          explain: "WHERE acts on individual rows, HAVING on the aggregated groups.",
        },
        {
          q: "Which query counts orders per city in a table with a city column?",
          options: [
            "SELECT city, COUNT(*) FROM orders;",
            "SELECT city, COUNT(*) FROM orders GROUP BY city;",
            "SELECT COUNT(city) FROM orders ORDER BY city;",
            "SELECT city FROM orders HAVING COUNT(*);",
          ],
          answer: 1,
          explain: "GROUP BY city gives one row per city, and COUNT(*) counts rows in each.",
        },
        {
          q: "A column email has 100 rows, 8 of them NULL. What does COUNT(email) return?",
          options: ["100", "92", "8", "NULL"],
          answer: 1,
          explain: "COUNT(column) ignores NULLs. COUNT(*) would return 100.",
        },
        {
          q: "Why does this fail? SELECT product, category, SUM(sales) FROM t GROUP BY product;",
          options: [
            "SUM can't be used with GROUP BY",
            "category is neither grouped nor aggregated",
            "product must be inside SUM",
            "GROUP BY must come before FROM",
          ],
          answer: 1,
          explain: "Every selected column must be in GROUP BY or wrapped in an aggregate.",
        },
        {
          q: "Which finds products with average rating above 4.5?",
          options: [
            "SELECT product FROM reviews WHERE AVG(rating) > 4.5 GROUP BY product;",
            "SELECT product, AVG(rating) FROM reviews GROUP BY product HAVING AVG(rating) > 4.5;",
            "SELECT product FROM reviews HAVING rating > 4.5;",
            "SELECT AVG(rating) > 4.5 FROM reviews;",
          ],
          answer: 1,
          explain: "Filtering on an aggregate requires HAVING after GROUP BY.",
        },
      ],
    },
    {
      id: "f5-s5",
      title: "Joining Tables: INNER and LEFT JOIN",
      minutes: 20,
      xp: 150,
      skills: ["sql"],
      lesson: [
        {
          heading: "Why join?",
          body: `Databases split data across tables to avoid repetition. Customer names live in \`customers\`; orders live in \`orders\`. To answer "How much has each customer *by name* spent?", you need both.

A **JOIN** combines rows from two tables where a key matches, usually a foreign key to a primary key: \`orders.customer_id = customers.customer_id\`.`,
        },
        {
          heading: "INNER JOIN: only matches",
          body: `\`INNER JOIN\` returns rows only where the key exists in **both** tables. Customers with no orders disappear; orders with an unknown customer disappear.

Use **table aliases** (\`c\`, \`o\`) to keep queries short, and prefix columns with the alias so the database knows which table each comes from.`,
          example: `SELECT c.name,
       o.order_id,
       o.amount
FROM orders AS o
INNER JOIN customers AS c
  ON o.customer_id = c.customer_id;

name  | order_id | amount
Aisha | 101      | 42.50
Marco | 102      | 18.00
Aisha | 103      | 99.99
-- Priya has no orders, so she's not here`,
          exampleLang: "sql",
        },
        {
          heading: "LEFT JOIN: keep everything on the left",
          body: `\`LEFT JOIN\` keeps **every row from the left table** (the one after FROM), and attaches matching rows from the right. Where there's no match, the right-side columns are **NULL**.

This is how you find things that are missing: customers who never ordered, products never sold.`,
          example: `SELECT c.name, o.order_id
FROM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id;

name  | order_id
Aisha | 101
Aisha | 103
Marco | 102
Priya | NULL     <- kept, no matching order

-- Customers who have never ordered:
SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;`,
          exampleLang: "sql",
          tip: "Table order matters for LEFT JOIN. customers LEFT JOIN orders keeps all customers; orders LEFT JOIN customers keeps all orders.",
        },
        {
          heading: "Joining plus grouping",
          body: `Joins combine naturally with everything you've learned. Worked example: total delivered revenue per customer name, including customers with zero.

\`COALESCE(x, 0)\` replaces NULL with 0, so customers with no orders show 0 instead of NULL.`,
          example: `SELECT c.name,
       COUNT(o.order_id)          AS orders,
       COALESCE(SUM(o.amount), 0) AS revenue
FROM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id
 AND o.status = 'delivered'
GROUP BY c.name
ORDER BY revenue DESC;`,
          exampleLang: "sql",
        },
        {
          heading: "Join pitfalls to watch for",
          body: `- **Row explosion**: if the key isn't unique on one side, rows multiply. Joining orders to a table with two rows per customer doubles every order, and doubles your revenue. Check row counts before and after a join.
- **Wrong join key**: joining on \`name\` instead of an ID breaks when two people share a name.
- **WHERE after a LEFT JOIN**: filtering on a right-table column in WHERE (e.g. \`WHERE o.status = 'delivered'\`) silently removes the NULL rows, turning it into an inner join. Put such conditions in the ON clause instead, like the example above.`,
        },
      ],
      game: { kind: "query-quest", stage: 4 },
      quiz: [
        {
          q: "Which join returns only customers who have at least one order?",
          options: ["LEFT JOIN from customers", "INNER JOIN", "No join is needed", "LEFT JOIN with no ON clause"],
          answer: 1,
          explain: "INNER JOIN keeps only rows with matches in both tables.",
        },
        {
          q: "customers LEFT JOIN orders: what happens to a customer with no orders?",
          options: [
            "They're removed from the result",
            "They appear once, with NULL in the order columns",
            "The query errors",
            "They appear with order_id = 0",
          ],
          answer: 1,
          explain: "LEFT JOIN keeps all left-table rows and fills unmatched right-side columns with NULL.",
        },
        {
          q: "How do you find products that have never been sold (products and sales tables)?",
          options: [
            "products INNER JOIN sales ... WHERE sales.id IS NULL",
            "products LEFT JOIN sales ... WHERE sales.id IS NULL",
            "sales LEFT JOIN products ... WHERE products.id IS NULL",
            "SELECT * FROM products WHERE sold = NULL",
          ],
          answer: 1,
          explain: "Keep all products with a LEFT JOIN, then keep the rows where no sale matched (NULL).",
        },
        {
          q: "After joining orders to a promotions table, total revenue doubled. Most likely cause?",
          options: [
            "The promotions worked",
            "The join key wasn't unique, so orders were duplicated",
            "SUM double-counts by default",
            "INNER JOIN always doubles rows",
          ],
          answer: 1,
          explain: "Non-unique keys multiply rows. Always compare row counts before and after joining.",
        },
        {
          q: "What does the ON clause specify?",
          options: [
            "Which columns to display",
            "How rows in the two tables are matched",
            "The sort order",
            "Which database to use",
          ],
          answer: 1,
          explain: "ON defines the matching condition, typically a foreign key equal to a primary key.",
        },
      ],
    },
  ],
};
