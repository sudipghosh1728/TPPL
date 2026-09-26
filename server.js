import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3001);
const DATA_DIR = path.join(__dirname, 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

app.use(express.json({ limit: '2mb' }));

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ENQUIRIES_FILE);
  } catch {
    await fs.writeFile(ENQUIRIES_FILE, '[]', 'utf8');
  }
}

async function readEnquiries() {
  await ensureDataFile();
  const raw = await fs.readFile(ENQUIRIES_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEnquiries(entries) {
  await ensureDataFile();
  await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

function buildEmailPayload(enquiry) {
  const fields = Object.entries(enquiry)
    .filter(([key]) => !['recipient', 'to'].includes(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return {
    from: process.env.SMTP_FROM || 'noreply@tppl.local',
    to: enquiry.recipient || enquiry.to || 'vinayak@tpplpune.com',
    subject: `Project enquiry: ${enquiry.service || 'General manufacturing enquiry'}${enquiry.company ? ` — ${enquiry.company}` : ''}`,
    text: fields,
  };
}

async function sendEmailIfConfigured(enquiry) {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) return;

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  const mail = buildEmailPayload(enquiry);
  await transport.sendMail(mail);
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'TPPL enquiry backend is running.' });
});

app.post('/api/enquiry', async (req, res) => {
  try {
    const body = req.body || {};
    const enquiry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      ...body,
    };

    const required = ['name', 'company', 'email', 'service'];
    const missing = required.filter((field) => !String(enquiry[field] || '').trim());
    if (missing.length) {
      return res.status(400).json({
        ok: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    const entries = await readEnquiries();
    entries.push(enquiry);
    await writeEnquiries(entries);

    try {
      await sendEmailIfConfigured(enquiry);
    } catch (mailError) {
      console.warn('Email delivery skipped:', mailError.message || mailError);
    }

    res.status(201).json({
      ok: true,
      message: 'Enquiry submitted successfully.',
      id: enquiry.id,
    });
  } catch (error) {
    console.error('Enquiry submission failed:', error);
    res.status(500).json({
      ok: false,
      message: 'Server error while processing enquiry.',
    });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`TPPL enquiry backend listening on http://127.0.0.1:${PORT}`);
});
