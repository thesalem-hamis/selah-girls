import { addDoc, collection, getDocs, query, serverTimestamp, where } from "@firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase";

function FourPointStar({ className = "w-3 h-3" }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0L9.2 6.8H16L10.4 11L12.4 18L8 14L3.6 18L5.6 11L0 6.8H6.8L8 0Z" />
    </svg>
  );
}

function SignupForm({ className = "" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    setStatus("sending");
    setMessage("");

    try {
      // Check for duplicate
      const existingQuery = query(
        collection(db, "subscribers"),
        where("email", "==", trimmedEmail),
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        setStatus("success");
        setMessage("You're already on the list! 🤍");
        setEmail("");
        return;
      }

      // Save to Firestore first
      await addDoc(collection(db, "subscribers"), {
        email: trimmedEmail,
        tag: "selah-girl-society",
        status: "active",
        createdAt: serverTimestamp(),
        hasReceivedWelcomeEmail: false,
        hasReceivedDropEmail: false,
      });

      // Send welcome email via API
      try {
        const apiUrl = `/api/send-welcome-email`;
        console.log("Calling API endpoint:", apiUrl);
        
        const emailResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: trimmedEmail }),
        });

        if (emailResponse.ok) {
          const responseData = await emailResponse.json();
          console.log("Welcome email sent successfully:", responseData);
        } else {
          const errorText = await emailResponse.text();
          console.error("Failed to send welcome email:", errorText);
        }
      } catch (emailErr) {
        console.error("Welcome email failed (subscriber saved):", emailErr);
        // Don't show error to user since subscriber was saved
      }

      setEmail("");
      setStatus("success");
      setMessage("Welcome to the society! Check your inbox. ✨");
    } catch (error) {
      console.error("Signup failed:", error);
      setStatus("error");
      setMessage("Unable to register right now. Please try again later.");
    }
  };

  const isLoading = status === "sending";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <form onSubmit={handleSubmit} className={`signup-form ${className}`}>
      <div className="signup-input-wrap">
        <input
          type="email"
          name="EMAIL"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="signup-input"
          aria-label="Email address"
        />
        <span className="signup-input-star text-pink-hot" aria-hidden>
          <FourPointStar className="w-3.5 h-3.5" />
        </span>
      </div>
      <button type="submit" disabled={isLoading || isSuccess} className="signup-btn">
        <span aria-hidden>{isSuccess ? "YOU'RE IN!" : isLoading ? "JOINING..." : "JOIN THE SOCIETY"}</span>
        {!isSuccess && (
          <span className="signup-btn-star" aria-hidden>
            <FourPointStar className="w-3.5 h-3.5" />
          </span>
        )}
      </button>
      {isError && (
        <p className="signup-message signup-message--error" role="alert">
          {message || "Something went wrong. Please try again."}
        </p>
      )}
      {isSuccess && (
        <p className="signup-message signup-message--success" role="status">
          {message}
        </p>
      )}
    </form>
  );
}

export default function EmailSignup({ className }) {
  return <SignupForm className={className} />;
}

