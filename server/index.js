import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import scheduleRouter from './routes/schedule.js';
import gcalRouter from './routes/gcal.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/schedule', scheduleRouter);
app.use('/api/gcal', gcalRouter);
app.get('/api/health', (req, res) => res.json({ ok: true }));

// In production, serve the built frontend
const clientDist = join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(join(clientDist, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Planovacka server running on port ${PORT}`);
});
