const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {setGlobalOptions} = require("firebase-functions");
const logger = require("firebase-functions/logger");
const {Resend} = require("resend");
const {updateDoc, doc} = require("firebase/firestore");
const {getFirestore} = require("firebase-admin/firestore");
const {initializeApp} = require("firebase-admin/app");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

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

setGlobalOptions({maxInstances: 10});

// Trigger when a new subscriber is created in Firestore
exports.sendWelcomeEmail = onDocumentCreated("subscribers/{subscriberId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No data associated with the event");
    return;
  }

  const subscriber = snapshot.data();
  const email = subscriber.email;
  const subscriberRef = doc(db, "subscribers", event.params.subscriberId);

  if (!email) {
    logger.error("No email found in subscriber data");
    return;
  }

  try {
    logger.info(`Attempting to send welcome email to: ${email}`);

    const {data, error} = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Selah Girl Society 🤍",
      html: buildWelcomeEmail(email),
    });

    if (error) {
      logger.error("Failed to send email:", error);
      return;
    }

    logger.info(`Email sent successfully to ${email}:`, data);

    // Update Firestore to mark that welcome email was sent
    await updateDoc(subscriberRef, {
      hasReceivedWelcomeEmail: true,
      welcomeEmailSentAt: new Date(),
    });
  } catch (error) {
    logger.error("Error in sendWelcomeEmail function:", error);
  }
});
