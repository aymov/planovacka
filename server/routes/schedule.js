import { Router } from 'express';
import db from '../db.js';

const router = Router();

// SSE clients per weekKey
const sseClients = new Map(); // weekKey -> Set<res>

function notifyClients(weekKey, senderId) {
  const clients = sseClients.get(weekKey);
  if (!clients) return;
  const row = db.prepare('SELECT data, updated_at FROM schedules WHERE week_key = ?').get(weekKey);
  const payload = JSON.stringify({
    data: row ? JSON.parse(row.data) : {},
    updated_at: row ? row.updated_at : null,
  });
  for (const client of clients) {
    if (client.__senderId === senderId) continue; // don't echo back to sender
    client.write('data: ' + payload + '\n\n');
  }
}

// SSE endpoint - subscribe to live updates for a week
router.get('/live/:weekKey', (req, res) => {
  const weekKey = req.params.weekKey;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('\n');

  // Tag this connection with senderId from query
  res.__senderId = req.query.sid || null;

  if (!sseClients.has(weekKey)) sseClients.set(weekKey, new Set());
  sseClients.get(weekKey).add(res);

  req.on('close', () => {
    const s = sseClients.get(weekKey);
    if (s) { s.delete(res); if (s.size === 0) sseClients.delete(weekKey); }
  });
});

// Get schedule for a week
router.get('/:weekKey', (req, res) => {
  const row = db.prepare('SELECT data, updated_at FROM schedules WHERE week_key = ?').get(req.params.weekKey);
  res.json({ data: row ? JSON.parse(row.data) : {}, updated_at: row ? row.updated_at : null });
});

// Save schedule for a week
router.put('/:weekKey', (req, res) => {
  const { data, senderId } = req.body;
  db.prepare(`
    INSERT INTO schedules (week_key, data, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(week_key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
  `).run(req.params.weekKey, JSON.stringify(data));
  const row = db.prepare('SELECT updated_at FROM schedules WHERE week_key = ?').get(req.params.weekKey);
  // Notify other connected clients
  notifyClients(req.params.weekKey, senderId);
  res.json({ ok: true, updated_at: row ? row.updated_at : null });
});

// Get all employees
router.get('/meta/employees', (req, res) => {
  const rows = db.prepare('SELECT name, role FROM employees ORDER BY sort_order').all();
  res.json(rows);
});

// Update employees
router.put('/meta/employees', (req, res) => {
  const { employees } = req.body;
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM employees').run();
    const ins = db.prepare('INSERT INTO employees (name, role, sort_order) VALUES (?, ?, ?)');
    employees.forEach((e, i) => ins.run(e.name || e.n, e.role || e.r, i));
  });
  tx();
  res.json({ ok: true });
});

// Settings
router.get('/meta/settings/:key', (req, res) => {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(req.params.key);
  res.json({ value: row ? JSON.parse(row.value) : null });
});

router.put('/meta/settings/:key', (req, res) => {
  db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(req.params.key, JSON.stringify(req.body.value));
  res.json({ ok: true });
});

export default router;
