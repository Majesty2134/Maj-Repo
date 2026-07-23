// ============================================
//   LARRY B — PROMO CODE VALIDATION (server-side)
//   netlify/functions/check-promo.js
// ============================================
//
// This runs on Netlify's servers, NOT in the browser.
// The valid code is never sent to the client, so it can't
// be found via view-source or dev tools.
//
// All promo settings come from Netlify Environment Variables,
// so you can change the code / discount / dates entirely from
// the Netlify dashboard — no code edits, no redeploy needed.
//
// Set these in: Site settings -> Environment variables
//   PROMO_CODE          e.g. LARRYB10
//   PROMO_DISCOUNT      e.g. 0.10   (10% off)
//   PROMO_START_DATE    e.g. 2026-07-01
//   PROMO_DURATION_DAYS e.g. 7

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let code;
  try {
    const parsed = JSON.parse(event.body);
    code = parsed.code;
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  const CODE         = process.env.PROMO_CODE || '';
  const DISCOUNT      = parseFloat(process.env.PROMO_DISCOUNT || '0');
  const START_DATE     = process.env.PROMO_START_DATE || '';
  const DURATION_DAYS  = parseInt(process.env.PROMO_DURATION_DAYS || '7', 10);

  // If no code has been configured yet, always return invalid
  if (!CODE || !START_DATE) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valid: false, discount: 0 })
    };
  }

  const startDate  = new Date(START_DATE + 'T00:00:00Z');
  const expiryDate = new Date(startDate.getTime() + DURATION_DAYS * 24 * 60 * 60 * 1000);
  const now        = new Date();

  const isWithinWindow = now >= startDate && now < expiryDate;
  const normalized      = (code || '').trim().toUpperCase();
  const matchesCode     = normalized === CODE.trim().toUpperCase();

  const valid = isWithinWindow && matchesCode;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      valid,
      discount: valid ? DISCOUNT : 0
    })
  };
};
