# Gmail notifications for the contact form

This temporary setup uses Google Apps Script to send Gmail notifications while the website still stores all submissions in Supabase.

## 1. Create the Google Apps Script

1. Go to https://script.google.com/
2. Click **New project**.
3. Replace the default code with the content of `docs/contact-form/gmail-apps-script.js`.
4. Change this value to a long random secret you create:

```js
const CONTACT_WEBHOOK_SECRET = 'replace-with-a-long-random-secret';
```

Keep the same secret for the Supabase step below.

## 2. Deploy the script as a web app

1. Click **Deploy** ? **New deployment**.
2. Select type: **Web app**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**.
5. Click **Deploy**.
6. Approve the Gmail permission prompts.
7. Copy the generated **Web app URL**.

## 3. Set Supabase Edge Function secrets

From the project folder:

```bash
supabase secrets set CONTACT_EMAIL_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
supabase secrets set CONTACT_EMAIL_WEBHOOK_SECRET="replace-with-the-same-long-random-secret"
supabase secrets set CONTACT_NOTIFICATION_TO="josueuzj9@gmail.com"
```

Then deploy/redeploy the Edge Function:

```bash
supabase functions deploy contact-submit
```

## 4. Test

1. Submit the website contact form.
2. Confirm a row appears in `contact_submissions`.
3. Confirm the email arrives at `josueuzj9@gmail.com`.
4. If no email arrives, inspect `notification_error` in `contact_submissions`.

## Production note

This is acceptable for short-term testing, but for production use an approved institutional sender/workflow where possible.