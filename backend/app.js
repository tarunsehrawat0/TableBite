const express = require('express');
const Database = require('better-sqlite3');
const client = require('prom-client');

const app = express();
app.use(express.json());
client.collectDefaultMetrics();
const ordersTotal = new client.Counter({ name: 'orders_total', help: 'Orders placed' });

const db = new Database(process.env.DB_PATH || ':memory:');
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  table_no INTEGER NOT NULL,
  items TEXT NOT NULL,
  total REAL NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
const columns = db.prepare('PRAGMA table_info(orders)').all().map(column => column.name);
if (!columns.includes('customer_name')) db.exec("ALTER TABLE orders ADD COLUMN customer_name TEXT NOT NULL DEFAULT ''");
if (!columns.includes('customer_phone')) db.exec("ALTER TABLE orders ADD COLUMN customer_phone TEXT NOT NULL DEFAULT ''");

const MENU = [
  { id: 1, cat: 'Burger', name: 'Aalo Burger', price: 90 },
  { id: 2, cat: 'Burger', name: 'Aalo Tikki Cheese Burger', price: 100 },
  { id: 3, cat: 'Burger', name: 'Aalo Tikki Panner Burger', price: 120 },
  { id: 4, cat: 'Burger', name: 'Aalo Tikki Kurkure Burger', price: 140 },
  { id: 5, cat: 'Sandwich', name: 'Veg. Grilled Sandwich', price: 120 },
  { id: 6, cat: 'Sandwich', name: 'Cheese Grilled Sandwich', price: 140 },
  { id: 7, cat: 'Sandwich', name: 'Panner Grilled Sandwich', price: 150 },
  { id: 8, cat: 'Sandwich', name: 'Tandoori Grilled Sandwich', price: 160 },
  { id: 9, cat: 'Sandwich', name: 'Afgani Grilled Sandwich', price: 170 },
  { id: 10, cat: 'Healthy Wraps', name: 'Vegetable Wrap', price: 130 },
  { id: 11, cat: 'Healthy Wraps', name: 'Cheese Loaded Wrap', price: 140 },
  { id: 12, cat: 'Healthy Wraps', name: 'Panner Wrap', price: 160 },
  { id: 13, cat: 'Fries', name: 'Classic Fries', price: 90 },
  { id: 14, cat: 'Fries', name: 'Masala Fries', price: 100 },
  { id: 15, cat: 'Fries', name: 'Perri Fries', price: 120 },
  { id: 16, cat: 'Fries', name: 'Cheese Fries', price: 130 },
  { id: 17, cat: 'Pasta', name: 'White Sauce Pasta', price: 160 },
  { id: 18, cat: 'Pasta', name: 'Red Sauce Pasta', price: 170 },
  { id: 19, cat: 'Pasta', name: 'Mix Sauce Pasta', price: 180 },
  { id: 20, cat: 'Maggie', name: 'Masala Maggie', price: 60 },
  { id: 21, cat: 'Maggie', name: 'Vegetable Maggie', price: 70 },
  { id: 22, cat: 'Maggie', name: 'Cheese Maggie', price: 90 },
  { id: 23, cat: 'Maggie', name: 'Veg. Cheese Maggie', price: 100 },
  { id: 24, cat: 'Maggie', name: 'Chilli Panne4 Maggie', price: 120 },
  { id: 25, cat: 'Corns', name: 'Crispy Corns', price: 100 },
  { id: 26, cat: 'Corns', name: 'Masala Corns', price: 120 },
  { id: 27, cat: 'Corns', name: 'Peri Peri Corns', price: 140 },
  { id: 28, cat: 'Noodles', name: 'Veg. Noodles', price: 120 },
  { id: 29, cat: 'Noodles', name: 'Veg. Schezwan Noodles', price: 130 },
  { id: 30, cat: 'Noodles', name: 'Panner Noodles', price: 150 },
  { id: 31, cat: 'Rice', name: 'Veg. Fried Rice', price: 140 },
  { id: 32, cat: 'Rice', name: 'Schezwan Fries Rice', price: 160 },
  { id: 33, cat: 'Rice', name: 'Panner Fried Rice', price: 180 },
  { id: 34, cat: "Chilli's", name: 'Chilli Potato', price: 210 },
  { id: 35, cat: "Chilli's", name: 'Honney Potato', price: 220 },
  { id: 36, cat: "Chilli's", name: 'Chilli Panner', price: 230 },
  { id: 37, cat: "Chilli's", name: 'Chilli Mushroom', price: 240 },
  { id: 38, cat: 'Snacks', name: 'Nachos with Salsa', price: 140 },
  { id: 39, cat: 'Snacks', name: 'Veg. Spring Roll', price: 140 },
  { id: 40, cat: 'Snacks', name: 'Dahi Kabab', price: 140 },
  { id: 41, cat: 'Snacks', name: 'Allo Patties', price: 30 },
  { id: 42, cat: 'Snacks', name: 'Panner Patties', price: 35 },
  { id: 43, cat: 'Snacks', name: 'Cheese Loaded Allo Patties', price: 80 },
  { id: 44, cat: 'Snacks', name: 'Cheese Loaded Panner Patties', price: 90 },
  { id: 45, cat: 'Coffees', name: 'Cold Coffee', price: 90 },
  { id: 46, cat: 'Coffees', name: 'Cold Coffee (with Ice Cream)', price: 100 },
  { id: 47, cat: 'Coffees', name: 'Special Thick Coffee', price: 130 },
  { id: 48, cat: 'Shakes', name: 'Strawberry Shake', price: 140 },
  { id: 49, cat: 'Shakes', name: 'Butterscotch Shake', price: 140 },
  { id: 50, cat: 'Shakes', name: 'Blueberry Shake', price: 140 },
  { id: 51, cat: 'Shakes', name: 'Kitkat Shake', price: 150 },
  { id: 52, cat: 'Shakes', name: 'Oreo Shake', price: 150 },
  { id: 53, cat: 'Shakes', name: 'Brownie Shake', price: 160 },
  { id: 54, cat: 'Mojitos', name: 'Fresh Lime Soda', price: 70 },
  { id: 55, cat: 'Mojitos', name: 'Watermelon Soda', price: 80 }
];

