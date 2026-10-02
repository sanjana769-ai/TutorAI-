import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed.");
    }

    setMessage(
      `Account created successfully! Your Student ID is ${data.student.id}. Please save it for login.`
    );

    setName("");
    setEmail("");
    setPassword("");

  } catch (error) {
    setMessage(error.message || "Could not connect to the server.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="diary-onboarding-page signup-diary-page">
      {/* DIARY */}
      <main className="onboarding-diary">

        {/* LEFT PAGE */}
        <section className="onboarding-page-sheet left-sheet">
          <div className="left-content">
            <span className="small-script">A new chapter begins...</span>

            <h1>
              Your
              <br />
              learning
              <br />
              <span>journey.</span>
            </h1>

            <div className="gold-line"></div>

            <p>
              Every great idea starts with curiosity.
              <br />
              Let's make this journey yours.
            </p>

            <p className="soft-note">
              One concept at a time. One step closer.
            </p>
          </div>

          <div className="left-quote">
            <span>✦</span>
            <p>“The beautiful thing about learning is that nobody can take it away from you.”</p>
            <small>— B.B. King</small>
          </div>

          <span className="sheet-number">01</span>
        </section>

        {/* BINDER */}
        <div className="onboarding-binding">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index}></span>
          ))}
        </div>

        {/* RIGHT PAGE */}
        <section className="onboarding-page-sheet right-sheet">
          <header className="right-header">
            <span className="step-label">YOUR FIRST PAGE</span>
            <span className="mini-brand">TUTORAI JOURNAL</span>
          </header>

          <div className="onboarding-step-content signup-content">
            <span className="form-eyebrow">BEGIN YOUR JOURNEY</span>

            <h2>
              Create your
              <br />
              <span>account.</span>
            </h2>

            <p className="step-description">
              A little about you, so we can make learning personal.
            </p>

            <form className="signup-form" onSubmit={handleSubmit}>
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="signup-password">Create Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />

                <button
                  type="submit"
                  className="signup-submit"
                  disabled={isSubmitting}
                    >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                  <span>→</span>
                  </button>
            </form>

            {message && <p className="signup-message">{message}</p>}

            <p className="signup-login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>

          <span className="right-sheet-number">02</span>
        </section>

        {/* LEATHER COVER */}
        <div className="onboarding-leather"></div>
      </main>

      <p className="desk-message">
        A new chapter of learning begins here. <span>✦</span>
      </p>
    </div>
  );
}

export default Signup;