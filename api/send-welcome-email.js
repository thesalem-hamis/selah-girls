import { Resend } from 'resend';

const resend = new Resend(process.env.VITE_RESEND_API_KEY);
const FROM_EMAIL = "Selah Girl Society <hello@contact.selahgirls.com>";
const DROP_DATE = "July 1st, 2026";

function buildWelcomeEmail(email) {
  return `
    <html>
      <body style="font-family: system-ui, sans-serif; color: #111; line-height: 1.6; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
        <h1 style="color: #E91E8C; font-size: 28px; margin-bottom: 4px;">Welcome to Selah Girl Society</h1>
        <p style="color: #888; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0;">You're officially on the list ✦</p>
        <p>Hey Girl,</p>
        <p>Welcome, We're so glad you're here.<br>My name is Penelope Louise & Peace and we’re the founders of SGS, Selah Girl Society is something I built for you. for the girl who is set apart, who is learning what it means to walk in her faith, and who deserves a space that reflects that.</p>
        <p>Selah means pause a moment to stop, breathe, and reflect. That's exactly what this community is. Whether it's through what you wear, what you read, or the people you do life with here, we want every touchpoint with Selah to feel like that: a breath, a reset, a reminder of who you are.</p>
        <p>We're launching our very first drop soon our soft touch tees in two prints: 'babe, I love Jesus' and 'jesus loves you'. simple, wearable, made for the girl who wants her faith to be a part of her everyday not just Sunday.</p>
        <div style="background: #fff0f7; border-left: 3px solid #E91E8C; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px;">As a thank you for joining us from the beginning, Here’s 5% Off On Your First Order:</p>
          <p style="margin: 8px 0 0 0; font-size: 16px;">✦ use code: <strong style="color: #E91E8C; font-size: 18px;">WELCOME5</strong> at checkout</p>
        </div>
        <p>This is just the beginning. As a subscriber, you'll get early access to drops, first look at new pieces, community moments, and extras we're building just for this circle of girls.</p>
        <p>We’re building something special here, and you're already a part of it.</p>
        <p style="margin-top: 2rem; color: #555;">with love,<br/>
        <em style="font-size: 18px; color: #E91E8C;">Penelope Louise & Peace</em><br/>
        <span style="font-size: 14px; color: #999;">Founders Of Selah Girl Society [S.G.S]</span></p>
        <p style="font-size: 14px; color: #666; margin-top: 32px; border-top: 1px solid #f0e0eb; padding-top: 24px;">p.s. reply to this email anytime — I actually read them. 🤍</p>
        <hr style="border: none; border-top: 1px solid #f0e0eb; margin: 32px 0;" />
        <p style="font-size: 11px; color: #bbb; text-align: center;">You received this because you signed up at selahgirls.com</p>
      </body>
    </html>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    console.log('Sending welcome email to:', email);
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Selah Girl Society 🤍",
      html: buildWelcomeEmail(email),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Email sent successfully:', data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}