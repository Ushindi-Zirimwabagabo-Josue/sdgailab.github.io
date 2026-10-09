// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.98.0';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:4321',
  'http://127.0.0.1:4321',
  'https://sdgailab.org',
  'https://www.sdgailab.org',
  'https://sdg-ai-lab.github.io',
];

function parseAllowedOrigins() {
  const fromEnv = (Deno.env.get('CONTACT_ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ALLOWED_ORIGINS;
}

function isOriginAllowed(origin) {
  if (!origin) return false;
  const allowed = parseAllowedOrigins();
  if (allowed.includes(origin)) return true;
  return origin.startsWith('https://sdg-ai-lab.github.io');
}

function resolveCorsOrigin(req) {
  const origin = req.headers.get('Origin');
  if (origin && isOriginAllowed(origin)) {
    return origin;
  }
  return null;
}

function corsHeadersFor(req) {
  const headers = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
  const allowedOrigin = resolveCorsOrigin(req);
  if (allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin;
  }
  return headers;
}

type ContactPayload = {
  name?: string;
  email?: string;
  organization?: string;
  request_type?: string;
  message?: string;
  source_path?: string;
  website?: string;
};

function jsonResponse(req, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeadersFor(req), 'Content-Type': 'application/json' },
  });
}

function rejectDisallowedOrigin(req) {
  const origin = req.headers.get('Origin');
  if (origin && !isOriginAllowed(origin)) {
    return jsonResponse(req, { error: 'Origin not allowed.' }, 403);
  }
  return null;
}



function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildEmailHtml(input: Required<Pick<ContactPayload, 'name' | 'email' | 'organization' | 'message'>> & Pick<ContactPayload, 'request_type' | 'source_path'>) {
  const requestType = clean(input.request_type) || 'Not specified';
  const sourcePath = clean(input.source_path) || 'Contact page';

  return `
    <h2>New SDG AI Lab website enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Organization:</strong> ${escapeHtml(input.organization)}</p>
    <p><strong>Request type:</strong> ${escapeHtml(requestType)}</p>
    <p><strong>Source:</strong> ${escapeHtml(sourcePath)}</p>
    <hr />
    <p><strong>Message</strong></p>
    <p>${escapeHtml(input.message).replaceAll('\n', '<br />')}</p>
  `;
}

Deno.serve(async (req) => {
  const originRejection = rejectDisallowedOrigin(req);
  if (originRejection) return originRejection;

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeadersFor(req) });
  if (req.method !== 'POST') return jsonResponse(req, { error: 'Method not allowed' }, 405);

  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(req, { error: 'Invalid JSON payload' }, 400);
  }

  if (clean(payload.website)) {
    return jsonResponse(req, { ok: true });
  }

  const name = clean(payload.name);
  const email = clean(payload.email);
  const organization = clean(payload.organization);
  const request_type = clean(payload.request_type);
  const message = clean(payload.message);
  const source_path = clean(payload.source_path);
  const user_agent = req.headers.get('user-agent') ?? '';

  if (!name || !email || !organization || !message) {
    return jsonResponse(req, { error: 'Name, email, organization and message are required.' }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse(req, { error: 'Please provide a valid email address.' }, 400);
  }

  if (message.length > 5000) {
    return jsonResponse(req, { error: 'Message is too long. Please keep it under 5000 characters.' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const emailWebhookUrl = Deno.env.get('CONTACT_EMAIL_WEBHOOK_URL');
  const emailWebhookSecret = Deno.env.get('CONTACT_EMAIL_WEBHOOK_SECRET') ?? '';
  const notificationTo = Deno.env.get('CONTACT_NOTIFICATION_TO')?.trim() ?? '';

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(req, { error: 'Contact service is not configured.' }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: submission, error: insertError } = await supabase
    .from('contact_submissions')
    .insert({ name, email, organization, request_type, message, source_path, user_agent })
    .select('id')
    .single();

  if (insertError) {
    return jsonResponse(req, { error: 'Could not save the request. Please try again.' }, 500);
  }

  if (!emailWebhookUrl || !notificationTo) {
    const missing = !emailWebhookUrl
      ? 'CONTACT_EMAIL_WEBHOOK_URL is not configured.'
      : 'CONTACT_NOTIFICATION_TO is not configured.';
    await supabase
      .from('contact_submissions')
      .update({ notification_error: missing })
      .eq('id', submission.id);

    return jsonResponse(req, {
      ok: true,
      notification_sent: false,
      warning: 'Submission saved, but email notification is not configured yet.',
    });
  }

  const emailResponse = await fetch(emailWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: emailWebhookSecret,
      to: notificationTo,
      reply_to: email,
      subject: `SDG AI Lab website enquiry: ${request_type || 'General enquiry'}`,
      html: buildEmailHtml({ name, email, organization, request_type, message, source_path }),
      text: [
        'New SDG AI Lab website enquiry',
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization}`,
        `Request type: ${request_type || 'Not specified'}`,
        `Source: ${source_path || 'Contact page'}`,
        '',
        message,
      ].join('\n'),
    }),
  });

  const emailBody = await emailResponse.text();

  if (!emailResponse.ok) {
    await supabase
      .from('contact_submissions')
      .update({ notification_error: emailBody.slice(0, 1000) })
      .eq('id', submission.id);

    return jsonResponse(req, {
      ok: true,
      notification_sent: false,
      warning: 'Submission saved, but email notification failed.',
    });
  }

  await supabase
    .from('contact_submissions')
    .update({ notification_sent: true, notification_error: null })
    .eq('id', submission.id);

  return jsonResponse(req, { ok: true, notification_sent: true });
});