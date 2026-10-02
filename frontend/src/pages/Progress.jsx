import { Link } from "react-router-dom";

function Progress() {
  const subjects = [
    {
      icon: "🧠",
      name: "Data Structures & Algorithms",
      completed: 8,
      total: 14,
      progress: 57,
      color: "purple",
    },
    {
      icon: "🗄️",
      name: "Database Management",
      completed: 6,
      total: 12,
      progress: 50,
      color: "blue",
    },
    {
      icon: "💻",
      name: "Operating Systems",
      completed: 5,
      total: 10,
      progress: 50,
      color: "green",
    },
    {
      icon: "🤖",
      name: "Artificial Intelligence",
      completed: 7,
      total: 15,
      progress: 47,
      color: "orange",
    },
  ];

  const topics = [
    {
      number: "01",
      title: "Arrays",
      status: "completed",
      description: "Fundamentals, operations and applications",
    },
    {
      number: "02",
      title: "Linked Lists",
      status: "completed",
      description: "Singly, doubly and circular linked lists",
    },
    {
      number: "03",
      title: "Stacks & Queues",
      status: "completed",
      description: "LIFO, FIFO and practical applications",
    },
    {
      number: "04",
      title: "Trees",
      status: "current",
      description: "Binary trees, traversal and BST",
    },
    {
      number: "05",
      title: "Graphs",
      status: "upcoming",
      description: "Graph representation and traversal",
    },
    {
      number: "06",
      title: "Dynamic Programming",
      status: "upcoming",
      description: "Optimization using overlapping subproblems",
    },
    {
      number: "07",
      title: "Backtracking",
      status: "upcoming",
      description: "Explore solutions through systematic search",
    },
  ];

  return (
    <main className="progress-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="progress-hero">

        <div className="progress-container progress-hero-inner">

          <div>

            <span className="progress-eyebrow">
              ✦ YOUR LEARNING JOURNEY
            </span>

            <h1>
              See how far
              <span>you've come.</span>
            </h1>

            <p>
              Track what you've mastered, what you're learning
              now, and everything waiting for you ahead.
            </p>

          </div>


          <div className="overall-progress-card">

            <div className="overall-progress-circle">

              <div>
                <strong>68%</strong>
                <span>overall</span>
              </div>

            </div>

            <div className="overall-progress-info">

              <strong>You're making progress.</strong>

              <span>
                26 of 51 topics completed
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUBJECT PROGRESS
      ===================================================== */}

      <section className="subject-progress-section">

        <div className="progress-container">

          <div className="progress-section-heading">

            <div>
              <span>SUBJECTS</span>

              <h2>
                Your knowledge map<span>.</span>
              </h2>
            </div>

            <p>
              Every topic you complete takes you one step
              closer to mastering the subject.
            </p>

          </div>


          <div className="subject-progress-grid">

            {subjects.map((subject) => (

              <div
                className={`subject-progress-card ${subject.color}`}
                key={subject.name}
              >

                <div className="subject-card-top">

                  <div className="subject-icon">
                    {subject.icon}
                  </div>

                  <span>
                    {subject.progress}%
                  </span>

                </div>


                <span className="subject-label">
                  SUBJECT
                </span>

                <h3>
                  {subject.name}
                </h3>


                <div className="subject-progress-info">

                  <span>
                    {subject.completed} of {subject.total} topics
                  </span>

                  <span>
                    {subject.progress}%
                  </span>

                </div>


                <div className="subject-progress-bar">
                  <span
                    style={{
                      width: `${subject.progress}%`,
                    }}
                  ></span>
                </div>


                <button className="view-subject-btn">
                  View topics
                  <span>→</span>
                </button>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          TOPIC ROADMAP
      ===================================================== */}

      <section className="topic-roadmap-section">

        <div className="progress-container">

          <div className="progress-section-heading roadmap-heading">

            <div>

              <span>DSA LEARNING PATH</span>

              <h2>
                Your next steps<span>.</span>
              </h2>

            </div>

            <Link to="/tutor">
              Learn with TutorAI →
            </Link>

          </div>


          <div className="topic-roadmap">

            {topics.map((topic, index) => (

              <div
                className={`topic-item ${topic.status}`}
                key={topic.title}
              >

                <div className="topic-line">

                  <div className="topic-number">
                    {topic.status === "completed"
                      ? "✓"
                      : topic.number}
                  </div>

                  {index !== topics.length - 1 && (
                    <div className="topic-connector"></div>
                  )}

                </div>


                <div className="topic-content">

                  <div className="topic-title-row">

                    <div>

                      <span className="topic-status">
                        {topic.status === "completed"
                          ? "COMPLETED"
                          : topic.status === "current"
                          ? "CURRENTLY LEARNING"
                          : "UP NEXT"}
                      </span>

                      <h3>
                        {topic.title}
                      </h3>

                    </div>


                    {topic.status === "current" && (
                      <Link
                        to="/tutor"
                        className="topic-continue-btn"
                      >
                        Continue →
                      </Link>
                    )}

                  </div>


                  <p>
                    {topic.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          RECOMMENDATIONS
      ===================================================== */}

      <section className="progress-recommendation-section">

        <div className="progress-container">

          <div className="recommendation-banner">

            <div className="recommendation-banner-icon">
              ✦
            </div>

            <div>

              <span>
                TUTORAI RECOMMENDS
              </span>

              <h2>
                Graphs should be your next topic.
              </h2>

              <p>
                You've completed Trees and have a strong
                foundation for understanding graph traversal.
              </p>

            </div>

            <Link to="/tutor">
              Start learning
              <span>→</span>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          MILESTONES
      ===================================================== */}

      <section className="milestones-section">

        <div className="progress-container">

          <div className="progress-section-heading">

            <div>

              <span>MILESTONES</span>

              <h2>
                Your learning wins<span>.</span>
              </h2>

            </div>

          </div>


          <div className="milestones-grid">

            <div className="milestone-card unlocked">

              <div>🔥</div>

              <span>7 DAY STREAK</span>

              <strong>
                Building momentum
              </strong>

            </div>


            <div className="milestone-card unlocked">

              <div>🧠</div>

              <span>10 CONCEPTS</span>

              <strong>
                Knowledge unlocked
              </strong>

            </div>


            <div className="milestone-card unlocked">

              <div>🎯</div>

              <span>90% SCORE</span>

              <strong>
                Quiz master
              </strong>

            </div>


            <div className="milestone-card locked">

              <div>🏆</div>

              <span>50 TOPICS</span>

              <strong>
                Keep learning
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="progress-bottom-cta">

        <div className="progress-container">

          <div>

            <span>
              ✦ KEEP GOING
            </span>

            <h2>
              There's always something
              <span>new to understand.</span>
            </h2>

            <p>
              Ask TutorAI about your next topic and keep
              building your knowledge.
            </p>

            <Link to="/tutor">
              Continue learning
              <span>→</span>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Progress;