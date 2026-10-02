import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000";

function formatDate(value) {
  if (!value) return "Date not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInteractionTopic(interaction) {
  return (
    interaction?.topic ||
    interaction?.concept ||
    interaction?.message ||
    interaction?.title ||
    "Learning session"
  );
}

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        setError("Please sign in to view your personalized dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/student/${encodeURIComponent(studentId)}`
        );

        if (!response.ok) {
          throw new Error("Unable to load your student profile.");
        }

        const data = await response.json();

        if (!data.success || !data.student) {
          throw new Error("Student information was not found.");
        }

        setStudent(data.student);
      } catch (err) {
        setError(err.message || "Something went wrong while loading your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const interests = Array.isArray(student?.interests)
    ? student.interests
    : [];

  const preferredStyles = Array.isArray(
    student?.learningPreferences?.preferredStyle
  )
    ? student.learningPreferences.preferredStyle
    : [];

  const concepts = student?.concepts || {};
  const interactions = Array.isArray(student?.interactions)
    ? student.interactions
    : [];

  const conceptEntries = Object.entries(concepts);

  const masteredConcepts = conceptEntries.filter(
    ([, concept]) => concept?.status?.toLowerCase() === "mastered"
  );

  const weakConcepts = conceptEntries.filter(
    ([, concept]) => concept?.status?.toLowerCase() === "weak"
  );

  const uniqueTopics = useMemo(() => {
    const topics = interactions
      .map(getInteractionTopic)
      .filter((topic) => topic && topic !== "Learning session");

    return [...new Set(topics)];
  }, [interactions]);

  const recentInteractions = useMemo(() => {
    return [...interactions]
      .sort((a, b) => {
        const dateA = new Date(a?.timestamp || a?.createdAt || 0).getTime();
        const dateB = new Date(b?.timestamp || b?.createdAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 4);
  }, [interactions]);

  const latestInteraction = recentInteractions[0];

  const studentName = student?.profile?.name || "Learner";
  const studentLevel =
    student?.level || student?.profile?.level || "Not set";

  const difficulty =
    student?.learningPreferences?.difficulty || studentLevel;

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-state-card">
            <div className="dashboard-loader" />
            <h2>Preparing your learning space...</h2>
            <p>We’re loading your personalized dashboard.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-state-card">
            <span className="dashboard-state-icon">✦</span>
            <h2>Let’s get you started</h2>
            <p>{error}</p>
            <Link to="/login" className="dashboard-primary-button">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome section */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-inner">
            <div className="dashboard-hero-copy">
              <span className="dashboard-eyebrow">
                YOUR PERSONAL LEARNING SPACE
              </span>

              <h1>
                Welcome back, {studentName} <span>✦</span>
              </h1>

              <p>
                Your learning journey, your pace. Let’s keep exploring what
                interests you.
              </p>

              <div className="dashboard-hero-tags">
                <span className="dashboard-hero-tag">
                  {studentLevel} learner
                </span>
                <span className="dashboard-hero-tag">
                  {difficulty} pace
                </span>
              </div>
            </div>

            <div className="dashboard-hero-decoration" aria-hidden="true">
              <span className="dashboard-decoration-orbit orbit-one" />
              <span className="dashboard-decoration-orbit orbit-two" />
              <span className="dashboard-decoration-star">✦</span>
            </div>
          </div>
        </section>

        {/* Student overview */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">YOUR PROGRESS</span>
              <h2>Your learning overview</h2>
            </div>
            <p>Based on the activity saved to your account.</p>
          </div>

          <div className="dashboard-personal-grid">
            <article className="dashboard-personal-card">
              <span className="dashboard-card-icon">◎</span>
              <span className="dashboard-card-label">Learning sessions</span>
              <strong>{interactions.length}</strong>
              <p>Recorded interactions</p>
            </article>

            <article className="dashboard-personal-card">
              <span className="dashboard-card-icon">✦</span>
              <span className="dashboard-card-label">Topics explored</span>
              <strong>{uniqueTopics.length}</strong>
              <p>Distinct topics in your activity</p>
            </article>

            <article className="dashboard-personal-card">
              <span className="dashboard-card-icon">✓</span>
              <span className="dashboard-card-label">Mastered concepts</span>
              <strong>{masteredConcepts.length}</strong>
              <p>Marked as mastered</p>
            </article>

            <article className="dashboard-personal-card">
              <span className="dashboard-card-icon">↗</span>
              <span className="dashboard-card-label">Needs practice</span>
              <strong>{weakConcepts.length}</strong>
              <p>Concepts marked as weak</p>
            </article>
          </div>
        </section>

        {/* Interests */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">BUILT AROUND YOU</span>
              <h2>Your interests</h2>
            </div>
            <Link to="/profile" className="dashboard-text-link">
              Edit profile <span>↗</span>
            </Link>
          </div>

          {interests.length > 0 ? (
            <div className="dashboard-interest-grid">
              {interests.map((interest, index) => (
                <article
                  className="dashboard-interest-card"
                  key={`${interest}-${index}`}
                >
                  <span className="dashboard-interest-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{interest}</h3>
                  <p>Explore this area with your AI tutor.</p>

                  <Link to="/tutor" className="dashboard-interest-link">
                    Start learning <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <h3>Your interests will appear here</h3>
              <p>Add your interests to personalize your learning space.</p>
              <Link to="/profile" className="dashboard-primary-button">
                Update interests
              </Link>
            </div>
          )}
        </section>

        {/* Learning preferences */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">HOW YOU LEARN</span>
              <h2>Your learning preferences</h2>
            </div>
          </div>

          <div className="dashboard-preferences-card">
            <div>
              <h3>Preferred learning styles</h3>

              {preferredStyles.length > 0 ? (
                <div className="dashboard-chip-list">
                  {preferredStyles.map((style) => (
                    <span className="dashboard-chip" key={style}>
                      {style}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="dashboard-muted">
                  No learning styles saved yet.
                </p>
              )}
            </div>

            <div className="dashboard-preference-divider" />

            <div>
              <h3>Learning difficulty</h3>
              <span className="dashboard-chip dashboard-chip-accent">
                {difficulty}
              </span>
            </div>
          </div>
        </section>

        {/* Continue learning */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">PICK UP WHERE YOU LEFT OFF</span>
              <h2>Continue learning</h2>
            </div>
          </div>

          {latestInteraction ? (
            <article className="dashboard-continue-card">
              <div className="dashboard-continue-symbol">✦</div>

              <div className="dashboard-continue-content">
                <span className="dashboard-continue-label">
                  YOUR LATEST RECORDED TOPIC
                </span>

                <h3>{getInteractionTopic(latestInteraction)}</h3>

                <p>
                  {latestInteraction.subject &&
                  latestInteraction.subject !== "Unknown"
                    ? latestInteraction.subject
                    : "Learning session"}
                  {" · "}
                  {formatDate(
                    latestInteraction.timestamp || latestInteraction.createdAt
                  )}
                </p>
              </div>

              <Link to="/tutor" className="dashboard-primary-button">
                Continue with TutorAI <span>→</span>
              </Link>
            </article>
          ) : (
            <div className="dashboard-empty dashboard-empty-horizontal">
              <div>
                <h3>Your learning journey starts here</h3>
                <p>
                  You haven’t recorded a learning session yet. Choose one of
                  your interests and start exploring.
                </p>
              </div>

              <Link to="/tutor" className="dashboard-primary-button">
                Start learning <span>→</span>
              </Link>
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">YOUR LEARNING HISTORY</span>
              <h2>Recent activity</h2>
            </div>
          </div>

          {recentInteractions.length > 0 ? (
            <div className="dashboard-activity-list">
              {recentInteractions.map((interaction, index) => (
                <article
                  className="dashboard-activity-item"
                  key={
                    interaction?._id ||
                    `${getInteractionTopic(interaction)}-${index}`
                  }
                >
                  <span className="dashboard-activity-icon">✦</span>

                  <div className="dashboard-activity-copy">
                    <h3>{getInteractionTopic(interaction)}</h3>
                    <p>
                      {interaction?.subject &&
                      interaction.subject !== "Unknown"
                        ? interaction.subject
                        : "Learning activity"}
                    </p>
                  </div>

                  <time className="dashboard-activity-date">
                    {formatDate(
                      interaction?.timestamp || interaction?.createdAt
                    )}
                  </time>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <h3>No recent activity yet</h3>
              <p>
                Your learning sessions will show up here as you use TutorAI.
              </p>
            </div>
          )}
        </section>

        <p className="dashboard-data-note">
          Your dashboard reflects information currently saved in your TutorAI
          account. More progress insights can appear as those activities are
          tracked.
        </p>
      </div>
    </main>
  );
}

export default Dashboard;