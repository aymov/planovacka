import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'planovacka.db'));

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS schedules (
    week_key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed employees if table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM employees').get();
if (count.c === 0) {
  const insert = db.prepare('INSERT INTO employees (name, role, sort_order) VALUES (?, ?, ?)');
  const emps = [
    ["Adéla","Copywriters / Ideamakers"],["Andrea","Copywriters / Ideamakers"],["Anet","Copywriters / Ideamakers"],
    ["Bára","Copywriters / Ideamakers"],["Daja","Copywriters / Ideamakers"],["Evža","Copywriters / Ideamakers"],
    ["Ivča","Copywriters / Ideamakers"],["Jáchym","Copywriters / Ideamakers"],["Judi","Copywriters / Ideamakers"],
    ["Lenka","Copywriters / Ideamakers"],["Marek","Copywriters / Ideamakers"],["Matej","Copywriters / Ideamakers"],
    ["Michal","Copywriters / Ideamakers"],["Petr","Copywriters / Ideamakers"],["Verča","Copywriters / Ideamakers"],
    ["Vláďa","Copywriters / Ideamakers"],["Vojta M.","Copywriters / Ideamakers"],
    ["André","Art Department"],["Alex","Art Department"],["Daniel","Art Department"],
    ["Dominika","Art Department"],["Filip","Art Department"],["Filip M.","Art Department"],
    ["Fína","Art Department"],["Gabi","Art Department"],["Gandalf","Art Department"],
    ["Gesu","Art Department"],["Kirill","Art Department"],["Leandro","Art Department"],
    ["Lucka","Art Department"],["Lukáš Ch","Art Department"],["Majo","Art Department"],
    ["Michal Č","Art Department"],["Roman P.","Art Department"],["Ženja","Art Department"],
    ["Roman","Strategy"],["David","Strategy"],["Kristýna","Strategy"],["Míša","Strategy"],
  ];
  const tx = db.transaction(() => {
    emps.forEach(([name, role], i) => insert.run(name, role, i));
  });
  tx();
}

export default db;
