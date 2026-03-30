import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get schedule for a week
router.get('/:weekKey', (req, res) => {
  const row = db.prepare('SELECT data FROM schedules WHERE week_key = ?').get(req.params.weekKey);
  res.json({ data: row ? JSON.parse(row.data) : {} });
});

// Save schedule for a week
router.put('/:weekKey', (req, res) => {
  const { data } = req.body;
  db.prepare(`
    INSERT INTO schedules (week_key, data, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(week_key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
  `).run(req.params.weekKey, JSON.stringify(data));
  res.json({ ok: true });
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
