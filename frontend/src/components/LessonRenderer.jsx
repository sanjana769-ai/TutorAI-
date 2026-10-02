import { useEffect, useState } from "react";

function MagneticForceScene() {
  const [strength, setStrength] = useState(60);
  const [distance, setDistance] = useState(50);
  const [running, setRunning] = useState(true);

  const fieldOpacity = Math.max(0.18, strength / 100);
  const particleSpeed = Math.max(0.8, strength / 35);

  return (
    <div className="lesson-visual-card">

      {/* HEADER */}

      <div className="lesson-visual-header">

        <div>
          <span className="lesson-visual-eyebrow">
            ✦ INTERACTIVE PHYSICS
          </span>

          <h2>
            See magnetic force
            <span>in action.</span>
          </h2>

          <p>
            Instead of memorising the definition,
            watch how a magnetic field influences a moving charge.
          </p>
        </div>

        <div className="lesson-live-badge">
          <span></span>
          LIVE
        </div>

      </div>


      {/* VISUAL WORLD */}

      <div className="magnetic-world">

        <div className="magnetic-grid"></div>


        {/* FIELD LINES */}

        <div
          className="field-orbit field-orbit-1"
          style={{ opacity: fieldOpacity }}
        />

        <div
          className="field-orbit field-orbit-2"
          style={{ opacity: fieldOpacity * 0.8 }}
        />

        <div
          className="field-orbit field-orbit-3"
          style={{ opacity: fieldOpacity * 0.6 }}
        />


        {/* MAGNET */}

        <div className="magnet magnet-left">

          <div className="magnet-half magnet-n">
            N
          </div>

          <div className="magnet-half magnet-s">
            S
          </div>

        </div>


        {/* MAGNETIC FIELD LABEL */}

        <div className="magnetic-label field-label">
          Magnetic field
        </div>


        {/* PARTICLE */}

        <div
          className={`charged-particle ${
            running ? "particle-moving" : ""
          }`}
          style={{
            animationDuration: `${3 / particleSpeed}s`,
            left: `${distance}%`,
          }}
        >
          <span>+</span>
        </div>


        {/* FORCE ARROW */}

        <div
          className="force-vector"
          style={{
            left: `${Math.min(distance + 5, 82)}%`,
          }}
        >
          <span>F</span>
          <div className="force-line"></div>
          <div className="force-arrow"></div>
        </div>


        {/* PARTICLE LABEL */}

        <div
          className="magnetic-label particle-label"
          style={{
            left: `${Math.min(distance - 5, 78)}%`,
          }}
        >
          Moving charge
        </div>


        {/* FIELD DIRECTION */}

        <div className="field-direction">
          B →
        </div>

      </div>


      {/* CONTROLS */}

      <div className="magnetic-controls">

        <div className="magnetic-control">

          <div className="magnetic-control-top">
            <span>Magnetic field strength</span>
            <strong>{strength}%</strong>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            value={strength}
            onChange={(event) =>
              setStrength(Number(event.target.value))
            }
          />

        </div>


        <div className="magnetic-control">

          <div className="magnetic-control-top">
            <span>Particle position</span>
            <strong>{distance}%</strong>
          </div>

          <input
            type="range"
            min="35"
            max="75"
            value={distance}
            onChange={(event) =>
              setDistance(Number(event.target.value))
            }
          />

        </div>


        <button
          className="simulation-toggle"
          onClick={() => setRunning((value) => !value)}
        >
          {running ? "Ⅱ Pause simulation" : "▶ Play simulation"}
        </button>

      </div>


      {/* EXPLANATION */}

      <div className="lesson-explanation-grid">

        <div className="lesson-explanation-card">

          <span>01</span>

          <div>
            <strong>Magnetic field</strong>

            <p>
              A magnet creates a region around it where
              magnetic effects can act on other moving charges.
            </p>
          </div>

        </div>


        <div className="lesson-explanation-card">

          <span>02</span>

          <div>
            <strong>Moving charge</strong>

            <p>
              A charged particle moving through a magnetic
              field can experience a magnetic force.
            </p>
          </div>

        </div>


        <div className="lesson-explanation-card">

          <span>03</span>

          <div>
            <strong>Force direction</strong>

            <p>
              The force depends on the particle's motion,
              charge, and magnetic field direction.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   LESSON RENDERER
   ========================================================= */

function LessonRenderer({ lesson }) {

  if (!lesson) {
    return null;
  }


  if (lesson.visualType === "magnetic-force") {

    return <MagneticForceScene />;

  }


  return (

    <div className="lesson-placeholder">

      <span>✦</span>

      <h3>
        Visual lesson engine ready.
      </h3>

      <p>
        TutorAI identified this as a
        <strong> {lesson.subject} </strong>
        concept.
        A specialised visual renderer will be generated next.
      </p>

    </div>

  );
}

export default LessonRenderer;