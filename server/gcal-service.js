import { google } from 'googleapis';
import db from './db.js';

function getCredentials() {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'gcal_credentials'").get();
  return row ? JSON.parse(row.value) : null;
}

function getTokens() {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'gcal_tokens'").get();
  return row ? JSON.parse(row.value) : null;
}

function saveTokens(tokens) {
  db.prepare(`
    INSERT INTO settings (key, value) VALUES ('gcal_tokens', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(JSON.stringify(tokens));
}

export function getOAuth2Client() {
  const creds = getCredentials();
  if (!creds) return null;

  const oauth2 = new google.auth.OAuth2(
    creds.client_id,
    creds.client_secret,
    creds.redirect_uri || 'http://localhost:3001/api/gcal/callback'
  );

  const tokens = getTokens();
  if (tokens) {
    oauth2.setCredentials(tokens);
    oauth2.on('tokens', (newTokens) => {
      const merged = { ...tokens, ...newTokens };
      saveTokens(merged);
    });
  }

  return oauth2;
}

export function getAuthUrl() {
  const oauth2 = getOAuth2Client();
  if (!oauth2) return null;

  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
}

export async function handleCallback(code) {
  const oauth2 = getOAuth2Client();
  const { tokens } = await oauth2.getToken(code);
  saveTokens(tokens);
  return tokens;
}

export function isAuthenticated() {
  return !!getTokens();
}

export function hasCredentials() {
  return !!getCredentials();
}

const SLOT_TIMES = [
  { sh: 9, sm: 30, eh: 12, em: 0 },
  { sh: 13, sm: 0, eh: 15, em: 0 },
  { sh: 15, sm: 0, eh: 18, em: 0 },
];

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

export async function syncWeekToGCal(weekKey, cells, employees, emails) {
  const oauth2 = getOAuth2Client();
  if (!oauth2 || !getTokens()) throw new Error('Not authenticated with Google');

  const calendar = google.calendar({ version: 'v3', auth: oauth2 });

  // Parse week start date from weekKey (YYYY-MM-DD format)
  const [year, month, day] = weekKey.split('-').map(Number);
  const weekStart = new Date(year, month - 1, day);

  const events = [];

  for (const [cellKey, cellData] of Object.entries(cells)) {
    const parts = cellKey.split('|');
    if (parts[0] !== weekKey) continue;

    const empName = parts[1];
    const dayIdx = parseInt(parts[2]);
    const slotIdx = parseInt(parts[3]);

    const items = Array.isArray(cellData) ? cellData : [cellData];
    if (!items.length) continue;

    // Skip vacation markers
    if (items[0].cl === '__h') continue;

    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIdx);

    const st = SLOT_TIMES[slotIdx];
    const dateStr = date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
    const startTime = dateStr + 'T' + pad2(st.sh) + ':' + pad2(st.sm) + ':00';
    const endTime = dateStr + 'T' + pad2(st.eh) + ':' + pad2(st.em) + ':00';

    const summary = items.map(i => i.tk).join(' / ');
    const description = items.map(i => `${i.cl}: ${i.tk}`).join('\n');

    // Deterministic event ID for idempotent upserts
    const eventId = ('planovacka' + cellKey).replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 64);

    const event = {
      summary,
      description,
      start: { dateTime: startTime, timeZone: 'Europe/Prague' },
      end: { dateTime: endTime, timeZone: 'Europe/Prague' },
    };

    // Add employee email as attendee if available
    const empEmail = emails?.[empName];
    if (empEmail) {
      event.attendees = [{ email: empEmail }];
    }

    events.push({ eventId, event });
  }

  // Process events
  let created = 0, updated = 0, errors = 0;

  for (const { eventId, event } of events) {
    try {
      // Try to update existing event
      await calendar.events.update({
        calendarId: 'primary',
        eventId,
        requestBody: event,
        sendUpdates: 'none',
      });
      updated++;
    } catch (err) {
      if (err.code === 404) {
        // Create new event
        try {
          await calendar.events.insert({
            calendarId: 'primary',
            requestBody: { ...event, id: eventId },
            sendUpdates: 'none',
          });
          created++;
        } catch (insertErr) {
          console.error('Failed to create event:', eventId, insertErr.message);
          errors++;
        }
      } else {
        console.error('Failed to update event:', eventId, err.message);
        errors++;
      }
    }
  }

  return { created, updated, errors, total: events.length };
}
