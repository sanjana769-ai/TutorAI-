
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/student/${studentId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.student) {
          throw new Error("Unable to load your profile.");
        }

        setStudent(data.student);
      } catch (err) {
        console.error("Profile loading error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("studentId");
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Opening your learning profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Unable to load profile</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  const name = student.profile?.name || "Student";
  const avatar = student.profile?.avatar;
  const studentId = student.id || "Not available";

  const email =
    student.profile?.email ||
    student.email ||
    "Not added";

  const interests = student.interests || [];

  const learningStyles =
    student.learningPreferences?.preferredStyle || [];

  const difficulty =
    student.learningPreferences?.difficulty || "Adaptive";

  const level = student.level || "Not assessed";

  const goals = student.goals || [];

  const avatarEmoji =
    avatar === "girl"
      ? "👧"
      : avatar === "boy"
      ? "👦"
      : "👤";

  return (
    <main className="profile-page">

      <div className="profile-container">

        {/* PAGE HEADER */}
        <div className="profile-header">
          <div>
            <span className="profile-eyebrow">
              YOUR PERSONAL SPACE
            </span>

            <h1>My Profile</h1>

            <p>
              Everything about your learning journey,
              all in one place.
            </p>
          </div>

          <button
            className="profile-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>
        </div>


        {/* PROFILE HERO */}
        <section className="profile-hero">

          <div className="profile-avatar">
            {avatarEmoji}
          </div>

          <div className="profile-hero-info">
            <span className="profile-member-label">
              TUTORAI LEARNER
            </span>

            <h2>{name}</h2>

            <p>{studentId}</p>

            <span className="profile-level-badge">
              {level} Learner
            </span>
          </div>

          <div className="profile-hero-decoration">
            ✦
          </div>

        </section>


        {/* ACCOUNT INFORMATION */}
        <section className="profile-section">

          <div className="profile-section-heading">
            <div className="profile-section-icon">
              ♙
            </div>

            <div>
              <h2>Account Information</h2>
              <p>Your registered account details</p>
            </div>
          </div>

          <div className="profile-info-grid">

            <div className="profile-info-card">
              <span>Full Name</span>
              <strong>{name}</strong>
            </div>

            <div className="profile-info-card">
              <span>Student ID</span>
              <strong>{studentId}</strong>
            </div>

            <div className="profile-info-card">
              <span>Email Address</span>
              <strong>{email}</strong>
            </div>

            <div className="profile-info-card">
              <span>Learning Level</span>
              <strong>{level}</strong>
            </div>

          </div>
        </section>


        {/* LEARNING PROFILE */}
        <section className="profile-section">

          <div className="profile-section-heading">
            <div className="profile-section-icon">
              ✧
            </div>

            <div>
              <h2>My Learning Profile</h2>
              <p>Personalized learning preferences</p>
            </div>
          </div>

          <div className="profile-learning-grid">

            <div className="profile-learning-card">
              <h3>My Interests</h3>

              <p>
                Topics you're interested in exploring.
              </p>

              <div className="profile-tags">
                {interests.length > 0 ? (
                  interests.map((interest, index) => (
                    <span key={index} className="profile-tag">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="profile-empty">
                    No interests added yet
                  </span>
                )}
              </div>
            </div>


            <div className="profile-learning-card">
              <h3>Preferred Learning Style</h3>

              <p>
                How you prefer TutorAI to explain concepts.
              </p>

              <div className="profile-tags">
                {learningStyles.length > 0 ? (
                  learningStyles.map((style, index) => (
                    <span key={index} className="profile-tag">
                      {style}
                    </span>
                  ))
                ) : (
                  <span className="profile-empty">
                    No preferences selected
                  </span>
                )}
              </div>
            </div>


            <div className="profile-learning-card">
              <h3>Difficulty Preference</h3>

              <p>
                Your preferred lesson difficulty.
              </p>

              <span className="profile-tag">
                {difficulty}
              </span>
            </div>


            <div className="profile-learning-card">
              <h3>Learning Goals</h3>

              <p>
                What you're working towards.
              </p>

              <div className="profile-tags">
                {goals.length > 0 ? (
                  goals.map((goal, index) => (
                    <span key={index} className="profile-tag">
                      {goal}
                    </span>
                  ))
                ) : (
                  <span className="profile-empty">
                    No goals added yet
                  </span>
                )}
              </div>
            </div>

          </div>
        </section>


        {/* ACCOUNT ACTIONS */}
        <section className="profile-actions">

          <div>
            <h3>Account Settings</h3>
            <p>
              Manage your account and sign out securely.
            </p>
          </div>

          <button
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            <span>↗</span>
            Logout
          </button>

        </section>


        <footer className="profile-footer">
          Made for your learning journey ✦ TutorAI
        </footer>

      </div>
    </main>
  );
}

export default Profile;
