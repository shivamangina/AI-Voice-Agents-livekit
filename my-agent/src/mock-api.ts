import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const port = 4000;

app.use(express.json());

let db: any;

async function initDb() {
   db = await open({ filename: './support.db', driver: sqlite3.Database });
   await db.exec(`CREATE TABLE IF NOT EXISTS orders (user TEXT, email TEXT, status TEXT, eta TEXT)`);
   await db.exec(`CREATE TABLE IF NOT EXISTS kyc (user TEXT, email TEXT, status TEXT, date TEXT)`);
   await db.exec(`CREATE TABLE IF NOT EXISTS payments (user TEXT, email TEXT, status TEXT, reason TEXT)`);
   await db.exec(`CREATE TABLE IF NOT EXISTS metrics (agent TEXT, user TEXT, query TEXT, response TEXT, ts INTEGER)`);
}

// DB init/seed endpoint for demo
app.post('/init-db', async (_req, res) => {
   await db.run(`DELETE FROM orders`);
   await db.run(`DELETE FROM kyc`);
   await db.run(`DELETE FROM payments`);
   await db.run(`DELETE FROM metrics`);
   await db.run(`INSERT INTO orders VALUES ('satya', 'satya@email.com', 'Shipped', '2025-07-01')`);
   await db.run(`INSERT INTO kyc VALUES ('satya', 'satya@email.com', 'Approved', '2025-06-20')`);
   await db.run(`INSERT INTO payments VALUES ('satya', 'satya@email.com', 'Failed', 'Insufficient funds')`);
   res.json({ status: 'ok', message: 'DB initialized and seeded' });
});

// Get order status by user or email
app.get('/order/:id', async (req, res) => {
   const id = req.params.id;
   const result = await db.get(`SELECT * FROM orders WHERE user = ? OR email = ?`, [id, id]);
   if (result) res.json(result);
   else res.status(404).json({ error: 'Order not found' });
});

// Get KYC status by user or email
app.get('/kyc/:id', async (req, res) => {
   const id = req.params.id;
   const result = await db.get(`SELECT * FROM kyc WHERE user = ? OR email = ?`, [id, id]);
   if (result) res.json(result);
   else res.status(404).json({ error: 'KYC not found' });
});

// Get payment status by user or email
app.get('/payment/:id', async (req, res) => {
   const id = req.params.id;
   const result = await db.get(`SELECT * FROM payments WHERE user = ? OR email = ?`, [id, id]);
   if (result) res.json(result);
   else res.status(404).json({ error: 'Payment not found' });
});

// Get metrics
app.get('/metrics', async (_req, res) => {
   const result = await db.all(`SELECT * FROM metrics`);
   res.json(result);
});

// Log a metric
app.post('/metrics', async (req, res) => {
   const { agent, user, query, response } = req.body;
   await db.run(`INSERT INTO metrics (agent, user, query, response, ts) VALUES (?, ?, ?, ?, ?)`, [agent, user, query, response, Date.now()]);
   res.json({ status: 'ok' });
});

initDb().then(() => {
   app.listen(port, () => {
      console.log(`Mock API server running at http://localhost:${port}`);
   });
}); 