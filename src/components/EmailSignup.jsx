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

      // Save to Firestore
      await addDoc(collection(db, "subscribers"), {
        email: trimmedEmail,
        tag: "selah-girl-society",
        status: "active",
        createdAt: serverTimestamp(),
        hasReceivedWelcomeEmail: false,
        hasReceivedDropEmail: false,
      });

      // Send welcome email via our secure API endpoint
      try {
        const apiUrl = `${window.location.origin}/api/send-welcome-email`;
        console.log("Calling API endpoint:", apiUrl);
        const emailResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: trimmedEmail }),
        });

        if (emailResponse.ok) {
          console.log("Welcome email sent successfully");
        } else {
          // Only try to parse JSON if response has content
          try {
            const errorData = await emailResponse.json();
            console.error("Failed to send welcome email:", errorData);
          } catch (parseErr) {
            console.error("Failed to send welcome email, status:", emailResponse.status);
          }
        }
      } catch (emailErr) {
        console.error("Welcome email failed (subscriber saved):", emailErr);
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