// Welcome Email API Route (pages/api/send-welcome-email.js or app/api/send-welcome-email/route.js)
export async function sendWelcomeEmail(email) {
  const welcomeEmailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Selah Girl Society</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          background-color: #faf8f5;
          font-family: 'Montserrat', sans-serif;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #fef9f3 0%, #fff5f5 100%);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #f8e8e8 0%, #f2d5d5 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        
        .header-star {
          display: inline-block;
          color: #e8a0a0;
          font-size: 24px;
          margin: 0 5px;
        }
        
        .header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 600;
          color: #8b5e5e;
          margin: 20px 0 10px;
          letter-spacing: 2px;
        }
        
        .header .subtitle {
          font-size: 14px;
          color: #b08585;
          font-style: italic;
          letter-spacing: 1px;
        }
        
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        
        .greeting {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #8b5e5e;
          font-style: italic;
          margin-bottom: 20px;
        }
        
        .message {
          font-size: 15px;
          line-height: 1.8;
          color: #6b5e5e;
          margin-bottom: 25px;
        }
        
        .founders {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: #8b5e5e;
          font-weight: 600;
          margin: 15px 0;
        }
        
        .meaning-box {
          background: linear-gradient(135deg, #fff0f0 0%, #ffe8e8 100%);
          border-left: 3px solid #d4a5a5;
          padding: 20px;
          margin: 25px 0;
          text-align: left;
          border-radius: 4px;
        }
        
        .meaning-word {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #8b5e5e;
          font-style: italic;
          font-weight: 600;
        }
        
        .meaning-definition {
          font-size: 14px;
          color: #6b5e5e;
          margin-top: 5px;
          font-style: italic;
        }
        
        .launch-announcement {
          background: white;
          border: 2px solid #f0d0d0;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
        }
        
        .launch-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #8b5e5e;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .tee-names {
          font-size: 16px;
          color: #6b5e5e;
          margin: 10px 0;
          font-style: italic;
        }
        
        .discount-box {
          background: #8b5e5e;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
        }
        
        .discount-code {
          font-size: 24px;
          font-weight: 600;
          letter-spacing: 2px;
          font-family: 'Cormorant Garamond', serif;
        }
        
        .stars-divider {
          margin: 20px 0;
          color: #d4a5a5;
          font-size: 12px;
          letter-spacing: 5px;
        }
        
        .perks {
          text-align: left;
          margin: 25px 0;
        }
        
        .perk-item {
          margin: 15px 0;
          font-size: 14px;
          color: #6b5e5e;
        }
        
        .perk-star {
          color: #d4a5a5;
          margin-right: 8px;
        }
        
        .footer {
          background: linear-gradient(135deg, #f8e8e8 0%, #f2d5d5 100%);
          padding: 30px;
          text-align: center;
        }
        
        .signature {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: #8b5e5e;
          font-style: italic;
          margin-bottom: 20px;
        }
        
        .ps-note {
          font-size: 13px;
          color: #b08585;
          font-style: italic;
          margin-top: 15px;
        }
        
        .heart {
          color: #d4a5a5;
          font-size: 16px;
        }
        
        .social-links {
          margin-top: 20px;
        }
        
        .social-link {
          display: inline-block;
          margin: 0 10px;
          color: #8b5e5e;
          text-decoration: none;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <span class="header-star">✦</span>
          <span class="header-star">✦</span>
          <span class="header-star">✦</span>
          <h1>SELAH GIRL SOCIETY</h1>
          <div class="subtitle">a space for the set-apart girl</div>
        </div>
        
        <div class="content">
          <div class="greeting">hey girl,</div>
          
          <div class="message">
            welcome — we're so glad you're here.
          </div>
          
          <div class="founders">
            my name is Penelope Louise & Peace
          </div>
          
          <div class="message">
            and we're the founders of SGS. Selah Girl Society is something I built for you. For the girl who is set apart, who is learning what it means to walk in her faith, and who deserves a space that reflects that.
          </div>
          
          <div class="meaning-box">
            <div class="meaning-word">Selah</div>
            <div class="meaning-definition">means pause — a moment to stop, breathe, and reflect.</div>
          </div>
          
          <div class="message">
            that's exactly what this community is. Whether it's through what you wear, what you read, or the people you do life with here, we want every touchpoint with Selah to feel like that: a breath, a reset, a reminder of who you are.
          </div>
          
          <div class="launch-announcement">
            <div class="launch-title">✦ our very first drop is coming soon ✦</div>
            <div class="message">
              our soft touch tees in two prints:
            </div>
            <div class="tee-names">
              'babe, I love Jesus'<br>
              and<br>
              'jesus loves you'
            </div>
            <div class="message">
              simple, wearable, made for the girl who wants her faith to be a part of her everyday — not just Sunday.
            </div>
          </div>
          
          <div class="discount-box">
            <div style="font-size: 14px; margin-bottom: 10px;">as a thank you for joining us from the beginning</div>
            <div style="font-size: 18px; margin-bottom: 5px;">Here's 5% Off Your First Order:</div>
            <div class="discount-code">✦ use code: WELCOME5 at checkout</div>
          </div>
          
          <div class="stars-divider">✦ ✦ ✦</div>
          
          <div class="perks">
            <div class="perk-item">
              <span class="perk-star">✦</span> early access to drops
            </div>
            <div class="perk-item">
              <span class="perk-star">✦</span> first look at new pieces
            </div>
            <div class="perk-item">
              <span class="perk-star">✦</span> community moments
            </div>
            <div class="perk-item">
              <span class="perk-star">✦</span> extras we're building just for this circle of girls
            </div>
          </div>
          
          <div class="message" style="margin-top: 30px; font-style: italic;">
            This is just the beginning. We're building something special here, and you're already a part of it.
          </div>
        </div>
        
        <div class="footer">
          <div class="signature">
            with love,<br>
            Penelope Louise & Peace
          </div>
          <div style="font-size: 13px; color: #8b5e5e;">
            Founders: selah girl society
          </div>
          <div class="ps-note">
            p.s. reply to this email anytime — I actually read them. <span class="heart">🤍</span>
          </div>
          
          <div class="social-links">
            <a href="#" class="social-link">instagram</a>
            <span style="color: #d4a5a5;">•</span>
            <a href="#" class="social-link">website</a>
            <span style="color: #d4a5a5;">•</span>
            <a href="#" class="social-link">shop</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return welcomeEmailHTML;
}
