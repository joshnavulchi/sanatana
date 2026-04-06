/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
// API route to receive contact form submissions.
export const dynamic = 'force-static';

async function sendWithSendGrid(contactEmail: string, subject: string, body: string, replyTo?: { email?: string; name?: string }) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) throw new Error('SENDGRID_API_KEY not configured');

  const payload: any = {
    personalizations: [{ to: [{ email: contactEmail }] }],
    from: { email: contactEmail },
    subject: subject,
    content: [{ type: 'text/plain', value: body }],
  };
  if (replyTo && replyTo.email) payload.reply_to = { email: replyTo.email, name: replyTo.name };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.status !== 202) {
    const txt = await res.text().catch(() => '');
    throw new Error(`SendGrid responded ${res.status}: ${txt}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const values = (body && body.values) || body || {};

    // Simple validation: require at least one non-empty field
    const hasAny = Object.values(values).some((v: any) => typeof v === 'string' ? v.trim().length > 0 : !!v);
    if (!hasAny) {
      return new Response(JSON.stringify({ error: 'empty' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    const name = String(values.name || values.fullname || 'Visitor');
    const fromEmail = String(values.email || '') || undefined;
    const subject = `Website contact from ${name}`;

    let bodyText = '';
    for (const k of Object.keys(values)) {
      bodyText += `${k}: ${String(values[k] || '')}\n`;
    }

    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@sanatanadharmam.in';

    if (process.env.SENDGRID_API_KEY) {
      await sendWithSendGrid(CONTACT_EMAIL, subject, bodyText, fromEmail ? { email: fromEmail, name } : undefined);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
    }

    // Fallback: log to server console in dev if no provider configured
    // (This keeps behaviour safe for static builds and local development.)
     
    console.log('Contact form submission (no provider configured):', { to: CONTACT_EMAIL, subject, body: bodyText, replyTo: fromEmail });
    return new Response(JSON.stringify({ ok: true, notice: 'no-provider' }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
     
    console.error('Contact API error:', err && err.message ? err.message : err);
    return new Response(JSON.stringify({ error: String(err && err.message ? err.message : 'server error') }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}

/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

