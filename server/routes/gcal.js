import { Router } from 'express';
import db from '../db.js';
import { getAuthUrl, handleCallback, isAuthenticated, hasCredentials, syncWeekToGCal } from '../gcal-service.js';

const router = Router();

// Check GCal status
router.get('/status', (req, res) => {
  res.json({
    hasCredentials: hasCredentials(),
    isAuthenticated: isAuthenticated(),
  });
});

// Save Google OAuth credentials
router.put('/credentials', (req, res) => {
  const { client_id, client_secret, redirect_uri } = req.body;
  db.prepare(`
    INSERT INTO settings (key, value) VALUES ('gcal_credentials', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(JSON.stringify({ client_id, client_secret, redirect_uri: redirect_uri || 'http://localhost:3001/api/gcal/callback' }));
  res.json({ ok: true });
});

// Get OAuth URL
router.get('/auth-url', (req, res) => {
  const url = getAuthUrl();
  if (!url) return res.status(400).json({ error: 'No credentials configured. Set up Google OAuth first.' });
  res.json({ url });
});

// OAuth callback
router.get('/callback', async (req, res) => {
  try {
    await handleCallback(req.query.code);
    // Redirect back to the app
    res.redirect('/?gcal=connected');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync week to Google Calendar
router.post('/sync', async (req, res) => {
  try {
    const { weekKey, cells, emails } = req.body;
    const result = await syncWeekToGCal(weekKey, cells, null, emails);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
