/**
 * "Bean & Byte" — a small fictional coffee chain used by Query Quest.
 * Generated deterministically so expected answers are stable.
 */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

const products: [number, string, string, number][] = [
  [1, 'Espresso', 'Coffee', 2.5],
  [2, 'Latte', 'Coffee', 4.2],
  [3, 'Cappuccino', 'Coffee', 4.0],
  [4, 'Cold Brew', 'Coffee', 4.8],
  [5, 'Matcha Latte', 'Tea', 5.1],
  [6, 'Chai', 'Tea', 3.9],
  [7, 'Green Tea', 'Tea', 2.8],
  [8, 'Croissant', 'Bakery', 3.2],
  [9, 'Banana Bread', 'Bakery', 3.6],
  [10, 'Bagel', 'Bakery', 2.9],
  [11, 'Beans 1kg Bag', 'Retail', 24.0],
  [12, 'Travel Mug', 'Retail', 15.5],
]

const customers: [number, string, string, string, string][] = [
  [1, 'Ada Okafor', 'Lagos', 'Nigeria', '2025-01-14'],
  [2, 'Ben Carter', 'London', 'UK', '2025-02-03'],
  [3, 'Chen Wei', 'Singapore', 'Singapore', '2025-02-21'],
  [4, 'Diana Silva', 'São Paulo', 'Brazil', '2025-03-09'],
  [5, 'Eli Novak', 'Berlin', 'Germany', '2025-03-30'],
  [6, 'Fatima Zahra', 'Casablanca', 'Morocco', '2025-04-11'],
  [7, 'Gabe Moreno', 'Austin', 'USA', '2025-04-25'],
  [8, 'Hana Sato', 'Tokyo', 'Japan', '2025-05-06'],
  [9, 'Ivan Petrov', 'Berlin', 'Germany', '2025-05-19'],
  [10, 'Jade Thompson', 'London', 'UK', '2025-06-02'],
  [11, 'Kwame Mensah', 'Accra', 'Ghana', '2025-06-17'],
  [12, 'Lena Fischer', 'Berlin', 'Germany', '2025-07-01'],
  [13, 'Mo Ibrahim', 'Lagos', 'Nigeria', '2025-07-15'],
  [14, 'Nora Jensen', 'London', 'UK', '2025-08-04'],
  [15, 'Omar Haddad', 'Dubai', 'UAE', '2025-08-22'],
]

function build() {
  const r = rng(42)
  const orders: [number, number, string, string, number][] = []
  const items: [number, number, number][] = []
  let oid = 1
  // customers 6 and 15 never order (useful for LEFT JOIN puzzles)
  const active = customers.map((c) => c[0]).filter((id) => id !== 6 && id !== 15)
  for (let day = 1; day <= 28; day++) {
    const perDay = 1 + Math.floor(r() * 3)
    for (let k = 0; k < perDay; k++) {
      const cust = active[Math.floor(r() * active.length)]
      const date = `2026-03-${String(day).padStart(2, '0')}`
      const n = 1 + Math.floor(r() * 3)
      let total = 0
      const used = new Set<number>()
      for (let j = 0; j < n; j++) {
        let pid = 1 + Math.floor(r() * products.length)
        while (used.has(pid)) pid = (pid % products.length) + 1
        used.add(pid)
        const qty = 1 + Math.floor(r() * 2)
        total += products[pid - 1][3] * qty
        items.push([oid, pid, qty])
      }
      const roll = r()
      const status = roll < 0.08 ? 'refunded' : roll < 0.14 ? 'pending' : 'completed'
      orders.push([oid, cust, date, status, Math.round(total * 100) / 100])
      oid++
    }
  }
  return { orders, items }
}

const q = (v: string | number) => (typeof v === 'number' ? String(v) : `'${v.replace(/'/g, "''")}'`)
const rows = (arr: (string | number)[][]) => arr.map((r) => `(${r.map(q).join(', ')})`).join(',\n')

export function datasetSql(): string {
  const { orders, items } = build()
  return `
CREATE TABLE products (product_id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL);
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT, city TEXT, country TEXT, signup_date TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT, total REAL);
CREATE TABLE order_items (order_id INTEGER, product_id INTEGER, quantity INTEGER);
INSERT INTO products VALUES ${rows(products)};
INSERT INTO customers VALUES ${rows(customers)};
INSERT INTO orders VALUES ${rows(orders)};
INSERT INTO order_items VALUES ${rows(items)};
`
}

export const SCHEMA = [
  { table: 'products', cols: ['product_id', 'name', 'category', 'price'] },
  { table: 'customers', cols: ['customer_id', 'name', 'city', 'country', 'signup_date'] },
  { table: 'orders', cols: ['order_id', 'customer_id', 'order_date', 'status', 'total'] },
  { table: 'order_items', cols: ['order_id', 'product_id', 'quantity'] },
]
