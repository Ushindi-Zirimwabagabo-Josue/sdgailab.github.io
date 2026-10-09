const CONTACT_WEBHOOK_SECRET = 'replace-with-a-long-random-secret';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');

    if (payload.secret !== CONTACT_WEBHOOK_SECRET) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
    }

    const to = payload.to || 'josueuzj9@gmail.com';
    const subject = payload.subject || 'SDG AI Lab website enquiry';
    const htmlBody = payload.html || '';
    const body = payload.text || 'New SDG AI Lab website enquiry.';
    const replyTo = payload.reply_to || undefined;

    MailApp.sendEmail({
      to,
      subject,
      body,
      htmlBody,
      replyTo,
      name: 'SDG AI Lab website',
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) }, 500);
  }
}

function jsonResponse(data, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify({ ...data, statusCode: statusCode || 200 }))
    .setMimeType(ContentService.MimeType.JSON);
}