app.get('/health', (_, res) => res.json({ ok: true }));
app.get('/api/menu', (_, res) => res.json(MENU));

function serializeOrder(order) {
  return order ? { ...order, items: JSON.parse(order.items) } : null;
}

app.post('/api/orders', (req, res) => {
  const { customer_name, customer_phone, table_no, items, total, payment_method = 'counter' } = req.body;
  if (!String(customer_name || '').trim() || !/^\d{10}$/.test(String(customer_phone || '')) || !Number.isInteger(Number(table_no)) || Number(table_no) < 1 || !Array.isArray(items) || !items.length || Number(total) < 0) {
    return res.status(400).json({ error: 'customer_name, customer_phone, table_no, items, and a valid total are required' });
  }
  const result = db.prepare(`INSERT INTO orders(customer_name, customer_phone, table_no, items, total, payment_method)
    VALUES (?, ?, ?, ?, ?, ?)`).run(String(customer_name).trim(), String(customer_phone), Number(table_no), JSON.stringify(items), Number(total), payment_method);
  const order = serializeOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid));
  ordersTotal.inc();
  console.log(JSON.stringify({ event: 'order_created', id: order.id, table_no: order.table_no }));
  return res.status(201).json(order);
});

app.get('/api/orders', (_, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY datetime(created_at) DESC, id DESC').all().map(serializeOrder);
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = serializeOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id));
  return order ? res.json(order) : res.sendStatus(404);
});

app.patch('/api/orders/:id/status', (req, res) => {
  if (req.get('x-admin-key') !== (process.env.ADMIN_KEY || 'dev-admin-key')) return res.sendStatus(401);
  const allowed = ['confirmed', 'received', 'preparing', 'ready', 'served'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status' });
  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  if (!result.changes) return res.sendStatus(404);
  const order = serializeOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id));
  console.log(JSON.stringify({ event: 'order_status_changed', id: order.id, status: order.status }));
  return res.json(order);
});

app.get('/metrics', async (_, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = { app, db };