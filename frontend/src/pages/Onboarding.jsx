import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const navigate = useNavigate();

  const [interests, setInterests] = useState([]);
  const [preferredStyle, setPreferredStyle] = useState([]);
  const [difficulty, setDifficulty] = useState("adaptive");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [step, setStep] = useState(1);
  const [turning, setTurning] = useState(false);

  // =========================================================
  // OPTIONS
  // =========================================================

  const interestOptions = [
    "AI & Machine Learning",
    "Programming",
    "Web Development",
    "Data Science",
    "Mathematics",
    "Science",
    "Design",
    "Career & Interview Prep",
  ];

  const learningStyles = [
    "Visual explanations",
    "Examples & analogies",
    "Step-by-step explanations",
    "Interactive conversation",
    "Practice questions",
    "Quizzes",
  ];

  const difficultyOptions = [
    {
      value: "beginner",
      title: "Beginner",
      description: "Start from the fundamentals.",
    },
    {
      value: "intermediate",
      title: "Intermediate",
      description: "I know the basics already.",
    },
    {
      value: "advanced",
      title: "Advanced",
      description: "Challenge me with deeper concepts.",
    },
    {
      value: "adaptive",
      title: "Adaptive",
      description: "Let Syntra decide for me.",
    },
  ];

  // =========================================================
  // TOGGLE INTEREST
  // =========================================================

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  // =========================================================
  // TOGGLE LEARNING STYLE
  // =========================================================

  function toggleStyle(style) {
    setPreferredStyle((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
  }

  // =========================================================
  // PAGE TURN
  // =========================================================

  function changeStep(nextStep) {
    if (turning) return;

    setTurning(true);
    setError("");

    setTimeout(() => {
      setStep(nextStep);
      setTurning(false);
    }, 450);
  }

  // =========================================================
  // NEXT
  // =========================================================

  function handleNext() {
    setError("");

    if (step === 1) {
      if (interests.length === 0) {
        setError("Choose at least one interest before continuing.");
        return;
      }

      changeStep(2);
      return;
    }

    if (step === 2) {
      if (preferredStyle.length === 0) {
        setError("Choose at least one learning preference.");
        return;
      }

      changeStep(3);
      return;
    }

    handleFinish();
  }

  // =========================================================
  // BACK
  // =========================================================

  function handleBack() {
    if (step > 1) {
      changeStep(step - 1);
    }
  }

  // =========================================================
  // SAVE ONBOARDING
  // =========================================================

  async function handleFinish() {
    setError("");

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      setError("Student session not found. Please login again.");
      navigate("/login");
      return;
    }

    const preferences = {
      studentId,

      interests,

      learningPreferences: {
        preferredStyle,
        difficulty,
      },
    };

    console.log("Sending student preferences:", preferences);

    try {
      setSaving(true);

      const response = await fetch(
        "http://localhost:3000/api/student/preferences",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(preferences),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error || "Could not save your learning preferences."
        );

        setSaving(false);
        return;
      }

      console.log(
        "Preferences saved successfully:",
        data.student
      );

      navigate("/home");
    } catch (error) {
      console.error("Preference save error:", error);

      setError("Unable to connect to Syntra AI server.");
      setSaving(false);
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="diary-onboarding-page">

      {/* Ambient background */}
      <div className="onboarding-glow onboarding-glow-one"></div>
      <div className="onboarding-glow onboarding-glow-two"></div>

      <div className="onboarding-dust dust-one"></div>
      <div className="onboarding-dust dust-two"></div>
      <div className="onboarding-dust dust-three"></div>

      {/* =====================================================
          TOP BRAND
      ===================================================== */}

      <div className="onboarding-topbar">

        <div className="onboarding-brand">
          <span className="brand-star">✦</span>

          <div>
            <strong>Syntra</strong>
            <span>AI</span>
          </div>
        </div>

        <div className="journal-label">
          YOUR LEARNING JOURNAL
        </div>

      </div>

      {/* =====================================================
          DIARY
      ===================================================== */}

      <section
        className={`onboarding-diary ${
          turning ? "diary-turning" : ""
        }`}
      >

        {/* Leather cover */}
        <div className="onboarding-leather"></div>

        {/* ===================================================
            LEFT PAGE
        =================================================== */}

        <div className="onboarding-page-sheet left-sheet">

          <div className="paper-texture"></div>

          <div className="paper-tape tape-top"></div>

          <div className="hand-note">
            a little about
            <br />
            <span>you...</span>
          </div>

          <div className="leaf-decoration">
            🌿
          </div>

          <div className="left-content">

            <span className="small-script">
              chapter one
            </span>

            <h1>
              Let's make
              <br />
              this <span>yours.</span>
            </h1>

            <div className="gold-line"></div>

            <p>
              Every learner has a different
              <br />
              way of discovering things.
            </p>

            <p className="soft-note">
              Tell me a little about
              <br />
              what makes you curious.
            </p>

          </div>

          <div className="left-quote">
            <span>✦</span>

            <p>
              There is no wrong
              <br />
              way to learn.
            </p>

            <small>
              — your learning journal
            </small>
          </div>

          <span className="sheet-number">
            0{step}
          </span>

        </div>

        {/* ===================================================
            BINDER
        =================================================== */}

        <div className="onboarding-binding">

          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>

        {/* ===================================================
            RIGHT PAGE
        =================================================== */}

        <div className="onboarding-page-sheet right-sheet">

          <div className="paper-texture"></div>

          <div className="right-header">

            <div className="step-label">
              0{step} / 03
            </div>

            <div className="mini-brand">
              SYNTRA · LEARN
            </div>

          </div>

          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <div className="onboarding-step-content">

              <span className="form-eyebrow">
                LET'S START HERE
              </span>

              <h2>
                What are you
                <br />
                <span>interested in?</span>
              </h2>

              <p className="step-description">
                Select everything you're curious about.
              </p>

              <div className="journal-options interest-options">

                {interestOptions.map((interest) => (

                  <button
                    key={interest}
                    type="button"
                    className={`journal-option ${
                      interests.includes(interest)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >

                    <span className="option-mark">
                      {interests.includes(interest)
                        ? "✓"
                        : "+"}
                    </span>

                    <span>{interest}</span>

                  </button>

                ))}

              </div>

            </div>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (
            <div className="onboarding-step-content">

              <span className="form-eyebrow">
                YOUR WAY OF LEARNING
              </span>

              <h2>
                How do you
                <br />
                <span>like to learn?</span>
              </h2>

              <p className="step-description">
                Choose the styles that help you understand best.
              </p>

              <div className="journal-options style-options">

                {learningStyles.map((style) => (

                  <button
                    key={style}
                    type="button"
                    className={`journal-option ${
                      preferredStyle.includes(style)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleStyle(style)}
                  >

                    <span className="option-mark">
                      {preferredStyle.includes(style)
                        ? "✓"
                        : "+"}
                    </span>

                    <span>{style}</span>

                  </button>

                ))}

              </div>

            </div>
          )}

          {/* =================================================
              STEP 3
          ================================================= */}

          {step === 3 && (
            <div className="onboarding-step-content">

              <span className="form-eyebrow">
                ONE LAST THING
              </span>

              <h2>
                What level
                <br />
                <span>feels right?</span>
              </h2>

              <p className="step-description">
                Don't worry — Syntra can adapt as you learn.
              </p>

              <div className="difficulty-journal-options">

                {difficultyOptions.map((option) => (

                  <button
                    key={option.value}
                    type="button"
                    className={`difficulty-journal-card ${
                      difficulty === option.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setDifficulty(option.value)
                    }
                  >

                    <div className="difficulty-top">

                      <span className="difficulty-radio">
                        {difficulty === option.value
                          ? "✓"
                          : ""}
                      </span>

                      <strong>
                        {option.title}
                      </strong>

                    </div>

                    <span className="difficulty-description">
                      {option.description}
                    </span>

                  </button>

                ))}

              </div>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="journal-error">
              {error}
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="journal-footer">

            <button
              type="button"
              className={`back-button ${
                step === 1 ? "hidden" : ""
              }`}
              onClick={handleBack}
              disabled={turning || saving}
            >
              ← Back
            </button>

            <div className="footer-progress">

              <span className={step === 1 ? "active" : ""}>
                01
              </span>

              <i></i>

              <span className={step === 2 ? "active" : ""}>
                02
              </span>

              <i></i>

              <span className={step === 3 ? "active" : ""}>
                03
              </span>

            </div>

            <button
              type="button"
              className="journal-next-button"
              onClick={handleNext}
              disabled={turning || saving}
            >

              <span>
                {saving
                  ? "Saving..."
                  : step === 3
                  ? "Begin my journey"
                  : "Turn the page"}
              </span>

              <span>
                {saving ? "..." : "→"}
              </span>

            </button>

          </div>

          <span className="right-sheet-number">
            {step === 1 ? "02" : step === 2 ? "04" : "06"}
          </span>

        </div>

        {/* ===================================================
            DIARY TABS
        =================================================== */}

        <div className="onboarding-tabs">

          <span>LEARN</span>
          <span>PRACTICE</span>
          <span>GROW</span>
          <span>YOU ♡</span>

        </div>

      </section>

      {/* =====================================================
          BOTTOM DESK DETAILS
      ===================================================== */}

      <div className="desk-message">
        Small choices.
        <br />
        <span>A learning journey made for you.</span>
      </div>

    </main>
  );
}

export default Onboarding;