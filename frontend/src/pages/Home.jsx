import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [question, setQuestion] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [challengeAnswer, setChallengeAnswer] = useState(null);

  const studentName = "there";

  const continueLearning = [
    {
      icon: "🧠",
      subject: "Data Structures & Algorithms",
      topic: "Trees & Binary Search Trees",
      progress: 62,
      meta: "4 of 7 concepts",
    },
    {
      icon: "🗄️",
      subject: "Database Management",
      topic: "SQL Queries & Joins",
      progress: 48,
      meta: "6 of 12 topics",
    },
    {
      icon: "🤖",
      subject: "Artificial Intelligence",
      topic: "Search Algorithms",
      progress: 34,
      meta: "5 of 15 topics",
    },
  ];

  const subjects = [
    {
      icon: "🧠",
      name: "Data Structures",
      progress: 62,
      topics: "8 of 13 topics",
    },
    {
      icon: "🗄️",
      name: "Database Systems",
      progress: 48,
      topics: "6 of 12 topics",
    },
    {
      icon: "💻",
      name: "Operating Systems",
      progress: 35,
      topics: "5 of 14 topics",
    },
    {
      icon: "🤖",
      name: "Artificial Intelligence",
      progress: 28,
      topics: "4 of 15 topics",
    },
  ];

  const learningModes = [
    {
      icon: "💡",
      label: "Simple",
      description: "Break it down simply",
    },
    {
      icon: "🎯",
      label: "Exam focused",
      description: "Focus on what matters",
    },
    {
      icon: "💻",
      label: "With code",
      description: "Learn through examples",
    },
    {
      icon: "🎨",
      label: "Visually",
      description: "Understand with visuals",
    },
  ];

  const recentActivity = [
    {
      icon: "✦",
      title: "Learned about recursion",
      type: "AI Tutor",
      time: "35 minutes ago",
    },
    {
      icon: "✓",
      title: "Completed DSA practice",
      type: "Quiz",
      time: "Yesterday",
    },
    {
      icon: "💬",
      title: "Asked about SQL joins",
      type: "AI Tutor",
      time: "Yesterday",
    },
  ];

  const handleQuestion = () => {
    if (!question.trim()) return;
    setShowAnswer(true);
  };

  const handleChallenge = (answer) => {
    setChallengeAnswer(answer);
  };

  const handleSuggestion = (text) => {
    setQuestion(text);
    setShowAnswer(false);
  };

  return (
    <div className="home-page">
      <main>

        {/* =========================
            WELCOME
        ========================= */}

        <section className="welcome-section">
          <div className="home-container">
            <div className="welcome-content">

              <div className="welcome-eyebrow">
                <span>✦</span>
                YOUR LEARNING SPACE
              </div>

              <h1>
                Good to see you<span>.</span>
              </h1>

              <p>
                What would you like to understand today?
              </p>

            </div>

            <div className="welcome-streak">
              <div className="streak-icon">🔥</div>

              <div>
                <strong>7 day streak</strong>
                <span>Keep the momentum going</span>
              </div>
            </div>
          </div>
        </section>


        {/* =========================
            ASK TUTOR
        ========================= */}

        <section className="ask-section">
          <div className="home-container">

            <div className="ask-card">

              <div className="ask-header">
                <div className="ask-icon">✦</div>

                <div>
                  <span>AI TUTOR</span>
                  <h2>Ask TutorAI anything.</h2>
                </div>
              </div>

              <div className="ask-input-wrapper">

                <input
                  type="text"
                  placeholder="Ask a question, explain a concept, or explore an idea..."
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setShowAnswer(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleQuestion();
                    }
                  }}
                />

                <button
                  className="ask-submit"
                  onClick={handleQuestion}
                  aria-label="Ask TutorAI"
                >
                  →
                </button>

              </div>

              <div className="ask-suggestions">
                <span>Try:</span>

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Explain recursion with a simple example"
                    )
                  }
                >
                  Explain recursion
                </button>

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Explain SQL joins with a real-world example"
                    )
                  }
                >
                  Explain SQL joins
                </button>

                <button
                  onClick={() =>
                    handleSuggestion(
                      "Quiz me on data structures"
                    )
                  }
                >
                  Quiz me
                </button>
              </div>

              {showAnswer && (
                <div className="quick-response">

                  <div className="response-icon">✦</div>

                  <div className="response-body">
                    <div className="response-title">
                      TUTORAI
                      <span>●</span>
                    </div>

                    <p>
                      Let's break down
                      <strong> "{question}" </strong>
                      in a way that makes sense to you.
                    </p>

                    <Link to="/tutor">
                      Continue with TutorAI →
                    </Link>
                  </div>

                </div>
              )}

            </div>

          </div>
        </section>


        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="quick-actions-section">
          <div className="home-container">

            <div className="quick-actions">

              <Link to="/tutor" className="quick-action">
                <div className="quick-action-icon">✦</div>

                <div>
                  <strong>Ask Tutor</strong>
                  <span>Learn something new</span>
                </div>

                <b>→</b>
              </Link>

              <Link to="/quiz" className="quick-action">
                <div className="quick-action-icon">✓</div>

                <div>
                  <strong>Practice</strong>
                  <span>Test what you know</span>
                </div>

                <b>→</b>
              </Link>

              <Link to="/progress" className="quick-action">
                <div className="quick-action-icon">↗</div>

                <div>
                  <strong>View progress</strong>
                  <span>See your learning journey</span>
                </div>

                <b>→</b>
              </Link>

            </div>

          </div>
        </section>


        {/* =========================
            CONTINUE LEARNING
        ========================= */}

        <section className="content-section">
          <div className="home-container">

            <div className="section-header">

              <div>
                <span className="section-label">
                  PICK UP WHERE YOU LEFT OFF
                </span>

                <h2>Continue learning.</h2>
              </div>

              <Link to="/progress" className="section-link">
                View all →
              </Link>

            </div>


            <div className="continue-card">

              <div className="continue-main">

                <div className="continue-icon large">
                  🧠
                </div>

                <div className="continue-info">

                  <span className="continue-subject">
                    DATA STRUCTURES & ALGORITHMS
                  </span>

                  <h3>Trees & Binary Search Trees</h3>

                  <p>
                    Continue understanding tree traversal,
                    BST operations, and their real-world applications.
                  </p>

                  <div className="continue-meta">
                    <span>62% complete</span>
                    <span>4 / 7 concepts</span>
                  </div>

                  <div className="large-progress">
                    <span style={{ width: "62%" }}></span>
                  </div>

                </div>

              </div>

              <Link to="/tutor" className="primary-button">
                Continue learning
                <span>→</span>
              </Link>

            </div>


            {/* Other learning items */}

            <div className="secondary-learning-grid">

              {continueLearning.slice(1).map((item, index) => (
                <Link
                  to="/tutor"
                  className="secondary-learning-card"
                  key={index}
                >

                  <div className="card-top-row">

                    <div className="small-learning-icon">
                      {item.icon}
                    </div>

                    <span>→</span>

                  </div>

                  <span className="card-category">
                    {item.subject}
                  </span>

                  <h3>{item.topic}</h3>

                  <div className="small-progress-info">
                    <span>{item.progress}%</span>
                    <small>{item.meta}</small>
                  </div>

                  <div className="small-progress">
                    <span
                      style={{
                        width: `${item.progress}%`,
                      }}
                    ></span>
                  </div>

                </Link>
              ))}

            </div>

          </div>
        </section>


        {/* =========================
            SUBJECTS
        ========================= */}

        <section className="subjects-section">
          <div className="home-container">

            <div className="section-header">

              <div>
                <span className="section-label">
                  YOUR LEARNING
                </span>

                <h2>Your subjects.</h2>

                <p>
                  A quick look at where you are across your subjects.
                </p>
              </div>

              <Link to="/progress" className="section-link">
                Full progress →
              </Link>

            </div>


            <div className="subjects-grid">

              {subjects.map((subject, index) => (
                <Link
                  to="/progress"
                  className="subject-card"
                  key={index}
                >

                  <div className="subject-card-top">

                    <div className="subject-icon">
                      {subject.icon}
                    </div>

                    <span className="subject-arrow">
                      →
                    </span>

                  </div>

                  <h3>{subject.name}</h3>

                  <div className="subject-progress-row">
                    <span>{subject.progress}%</span>
                    <small>{subject.topics}</small>
                  </div>

                  <div className="subject-progress">
                    <span
                      style={{
                        width: `${subject.progress}%`,
                      }}
                    ></span>
                  </div>

                </Link>
              ))}

            </div>

          </div>
        </section>


        {/* =========================
            DAILY CHALLENGE
        ========================= */}

        <section className="challenge-section">
          <div className="home-container">

            <div className="challenge-card">

              <div className="challenge-content">

                <span className="section-label light">
                  TODAY'S QUICK PRACTICE
                </span>

                <h2>
                  Which data structure
                  <span> works like a stack of plates?</span>
                </h2>

                <p>
                  Test yourself in under two minutes.
                </p>

                <div className="challenge-note">
                  🔥 Complete today's challenge to keep your streak.
                </div>

              </div>


              <div className="challenge-options">

                {["Array", "Stack", "Queue", "Linked List"].map(
                  (option) => {

                    const isSelected =
                      challengeAnswer === option;

                    const isCorrect =
                      option === "Stack";

                    return (
                      <button
                        key={option}
                        className={`challenge-option ${
                          isSelected
                            ? isCorrect
                              ? "correct"
                              : "wrong"
                            : ""
                        }`}
                        onClick={() =>
                          handleChallenge(option)
                        }
                      >

                        <span>{option}</span>

                        {isSelected && (
                          <strong>
                            {isCorrect ? "✓" : "×"}
                          </strong>
                        )}

                      </button>
                    );
                  }
                )}

                {challengeAnswer && (
                  <div className="challenge-result">
                    {challengeAnswer === "Stack"
                      ? "Correct! A stack follows Last In, First Out."
                      : "Not quite. Think about the Last In, First Out rule."}
                  </div>
                )}

              </div>

            </div>

          </div>
        </section>


        {/* =========================
            LEARN YOUR WAY
        ========================= */}

        <section className="content-section learning-style-section">
          <div className="home-container">

            <div className="section-header">

              <div>
                <span className="section-label">
                  PERSONALIZED LEARNING
                </span>

                <h2>Learn in the way that works for you.</h2>

                <p>
                  TutorAI can adapt explanations to your preferred
                  learning style.
                </p>
              </div>

            </div>


            <div className="learning-modes">

              {learningModes.map((mode, index) => (
                <button
                  key={index}
                  className={`learning-mode ${
                    selectedMode === index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedMode(index)
                  }
                >

                  <span className="mode-icon">
                    {mode.icon}
                  </span>

                  <strong>{mode.label}</strong>

                  <small>
                    {mode.description}
                  </small>

                </button>
              ))}

            </div>


            <div className="learning-preview">

              <div className="preview-content">

                <span className="preview-label">
                  {selectedMode !== null
                    ? learningModes[selectedMode].label
                    : "VISUAL EXPLANATION"}
                </span>

                <h3>
                  Neural networks,
                  <span> without the confusion.</span>
                </h3>

                <p>
                  The same concept can be explained differently
                  depending on how you learn best.
                </p>

                <Link to="/tutor">
                  Try it with TutorAI →
                </Link>

              </div>

              <div className="preview-visual">

                <div className="visual-core">
                  ✦
                </div>

                <div className="visual-ring ring-one"></div>
                <div className="visual-ring ring-two"></div>

                <span className="visual-node node-one">
                  Input
                </span>

                <span className="visual-node node-two">
                  Learning
                </span>

                <span className="visual-node node-three">
                  Output
                </span>

              </div>

            </div>

          </div>
        </section>


        {/* =========================
            RECENT ACTIVITY
        ========================= */}

        <section className="activity-section">
          <div className="home-container">

            <div className="section-header">

              <div>
                <span className="section-label">
                  RECENT ACTIVITY
                </span>

                <h2>What you've been up to.</h2>
              </div>

              <Link to="/dashboard" className="section-link">
                Dashboard →
              </Link>

            </div>


            <div className="activity-list">

              {recentActivity.map((activity, index) => (
                <div
                  className="activity-item"
                  key={index}
                >

                  <div className="activity-icon">
                    {activity.icon}
                  </div>

                  <div className="activity-info">
                    <strong>{activity.title}</strong>
                    <span>
                      {activity.type} · {activity.time}
                    </span>
                  </div>

                  <span className="activity-check">
                    ✓
                  </span>

                </div>
              ))}

            </div>

          </div>
        </section>


        {/* =========================
            FINAL PRODUCT CTA
        ========================= */}

        <section className="home-footer-cta">
          <div className="home-container">

            <div className="footer-cta-content">

              <span className="section-label light">
                KEEP LEARNING
              </span>

              <h2>
                One question can
                <span> change what you understand.</span>
              </h2>

              <p>
                Ask TutorAI whenever you're ready for your next concept.
              </p>

              <Link to="/tutor" className="footer-cta-button">
                Ask TutorAI
                <span>→</span>
              </Link>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Home;