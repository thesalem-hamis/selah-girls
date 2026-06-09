// emailService.js
// Sends welcome email via Resend directly from the browser.
// Use a RESTRICTED Resend key (sending only) — create one at:
// resend.com/api-keys → "Add API Key" → Permission: "Sending access" only

const FROM_EMAIL = "Selah Girl Society <hello@contact.selahgirls.com>";
const DISCOUNT_CODE = "SELAH5";
const DROP_DATE = "September 1, 2026";

function buildWelcomeEmail(email) {
  return `
    <html>
      <body style="font-family: system-ui, sans-serif; color: #111; line-height: 1.6; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="color: #E91E8C; font-size: 28px; margin-bottom: 4px;">Welcome to Selah Girl Society</h1>
        <p style="color: #888; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0;">You're officially on the list ✦</p>

        <p>Hey girl 👋</p>
        <p>You're now first in line for every drop, early access, and exclusive savings from <strong>Selah Girl Society</strong> — faith apparel made for daughters of the Most High.</p>

        <div style="background: #fff0f7; border-left: 3px solid #E91E8C; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px;">Use code <strong style="color: #E91E8C; font-size: 16px;">${DISCOUNT_CODE}</strong> at checkout for <strong>5% off</strong> your first order.</p>
        </div>

        <p>📅 Drop date: <strong>${DROP_DATE}</strong></p>
        <p>We'll send you the link the moment it goes live. Stay close.</p>

        <p style="margin-top: 2rem; color: #555;">With love,<br/>
        <em style="font-size: 18px; color: #E91E8C;">Selah Girl Society</em><br/>
        <span style="font-size: 12px; color: #999;">xoxo</span></p>

        <hr style="border: none; border-top: 1px solid #f0e0eb; margin: 32px 0;" />
        <p style="font-size: 11px; color: #bbb; text-align: center;">You received this because you signed up at selahgirls.com</p>
      </body>
    </html>
  `;
}

export async function sendWelcomeEmail(email) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  console.log("Resend API Key exists:", !!apiKey);
  
  if (!apiKey) {
    console.warn("VITE_RESEND_API_KEY not set — skipping welcome email.");
    return;
  }

  try {
    console.log("Attempting to send email to:", email);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to Selah Girl Society 🤍",
        html: buildWelcomeEmail(email),
      }),
    });

    console.log("Resend response status:", response.status);
    
    if (!response.ok) {
      const body = await response.text();
      console.error("Resend error body:", body);
      throw new Error(`Resend error: ${response.status} — ${body}`);
    }

    const data = await response.json();
    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Fetch error in sendWelcomeEmail:", error);
    throw error;
  }
}