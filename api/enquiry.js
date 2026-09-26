import fs from 'node:fs/promises';
import path from 'node:path';

export const config = {
  runtime: 'nodejs',
};

function buildId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function readEntries() {
  const dataDir = path.join(process.cwd(), 'data');
  const dataFile = path.join(dataDir, 'enquiries.json');

  await fs.mkdir(dataDir, { recursive: true });

  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEntries(entries) {
  const dataDir = path.join(process.cwd(), 'data');
  const dataFile = path.join(dataDir, 'enquiries.json');

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(entries, null, 2), 'utf8');
}

async function sendMailIfConfigured(enquiry) {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) return;

  const nodemailer = (await import('nodemailer')).default;
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

  await transport.sendMail({
    from: process.env.SMTP_FROM || 'noreply@tppl.local',
    to: enquiry.recipient || enquiry.email || 'vinayak@tpplpune.com',
    subject: `Project enquiry: ${enquiry.service || 'General manufacturing enquiry'}${enquiry.company ? ` — ${enquiry.company}` : ''}`,
    text: Object.entries(enquiry)
      .filter(([key]) => !['recipient', 'to'].includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n'),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const required = ['name', 'company', 'email', 'service'];
    const missing = required.filter((field) => !String(body[field] || '').trim());

    if (missing.length) {
      return res.status(400).json({
        ok: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    const enquiry = {
      id: buildId(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    const entries = await readEntries();
    entries.push(enquiry);
    await writeEntries(entries);

    try {
      await sendMailIfConfigured(enquiry);
    } catch (mailError) {
      console.warn('SMTP delivery skipped:', mailError?.message || mailError);
    }

    return res.status(201).json({
      ok: true,
      message: 'Enquiry submitted successfully.',
      id: enquiry.id,
    });
  } catch (error) {
    console.error('Enquiry submission failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'Server error while processing enquiry.',
    });
  }
}
