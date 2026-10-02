
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  useEffect(() => {
    async function loadStudent() {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        setStudent(null);
        setLoadingStudent(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/student/${studentId}`
        );

        const data = await response.json();

        if (data.success && data.student) {
          setStudent(data.student);
        } else {
          setStudent(null);
        }
      } catch (error) {
        console.error("Could not load student:", error);
        setStudent(null);
      } finally {
        setLoadingStudent(false);
      }
    }

    loadStudent();
  }, []);

  const isLoginPage = location.pathname === "/login";
  const isLoggedIn = !!student && !isLoginPage;

  function getAvatar() {
    if (student?.profile?.avatar === "girl") {
      return "👧";
    }

    if (student?.profile?.avatar === "boy") {
      return "👦";
    }

    return "👤";
  }

  function handleLogout() {
    localStorage.removeItem("studentId");
    setStudent(null);
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* BRAND */}
        <Link to="/" className="brand">
          <span className="brand-mark">✦</span>
          <span>TutorAI</span>
        </Link>


        {/* NAVIGATION */}
        <nav className="nav-links">

          {/* HOME — visible to everyone */}
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </Link>


          {/* STUDENT NAVIGATION */}
          {isLoggedIn && (
            <>
              <Link
                to="/tutor"
                className={location.pathname === "/tutor" ? "active" : ""}
              >
                AI Tutor
              </Link>

              <Link
                to="/dashboard"
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </Link>

              <Link
                to="/quiz"
                className={location.pathname === "/quiz" ? "active" : ""}
              >
                Quiz
              </Link>

              <Link
                to="/progress"
                className={location.pathname === "/progress" ? "active" : ""}
              >
                Progress
              </Link>
            </>
          )}

        </nav>


        {/* RIGHT SIDE */}
        <div className="nav-actions">

          {/* BEFORE LOGIN */}
          {!loadingStudent && !isLoggedIn && (
            <>
              <Link to="/login" className="sign-in-btn">
                Sign in
              </Link>

              <Link to="/login" className="nav-cta">
                Get started
                <span>→</span>
              </Link>
            </>
          )}


          {/* AFTER LOGIN */}
          {!loadingStudent && isLoggedIn && (
            <div className="nav-profile">

              <button
  type="button"
  className="nav-avatar-button"
  onClick={() => navigate("/profile")}
  aria-label="Open student profile"
>
                <span className="nav-avatar">
                  {getAvatar()}
                </span>

                <span className="nav-profile-name">
                  {student?.profile?.name || "Student"}
                </span>

                <span className="nav-profile-arrow">
                  ▾
                </span>
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;