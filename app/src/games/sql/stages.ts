export interface SqlChallenge {
  prompt: string
  solution: string
  /** If true, row order must match the solution exactly. */
  ordered?: boolean
  hint: string
  starter?: string
}

export interface SqlStage {
  story: string
  challenges: SqlChallenge[]
}

/** Ten stages that follow Floors 5 (stages 0-4) and 6 (stages 5-9). */
export const SQL_STAGES: SqlStage[] = [
  {
    story: 'Day one at Bean & Byte. Your manager wants to see what is on the menu.',
    challenges: [
      { prompt: 'Show every column of every row in the `products` table.', solution: 'SELECT * FROM products', hint: '`SELECT *` means "all columns".' },
      { prompt: 'Show only the `name` and `price` of each product.', solution: 'SELECT name, price FROM products', hint: 'List columns after SELECT, separated by commas.' },
      { prompt: 'Show the `name` and `city` of every customer.', solution: 'SELECT name, city FROM customers', hint: 'The table is `customers`.' },
    ],
  },
  {
    story: 'Marketing is planning a campaign and needs some specific lists.',
    challenges: [
      { prompt: 'List the `name` and `price` of products that cost **more than 4**.', solution: 'SELECT name, price FROM products WHERE price > 4', hint: 'Use `WHERE price > 4`.' },
      { prompt: 'List the `name` of all customers in **Berlin**.', solution: "SELECT name FROM customers WHERE city = 'Berlin'", hint: "Text values go in single quotes: `'Berlin'`." },
      { prompt: 'Show all columns of orders whose status is **refunded** or **pending**.', solution: "SELECT * FROM orders WHERE status IN ('refunded','pending')", hint: "`IN ('a','b')` matches any value in the list." },
      { prompt: 'List the `name` of products in the **Tea** category priced **between 3 and 5.5**.', solution: "SELECT name FROM products WHERE category = 'Tea' AND price BETWEEN 3 AND 5.5", hint: 'Combine conditions with AND; BETWEEN includes both ends.' },
    ],
  },
  {
    story: 'The owner loves leaderboards. Time to sort things out.',
    challenges: [
      { prompt: 'Show the `name` and `price` of the **3 most expensive** products, most expensive first.', solution: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 3', ordered: true, hint: '`ORDER BY price DESC` then `LIMIT 3`.' },
      { prompt: 'List customer `name` and `signup_date`, **newest sign-ups first**.', solution: 'SELECT name, signup_date FROM customers ORDER BY signup_date DESC', ordered: true, hint: 'ISO dates sort correctly as text.' },
      { prompt: 'Show the `order_id` and `total` of the **5 biggest completed orders** (largest first).', solution: "SELECT order_id, total FROM orders WHERE status = 'completed' ORDER BY total DESC LIMIT 5", ordered: true, hint: 'WHERE comes before ORDER BY, LIMIT goes last.' },
    ],
  },
  {
    story: 'Finance wants summaries, not raw rows.',
    challenges: [
      { prompt: 'Count how many orders exist for each `status`. Return `status` and the count.', solution: 'SELECT status, COUNT(*) FROM orders GROUP BY status', hint: '`GROUP BY status` with `COUNT(*)`.' },
      { prompt: 'Return each product `category` and its **average price** (round to 2 decimals).', solution: 'SELECT category, ROUND(AVG(price), 2) FROM products GROUP BY category', hint: '`ROUND(AVG(price), 2)`.' },
      { prompt: 'Which `city` values have **more than 2** customers? Return city and the count.', solution: 'SELECT city, COUNT(*) FROM customers GROUP BY city HAVING COUNT(*) > 2', hint: 'Filter groups with HAVING, not WHERE.' },
      { prompt: 'Total revenue (sum of `total`) from **completed** orders only, as one number rounded to 2 decimals.', solution: "SELECT ROUND(SUM(total), 2) FROM orders WHERE status = 'completed'", hint: 'WHERE filters rows before SUM.' },
    ],
  },
  {
    story: 'The data lives in several tables. Connect the dots.',
    challenges: [
      { prompt: 'For every order, show `order_id` and the **customer name**.', solution: 'SELECT o.order_id, c.name FROM orders o JOIN customers c ON o.customer_id = c.customer_id', hint: '`JOIN customers c ON o.customer_id = c.customer_id`.' },
      { prompt: 'Find customers who have **never placed an order**. Return their `name`.', solution: 'SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.customer_id WHERE o.order_id IS NULL', hint: 'LEFT JOIN keeps all customers; unmatched orders become NULL.' },
      { prompt: 'Total **quantity sold per product name**. Return product name and total quantity.', solution: 'SELECT p.name, SUM(oi.quantity) FROM order_items oi JOIN products p ON p.product_id = oi.product_id GROUP BY p.name', hint: 'Join `order_items` to `products`, then GROUP BY name.' },
    ],
  },
  {
    story: 'Ops wants labels on the data, not just numbers.',
    challenges: [
      { prompt: "Show product `name` and a label: **'premium'** if price >= 5, otherwise **'standard'**.", solution: "SELECT name, CASE WHEN price >= 5 THEN 'premium' ELSE 'standard' END FROM products", hint: "`CASE WHEN price >= 5 THEN 'premium' ELSE 'standard' END`." },
      { prompt: "Bucket orders by size: **'small'** under 5, **'medium'** 5 to under 15, **'large'** 15+. Return the bucket and the number of orders in it.", solution: "SELECT CASE WHEN total < 5 THEN 'small' WHEN total < 15 THEN 'medium' ELSE 'large' END AS bucket, COUNT(*) FROM orders GROUP BY bucket", hint: 'Give the CASE an alias and GROUP BY that alias.' },
    ],
  },
  {
    story: 'A query inside a query. The plot thickens.',
    challenges: [
      { prompt: 'List the `name` and `price` of products priced **above the average product price**.', solution: 'SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products)', hint: 'Compare against `(SELECT AVG(price) FROM products)`.' },
      { prompt: 'List the `name` of customers who placed **at least one refunded** order.', solution: "SELECT name FROM customers WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = 'refunded')", hint: '`WHERE customer_id IN (SELECT ...)`.' },
    ],
  },
  {
    story: 'Readable queries win. Use WITH to build in steps.',
    challenges: [
      {
        prompt: 'Using a CTE, compute each customer\'s total spend on completed orders, then return the `customer_id` and spend for customers who spent **more than 40** (spend rounded to 2).',
        solution: "WITH spend AS (SELECT customer_id, SUM(total) AS s FROM orders WHERE status = 'completed' GROUP BY customer_id) SELECT customer_id, ROUND(s, 2) FROM spend WHERE s > 40",
        hint: 'WITH spend AS (SELECT customer_id, SUM(total) AS s ... GROUP BY customer_id) SELECT ... FROM spend WHERE s > 40',
      },
      {
        prompt: 'Using a CTE of daily revenue (completed orders), return the **single best day**: `order_date` and revenue rounded to 2.',
        solution: "WITH daily AS (SELECT order_date, SUM(total) AS rev FROM orders WHERE status = 'completed' GROUP BY order_date) SELECT order_date, ROUND(rev, 2) FROM daily ORDER BY rev DESC LIMIT 1",
        ordered: true,
        hint: 'Aggregate in the CTE, then ORDER BY rev DESC LIMIT 1.',
      },
    ],
  },
  {
    story: 'Rankings without collapsing rows: welcome to window functions.',
    challenges: [
      { prompt: 'For each product show `category`, `name`, `price` and its **price rank within its category** (1 = most expensive, use RANK).', solution: 'SELECT category, name, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) FROM products', hint: '`RANK() OVER (PARTITION BY category ORDER BY price DESC)`.' },
      {
        prompt: "Return each customer's **single largest order**: `customer_id`, `order_id`, `total`. Use ROW_NUMBER in a subquery or CTE.",
        solution: 'SELECT customer_id, order_id, total FROM (SELECT customer_id, order_id, total, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY total DESC, order_id) AS rn FROM orders) WHERE rn = 1',
        hint: 'Number rows per customer by total DESC, then keep rn = 1. Break ties by order_id.',
      },
    ],
  },
  {
    story: 'The CFO wants the trend, day by day.',
    challenges: [
      {
        prompt: 'Daily completed revenue with a **running total**: `order_date`, daily revenue, running revenue (both rounded to 2), ordered by date.',
        solution: "WITH d AS (SELECT order_date, SUM(total) AS rev FROM orders WHERE status = 'completed' GROUP BY order_date) SELECT order_date, ROUND(rev, 2), ROUND(SUM(rev) OVER (ORDER BY order_date), 2) FROM d ORDER BY order_date",
        ordered: true,
        hint: '`SUM(rev) OVER (ORDER BY order_date)` on top of a daily CTE.',
      },
      {
        prompt: 'Using LAG, show `order_date`, daily completed revenue and the **change vs the previous day** (both rounded to 2; first day change is NULL).',
        solution: "WITH d AS (SELECT order_date, SUM(total) AS rev FROM orders WHERE status = 'completed' GROUP BY order_date) SELECT order_date, ROUND(rev, 2), ROUND(rev - LAG(rev) OVER (ORDER BY order_date), 2) FROM d ORDER BY order_date",
        ordered: true,
        hint: '`rev - LAG(rev) OVER (ORDER BY order_date)`.',
      },
    ],
  },
]
