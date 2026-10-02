import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ========================================
// CURRENT QUIZ QUESTION BANK
// ========================================

const quizQuestions = [
  {
    question: "Which data structure follows the FIFO principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
    topic: "Data Structures",
    subject: "Data Structures",
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    answer: "O(log n)",
    topic: "Searching",
    subject: "Data Structures",
  },
  {
    question: "Which traversal visits the root node first?",
    options: ["Inorder", "Postorder", "Preorder", "Level order"],
    answer: "Preorder",
    topic: "Trees",
    subject: "Data Structures",
  },
  {
    question: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: "SELECT",
    topic: "DBMS",
    subject: "DBMS",
  },
  {
    question: "Which component is responsible for executing instructions?",
    options: ["RAM", "CPU", "Hard Disk", "Monitor"],
    answer: "CPU",
    topic: "Operating Systems",
    subject: "Operating Systems",
  },
];

// ========================================
// PROFILE PERSONALIZATION HELPERS
// ========================================

const getSuggestedDifficulty = (level) => {
  const normalizedLevel = String(level || "").toLowerCase();

  if (normalizedLevel.includes("beginner")) return "Easy";
  if (normalizedLevel.includes("intermediate")) return "Medium";
  if (normalizedLevel.includes("advanced")) return "Hard";

  return "Medium";
};

const getSuggestedSubject = (interests = []) => {
  const normalizedInterests = interests.map((interest) =>
    String(interest).toLowerCase()
  );

  if (
    normalizedInterests.some((interest) =>
      /database|dbms|sql/.test(interest)
    )
  ) {
    return "DBMS";
  }

  if (
    normalizedInterests.some((interest) =>
      /operating system/.test(interest)
    )
  ) {
    return "Operating Systems";
  }

  if (
    normalizedInterests.some((interest) =>
      /programming|data structure|computer science|software|web development/.test(
        interest
      )
    )
  ) {
    return "Data Structures";
  }

  return "Data Structures";
};

// ========================================
// QUIZ COMPONENT
// ========================================

