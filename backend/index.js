const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DB_PATH = path.join(__dirname, 'db.json');
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());

// Helpers
function ensureUser(db, userId) {
  if (!db.users[userId]) {
    db.users[userId] = { confirmedCount: 0, token: Math.random().toString(36).slice(2, 10) };
    writeDB(db);
  }
  return db.users[userId];
}

// Seed admin (call once)
app.post('/api/seed', (req, res) => {
  const db = readDB();
  const { adminEmail, adminPassword, signalSupplier } = req.body || {};
  db.admin = { email: adminEmail || 'omodaratanemmanuel5@gmail.com', password: adminPassword || 'Omodara12' };
  if (signalSupplier) db.settings.signalSupplier = signalSupplier;
  writeDB(db);
  res.json({ ok: true, admin: db.admin, settings: db.settings });
});

// Admin settings get / set (no auth for demo)
app.get('/api/admin/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings);
});
app.post('/api/admin/settings', (req, res) => {
  const db = readDB();
  const { requiredShares, signalSupplier, redemptionText } = req.body;
  if (requiredShares !== undefined) db.settings.requiredShares = Number(requiredShares);
  if (signalSupplier !== undefined) db.settings.signalSupplier = signalSupplier;
  if (redemptionText !== undefined) db.settings.redemptionText = redemptionText;
  writeDB(db);
  res.json({ ok: true, settings: db.settings });
});

// Endpoint to simulate a share confirmation (called by suppliers or testers)
app.post('/api/confirm/:userId', (req, res) => {
  const userId = req.params.userId;
  const db = readDB();
  const user = ensureUser(db, userId);
  user.confirmedCount += 1;
  writeDB(db);
  res.json({ ok: true, user });
});

// Check eligibility and return share message for Signal when eligible
app.get('/api/check-eligible/:userId', (req, res) => {
  const userId = req.params.userId;
  const db = readDB();
  const user = ensureUser(db, userId);
  const settings = db.settings || {};
  const required = settings.requiredShares || 3;
  if (user.confirmedCount < required) {
    return res.json({ eligible: false, confirmedCount: user.confirmedCount, required });
  }
  // Eligible — build share message
  const shareMessage = `${settings.redemptionText || 'Hi — I want to claim my prize. Redeem token:'} ${user.token}\n\nSupplier: ${settings.signalSupplier || 'Please contact via Signal'}`;
  return res.json({ eligible: true, shareMessage, token: user.token });
});

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});
