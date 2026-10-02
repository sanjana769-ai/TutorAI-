import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [diaryOpened, setDiaryOpened] = useState(false);
  const [diaryOpening, setDiaryOpening] = useState(false);

  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [loggedInStudent, setLoggedInStudent] = useState(null);

  // =========================================
  // OPEN DIARY
  // =========================================

  function openDiary() {
    if (diaryOpened || diaryOpening) return;

    setDiaryOpening(true);

    setTimeout(() => {
      setDiaryOpened(true);
      setDiaryOpening(false);
    }, 1250);
  }

  // =========================================
  // LOGIN
  // =========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!studentId.trim() || !email.trim() || !password.trim()) {
      setError("Please enter your Student ID, email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid Student ID or password.");
        return;
      }

      console.log("Login successful:", data.student);

      localStorage.setItem("studentId", data.student.id);

      // Existing V1 avatar flow
      if (data.student.profile?.avatar) {
  if (data.student.onboardingCompleted) {
    navigate("/home");
  } else {
    navigate("/onboarding");
  }
} else {
  setLoggedInStudent(data.student);
  setShowAvatarSelection(true);
}
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to Syntra AI server.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // SAVE STUDENT AVATAR
  // =========================================

  async function handleAvatarSelect(avatar) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:3000/api/student/${loggedInStudent.id}/avatar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            avatar,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Could not save your avatar.");
        return;
      }

      console.log("Avatar saved:", data.student);

      setShowAvatarSelection(false);

      navigate("/onboarding");
    } catch (error) {
      console.error("Avatar selection error:", error);
      setError("Unable to save your avatar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="diary-login-page">

      {/* =========================================
          AMBIENT BACKGROUND
      ========================================= */}

      <div className="cinematic-glow glow-one"></div>
      <div className="cinematic-glow glow-two"></div>
      <div className="cinematic-glow glow-three"></div>

      <div className="floating-dust dust-one"></div>
      <div className="floating-dust dust-two"></div>
      <div className="floating-dust dust-three"></div>
      <div className="floating-dust dust-four"></div>

      {/* =========================================
          CLOSED DIARY
      ========================================= */}

      {!diaryOpened && (
        <section
          className={`closed-diary ${
            diaryOpening ? "closed-diary-opening" : ""
          }`}
        >

          <div className="closed-diary-shadow"></div>

          <div className="closed-diary-cover">

            <div className="cover-inner-glow"></div>

            <div className="cover-corner corner-one"></div>
            <div className="cover-corner corner-two"></div>
            <div className="cover-corner corner-three"></div>
            <div className="cover-corner corner-four"></div>

            <div className="cover-content">

              <div className="cover-symbol">
                ✦
              </div>

              <span className="cover-small-text">
                YOUR LEARNING JOURNEY
              </span>

              <h1>
                Syntra
                <span>AI</span>
              </h1>

              <div className="cover-line"></div>

              <p>
                Learn with curiosity.
                <br />
                Grow with confidence.
              </p>

              <button
                type="button"
                className="open-diary-button"
                onClick={openDiary}
                disabled={diaryOpening}
              >
                <span>
                  {diaryOpening ? "Opening..." : "Open Tutor"}
                </span>

                <span className="open-arrow">
                  →
                </span>
              </button>

            </div>

            <div className="cover-bottom">
              <span>01</span>
              <span>BEGIN</span>
            </div>

          </div>

          <div className="closed-diary-page-edge"></div>

        </section>
      )}

      {/* =========================================
          OPENING DIARY
      ========================================= */}

      {diaryOpening && (
        <div className="diary-opening-scene">

          <div className="opening-book">

            <div className="opening-left-page"></div>

            <div className="opening-cover">
              <span>✦</span>
              <strong>Syntra</strong>
            </div>

            <div className="opening-right-page"></div>

          </div>

        </div>
      )}

      {/* =========================================
          OPEN DIARY
      ========================================= */}

      {diaryOpened && (
        <section className="learning-diary diary-open">

          {/* Leather cover */}
          <div className="diary-cover"></div>

          {/* =====================================
              LEFT PAGE
          ===================================== */}

          <div className="diary-page diary-left">

            <div className="paper-light"></div>

            <div className="diary-tape tape-one"></div>
            <div className="diary-tape tape-two"></div>

            <div className="hand-note top-note">
              another day,
              <br />
              another step...
            </div>

            <div className="flower-doodle">
              <span>🌿</span>
              <span>🌼</span>
              <span>🌿</span>
            </div>

            <div className="welcome-content">

              <span className="tiny-handwritten">
                welcome back, learner
              </span>

              <h1>
                Your journey
                <br />
                starts <span>here.</span>
              </h1>

              <div className="purple-line"></div>

              <p className="welcome-message">
                Every concept you understand
                <br />
                is one more step toward
                <br />
                the person you want to become.
              </p>

            </div>

            <div className="diary-sticky-note">
              <p>
                "Small progress is still
                <br />
                progress."
              </p>

              <span>
                — Syntra
              </span>
            </div>

            <div className="bottom-doodle">
              ✦
            </div>

            <span className="page-number">
              01
            </span>

          </div>

          {/* =====================================
              BINDER
          ===================================== */}

          <div className="diary-binding">

            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

          </div>

          {/* =====================================
              RIGHT PAGE
          ===================================== */}

          <div className="diary-page diary-right">

            <div className="paper-light"></div>

            {/* Brand */}

            <div className="diary-brand">

              <div className="diary-brand-icon">
                ✦
              </div>

              <div className="diary-brand-name">
                <strong>Syntra</strong>
                <span>AI</span>
              </div>

            </div>

            <div className="diary-tagline">
              LEARN · GROW · ACHIEVE
            </div>

            <div className="right-hand-note">
              one concept
              <br />
              at a time ✦
            </div>

            {/* Heading */}

            <div className="diary-form-heading">

              <span className="form-eyebrow">
                YOUR LEARNING SPACE
              </span>

              <h2>
                Nice to see
                <br />
                you <span>again.</span>
              </h2>

              <p>
                Open your learning space.
              </p>

            </div>

            {/* =================================
                LOGIN FORM
            ================================= */}

            <form
              className="diary-login-form"
              onSubmit={handleSubmit}
            >

              {/* Student ID */}

              <div className="diary-field">

                <label htmlFor="studentId">
                  Student ID
                </label>

                <div className="diary-input">

                  <span className="diary-field-icon">
                    01
                  </span>

                  <input
                    id="studentId"
                    type="text"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(event) =>
                      setStudentId(event.target.value)
                    }
                    autoComplete="username"
                  />

                </div>

              </div>

              {/* Email */}

              <div className="diary-field">

                <label htmlFor="email">
                  Email
                </label>

                <div className="diary-input">

                  <span className="diary-field-icon">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* Password */}

              <div className="diary-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="diary-input">

                  <span className="diary-field-icon">
                    ✦
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="diary-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* Error */}

              {error && (
                <div className="diary-error">
                  {error}
                </div>
              )}

              {/* Sign in */}

              <button
                type="submit"
                className="diary-signin"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "Opening your space..."
                    : "Enter Tutor"}
                </span>

                {!loading && (
                  <span className="signin-arrow">
                    →
                  </span>
                )}

              </button>

            </form>

            {/* Divider */}

            <div className="diary-divider">

              <span></span>

              <small>
                or
              </small>

              <span></span>

            </div>

            {/* Google */}

            <button
              type="button"
              className="diary-google"
            >

              <span className="google-letter">
                G
              </span>

              Continue with Google

            </button>

            {/* Footer */}

            <div className="diary-footer">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => navigate("/")}
              >
                Sign up now
              </button>

            </div>

            <div className="right-bottom-note">
              Same curiosity.
              <br />
              Brighter tomorrow ♡
            </div>

            <div className="leaf-doodle">
              🌿
            </div>

            <span className="page-number right-number">
              02
            </span>

          </div>

          {/* =====================================
              DIARY TABS
          ===================================== */}

          <div className="diary-tabs">

            <span className="tab tab-learn">
              Learn
            </span>

            <span className="tab tab-practice">
              Practice
            </span>

            <span className="tab tab-track">
              Track
            </span>

            <span className="tab tab-achieve">
              Achieve
            </span>

            <span className="tab tab-you">
              You ♡
            </span>

          </div>

        </section>
      )}

      {/* =========================================
          DESK DECORATION
      ========================================= */}

      {diaryOpened && (
        <>
          <div className="desk-book-stack">
            <div>BETTER LEARNING</div>
            <div>A BRIGHTER YOU</div>
          </div>

          <div className="desk-pen">
            ✎
          </div>

          <div className="desk-note">
            Small steps.
            <br />
            Big progress ♡
          </div>
        </>
      )}

      {/* =========================================
          AVATAR SELECTION
      ========================================= */}

      {showAvatarSelection && (
        <div className="avatar-selection-overlay">

          <div className="avatar-selection-card">

            <div className="avatar-selection-icon">
              ✦
            </div>

            <span className="avatar-eyebrow">
              ONE LAST STEP
            </span>

            <h2>
              Choose your avatar
            </h2>

            <p>
              Pick the avatar you'd like to use
              in your learning space.
            </p>

            <div className="avatar-options">

              <button
                type="button"
                className="avatar-option"
                onClick={() =>
                  handleAvatarSelect("boy")
                }
                disabled={loading}
              >

                <div className="avatar-circle">
                  👦
                </div>

                <span>
                  Boy
                </span>

              </button>

              <button
                type="button"
                className="avatar-option"
                onClick={() =>
                  handleAvatarSelect("girl")
                }
                disabled={loading}
              >

                <div className="avatar-circle">
                  👧
                </div>

                <span>
                  Girl
                </span>

              </button>

            </div>

            {loading && (
              <p className="avatar-saving">
                Saving your choice...
              </p>
            )}

            {error && (
              <div className="diary-error">
                {error}
              </div>
            )}

          </div>

        </div>
      )}

    </main>
  );
}

export default Login;