function Quiz() {
  // Student profile
  const [student, setStudent] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Quiz settings
  const [subject, setSubject] = useState("Data Structures");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  // ========================================
  // FETCH LOGGED-IN STUDENT PROFILE
  // ========================================

  useEffect(() => {
    const fetchStudentProfile = async () => {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        setProfileError("Please sign in to view your personalized quiz.");
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await fetch(
          `http://localhost:3000/api/student/${encodeURIComponent(studentId)}`
        );

        if (!response.ok) {
          throw new Error("Unable to load your student profile.");
        }

        const data = await response.json();

        if (!data.success || !data.student) {
          throw new Error("Student profile was not found.");
        }

        const currentStudent = data.student;

        setStudent(currentStudent);

        const interests = Array.isArray(currentStudent.interests)
          ? currentStudent.interests
          : [];

        const level =
          currentStudent.level ||
          currentStudent.profile?.level ||
          currentStudent.learningPreferences?.difficulty;

        setSubject(getSuggestedSubject(interests));
        setDifficulty(getSuggestedDifficulty(level));
      } catch (error) {
        console.error("Quiz profile loading error:", error);
        setProfileError(
          error.message || "Something went wrong while loading your profile."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  // ========================================
  // PERSONALIZED PROFILE DATA
  // ========================================

  const interests = Array.isArray(student?.interests)
    ? student.interests
    : [];

  const preferredStyles = Array.isArray(
    student?.learningPreferences?.preferredStyle
  )
    ? student.learningPreferences.preferredStyle
    : [];

  const studentName = student?.profile?.name || "Learner";

  const studentLevel =
    student?.level ||
    student?.profile?.level ||
    "Learner";

  // Only show subjects supported by the current question bank.
  const availableSubjects = useMemo(() => {
    return [...new Set(quizQuestions.map((question) => question.subject))];
  }, []);

  const filteredQuestions = useMemo(() => {
    return quizQuestions.filter((question) => question.subject === subject);
  }, [subject]);

  // ========================================
  // START QUIZ
  // ========================================

  const startQuiz = () => {
    const questionsForQuiz = filteredQuestions.slice(0, questionCount);

    if (questionsForQuiz.length === 0) {
      return;
    }

    setActiveQuestions(questionsForQuiz);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  // ========================================
  // SELECT ANSWER
  // ========================================

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    const question = activeQuestions[currentQuestion];

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setScore((previous) => previous + 1);
    }
  };

  // ========================================
  // NEXT QUESTION
  // ========================================

  const nextQuestion = () => {
    if (currentQuestion === activeQuestions.length - 1) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer(null);
  };

  // ========================================
  // RESTART QUIZ
  // ========================================

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setActiveQuestions([]);
  };

  // ========================================
  // PROFILE LOADING SCREEN
  // ========================================

  if (profileLoading) {
    return (
      <main className="quiz-page">
        <section className="quiz-result-section">
          <div className="quiz-container">
            <div className="quiz-result-card">
              <span className="quiz-result-eyebrow">
                ✦ PERSONALIZED PRACTICE
              </span>

              <h2>Preparing your quiz...</h2>

              <p>
                We’re loading your interests and learning preferences.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ========================================
  // PROFILE ERROR SCREEN
  // ========================================

  if (profileError) {
    return (
      <main className="quiz-page">
        <section className="quiz-result-section">
          <div className="quiz-container">
            <div className="quiz-result-card">
              <span className="quiz-result-eyebrow">
                ✦ PERSONALIZED PRACTICE
              </span>

              <h2>Let’s get you started</h2>

              <p>{profileError}</p>

              <Link to="/login" className="ask-tutor-btn">
                Sign in <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ========================================
  // SETUP SCREEN
  // ========================================

  if (!quizStarted) {
    return (
      <main className="quiz-page">
        {/* HERO */}
        <section className="quiz-hero">
          <div className="quiz-container quiz-hero-inner">
            <div className="quiz-hero-content">
              <span className="quiz-eyebrow">
                ✦ PERSONALIZED PRACTICE
              </span>

              <h1>
                Ready to practice,
                <span> {studentName}.</span>
              </h1>

              <p>
                Your quiz is tailored to your learning level and interests.
                Choose what you want to practice and challenge yourself
                at your own pace.
              </p>

              <div className="quiz-personalized-tags">
                <span>{studentLevel} learner</span>
                <span>{difficulty} suggested difficulty</span>
              </div>
            </div>

            <div className="quiz-hero-visual">
              <div className="quiz-floating-card card-one">
                🧠
                <span>Test your knowledge</span>
              </div>

              <div className="quiz-big-icon">🧩</div>

              <div className="quiz-floating-card card-two">
                ✓
                <span>Track your progress</span>
              </div>
            </div>
          </div>
        </section>

        {/* QUIZ SETUP */}
        <section className="quiz-setup-section">
          <div className="quiz-container">
            <div className="quiz-setup-card">
              <div className="quiz-setup-heading">
                <span>CREATE YOUR QUIZ</span>

                <h2>What do you want to practice?</h2>

                <p>Customize your quiz before you begin.</p>
              </div>

              {/* PERSONALIZATION SUMMARY */}
              <div className="quiz-personalization-note">
                <div>
                  <strong>Made for your learning profile</strong>

                  <p>
                    {interests.length > 0
                      ? `Your interests: ${interests.join(", ")}`
                      : "Add interests to your profile for more personalized quiz suggestions."}
                  </p>
                </div>

                {preferredStyles.length > 0 && (
                  <div className="quiz-preference-tags">
                    <span>Your preferred learning styles</span>

                    {preferredStyles.map((style) => (
                      <span className="quiz-preference-chip" key={style}>
                        {style}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SUBJECT */}
              <div className="quiz-setting">
                <label>Subject</label>

                <div className="quiz-options">
                  {availableSubjects.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={subject === item ? "selected" : ""}
                      onClick={() => setSubject(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <p className="quiz-availability-note">
                  Suggested for you: {getSuggestedSubject(interests)}.
                  You can choose any available subject.
                </p>
              </div>

              {/* DIFFICULTY */}
              <div className="quiz-setting">
                <label>Difficulty</label>

                <div className="quiz-options small">
                  {["Easy", "Medium", "Hard"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={difficulty === item ? "selected" : ""}
                      onClick={() => setDifficulty(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <p className="quiz-availability-note">
                  Suggested based on your profile level:{" "}
                  {getSuggestedDifficulty(studentLevel)}.
                </p>
              </div>

              {/* QUESTION COUNT */}
              <div className="quiz-setting">
                <label>Number of questions</label>

                <div className="quiz-options small">
                  {[5, 10, 20].map((number) => (
                    <button
                      key={number}
                      type="button"
                      className={questionCount === number ? "selected" : ""}
                      onClick={() => setQuestionCount(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <p className="quiz-availability-note">
                  Currently, {filteredQuestions.length} question
                  {filteredQuestions.length === 1 ? " is" : "s are"} available
                  for {subject}. The quiz will use the available questions
                  until a larger question bank is added.
                </p>
              </div>

              {/* START */}
              <div className="quiz-start-area">
                <div>
                  <span>READY?</span>

                  <strong>
                    {subject} · {difficulty}
                  </strong>
                </div>

                <button
                  type="button"
                  className="start-quiz-btn"
                  onClick={startQuiz}
                  disabled={filteredQuestions.length === 0}
                >
                  Start quiz
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="quiz-benefits-section">
          <div className="quiz-container">
            <div className="quiz-benefits-grid">
              <div>
                <span>✦</span>
                <h3>Practice instantly</h3>
                <p>Test your understanding whenever you're ready.</p>
              </div>

              <div>
                <span>🧠</span>
                <h3>Find weak areas</h3>
                <p>Discover which concepts need more attention.</p>
              </div>

              <div>
                <span>🤖</span>
                <h3>Learn from mistakes</h3>
                <p>Ask TutorAI to explain anything you got wrong.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ========================================
  // RESULTS SCREEN
  // ========================================

  if (quizFinished) {
    const percentage =
      activeQuestions.length > 0
        ? Math.round((score / activeQuestions.length) * 100)
        : 0;

    return (
      <main className="quiz-page">
        <section className="quiz-result-section">
          <div className="quiz-container">
            <div className="quiz-result-card">
              <span className="quiz-result-eyebrow">
                ✦ QUIZ COMPLETE
              </span>

              <div className="result-icon">
                {percentage >= 70 ? "🎉" : "💪"}
              </div>

              <h1>
                {percentage >= 70
                  ? "Great work!"
                  : "Keep practicing!"}
              </h1>

              <p>
                You completed your {subject} quiz at {difficulty} difficulty.
              </p>

              <div className="score-circle">
                <div>
                  <strong>{percentage}%</strong>
                  <span>
                    {score} / {activeQuestions.length}
                  </span>
                </div>
              </div>

              <div className="result-message">
                {percentage >= 80 ? (
                  <>
                    <strong>You're doing really well.</strong>
                    <span>
                      Your understanding is strong. Keep challenging yourself.
                    </span>
                  </>
                ) : (
                  <>
                    <strong>A little more practice will help.</strong>
                    <span>
                      Review the concepts you missed before moving forward.
                    </span>
                  </>
                )}
              </div>

              <div className="result-actions">
                <button
                  type="button"
                  className="retry-btn"
                  onClick={restartQuiz}
                >
                  Try again
                </button>

                <Link to="/tutor" className="ask-tutor-btn">
                  Ask TutorAI about my mistakes
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ========================================
  // ACTIVE QUIZ
  // ========================================

  const question = activeQuestions[currentQuestion];

  if (!question) {
    return (
      <main className="quiz-page">
        <section className="quiz-result-section">
          <div className="quiz-container">
            <div className="quiz-result-card">
              <h2>No questions available</h2>
              <p>Please return to the setup screen and choose another subject.</p>

              <button
                type="button"
                className="retry-btn"
                onClick={restartQuiz}
              >
                Back to quiz setup
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const progress =
    ((currentQuestion + 1) / activeQuestions.length) * 100;

  return (
    <main className="quiz-page">
      <section className="active-quiz-section">
        <div className="quiz-container">
          {/* HEADER */}
          <div className="active-quiz-header">
            <button
              type="button"
              className="quiz-back-button"
              onClick={restartQuiz}
            >
              ← Quiz setup
            </button>

            <span>{subject}</span>

            <strong>
              {currentQuestion + 1} / {activeQuestions.length}
            </strong>
          </div>

          {/* PROGRESS */}
          <div className="question-progress">
            <span style={{ width: `${progress}%` }} />
          </div>

          {/* QUESTION CARD */}
          <div className="question-card">
            <span className="question-topic">{question.topic}</span>

            <h1>{question.question}</h1>

            <div className="answer-options">
              {question.options.map((option, index) => {
                let stateClass = "";

                if (selectedAnswer !== null) {
                  if (option === question.answer) {
                    stateClass = "correct";
                  } else if (option === selectedAnswer) {
                    stateClass = "wrong";
                  }
                }

                return (
                  <button
                    type="button"
                    key={option}
                    className={`answer-option ${stateClass}`}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span>{option}</span>

                    {selectedAnswer !== null &&
                      option === question.answer && (
                        <span className="answer-icon">✓</span>
                      )}

                    {selectedAnswer !== null &&
                      option === selectedAnswer &&
                      option !== question.answer && (
                        <span className="answer-icon">×</span>
                      )}
                  </button>
                );
              })}
            </div>

            {/* FEEDBACK */}
            {selectedAnswer !== null && (
              <div
                className={
                  selectedAnswer === question.answer
                    ? "answer-feedback correct-feedback"
                    : "answer-feedback wrong-feedback"
                }
              >
                <strong>
                  {selectedAnswer === question.answer
                    ? "✓ Correct!"
                    : "Not quite!"}
                </strong>

                <span>
                  {selectedAnswer === question.answer
                    ? "Great understanding. Keep going!"
                    : `The correct answer is ${question.answer}.`}
                </span>
              </div>
            )}

            {/* NEXT */}
            <div className="question-footer">
              <span>
                {selectedAnswer !== null
                  ? "Answer selected"
                  : "Choose an answer"}
              </span>

              <button
                type="button"
                className="next-question-btn"
                disabled={selectedAnswer === null}
                onClick={nextQuestion}
              >
                {currentQuestion === activeQuestions.length - 1
                  ? "Finish quiz"
                  : "Next question"}

                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Quiz;