import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "@firebase/firestore";
import { useState } from "react";

import { db } from "../../firebase";
import "./hero.css";
import silverHeart from "/heart1.png";
import logo from "/logo.png";
import silverStar from "/star.png";

async function subscribeEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  // Check for duplicate
  const existingQuery = query(
    collection(db, "subscribers"),
    where("email", "==", normalizedEmail),
  );
  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) {
    return { ok: true, existing: true };
  }

  // Save to Firestore
  await addDoc(collection(db, "subscribers"), {
    email: normalizedEmail,
    tag: "selah-girl-society",
    status: "active",
    createdAt: serverTimestamp(),
    hasReceivedWelcomeEmail: false,
    hasReceivedDropEmail: false,
  });

  // Send welcome email via our secure API endpoint
  try {
    const apiUrl = `${window.location.origin}/api/send-welcome-email`;
    console.log("Calling API endpoint from Hero:", apiUrl);
    const emailResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    if (emailResponse.ok) {
      console.log("Welcome email sent successfully from Hero");
    } else {
      const errorData = await emailResponse.json();
      console.error("Failed to send welcome email from Hero:", errorData);
    }
  } catch (emailErr) {
    // Email failure doesn't block the signup — subscriber is already saved
    console.error("Welcome email failed (subscriber saved):", emailErr);
  }

  return { ok: true };
}

function StarIcon({ size = 16, color = "#E91E8C", style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
    >
      <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Instagram"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="18" cy="6" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const result = await subscribeEmail(email);
      setStatus("success");
      setMessage(
        result.existing
          ? "You're already on the list! 🤍"
          : "You're in! Check your inbox. ✨",
      );
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <section className="selah-hero-viewport">
      <nav className="selah-nav">
        <div className="selah-max-w">
          <div className="selah-nav-inner">
            <a href="/" aria-label="Selah Girls Society home">
              <img
                src={logo}
                alt="Selah Girls Society"
                className="selah-logo"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on Instagram"
              className="selah-nav-ig"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </nav>

      <div className="selah-content-outer">
        <div className="selah-max-w">
          <div className="selah-content-inner">
            <div className="selah-grid">
              {/* Left */}
              <div className="selah-left-content">
                <p className="selah-coming-soon">coming soon</p>

                <h1 className="selah-main-title">
                  <span className="block-line">For The</span>
                  <span className="highlight-pink">Daughters</span>
                  <span className="block-line">Of The</span>
                  <span className="block-line">Most High</span>
                </h1>

                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <p className="selah-sub-text">Exclusive first drop</p>
                  <p className="selah-sub-text">Join the list for early access + 5% Off</p>
                </div>

                <div style={{ marginTop: "30px", marginBottom: "-22px" }}>
                  <StarIcon size={9} color="#E91E8C" style={{ opacity: 0.7 }} />
                </div>

                <form onSubmit={handleSubmit} className="selah-form-group" noValidate>
                  <div className="selah-input-wrapper">
                    <input
                      type="email"
                      className="selah-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status !== "idle") setStatus("idle");
                      }}
                      disabled={status === "loading" || status === "success"}
                      aria-label="Email address"
                    />
                    <button
                      type="submit"
                      className="selah-input-star-btn"
                      disabled={status === "loading" || status === "success"}
                      aria-label="Submit"
                    >
                      <StarIcon size={15} color="#E91E8C" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="selah-submit-btn"
                    disabled={status === "loading" || status === "success"}
                  >
                    <span>
                      {status === "loading"
                        ? "Joining..."
                        : status === "success"
                          ? "You're in ✨"
                          : "Join the Society"}
                    </span>
                    <div className="selah-btn-star">
                      <StarIcon size={13} color="rgba(255,255,255,0.9)" />
                    </div>
                  </button>

                  {message && (
                    <p
                      style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        color: status === "success" ? "var(--color-pink)" : "var(--color-gray-700)",
                        fontFamily: "var(--font-josefin)",
                        textAlign: "center",
                      }}
                    >
                      {message}
                    </p>
                  )}
                </form>
              </div>

              {/* Right - desktop only */}
              <div className="selah-right-assets">
                <img src={silverStar} alt="Chrome Star" className="chrome-star-graphic" />
                <img src={silverHeart} alt="Chrome Heart" className="chrome-heart-graphic" />
                <img src={silverHeart} alt="" aria-hidden="true" className="chrome-heart-small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}