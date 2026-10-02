function createLessonPlan(message) {

  const text = message.toLowerCase();

  // -------------------------------
  // MAGNETIC FORCE
  // -------------------------------

  if (
    text.includes("magnetic force") ||
    text.includes("magnetic field") ||
    text.includes("magnet")
  ) {

    return {

      id: "magnetic-force",

      topic: "Magnetic Force",

      subject: "Physics",

      level: "Beginner",

      explanation: {

        simple:
          "A magnetic force can act on a moving charged particle inside a magnetic field.",

        detailed:
          "The magnetic force depends on the charge, its velocity, the magnetic field and the angle between them.",

        realWorld:
          "Magnetic forces are used in electric motors, generators, speakers and many other technologies."

      },

      visual: {

        type: "physics",

        scene: "magnetic-force",

        objects: [
          "magnet",
          "magnetic-field",
          "charged-particle",
          "force-vector"
        ],

        relationships: [
          "magnet creates magnetic field",
          "charged particle moves through field",
          "magnetic field produces force"
        ],

        interactions: [
          "change-field-strength",
          "move-particle",
          "pause-simulation"
        ]

      },

      steps: [

        "Introduce the magnetic field",

        "Show the moving charged particle",

        "Show the force acting on the particle",

        "Allow the student to manipulate the simulation"

      ],

      quiz: [

        {
          question:
            "What type of particle can experience magnetic force?",

          answer:
            "A moving charged particle."
        }

      ]

    };
  }


  // -------------------------------
  // TCP HANDSHAKE
  // -------------------------------

  if (
    text.includes("tcp") ||
    text.includes("three way handshake")
  ) {

    return {

      id: "tcp-handshake",

      topic: "TCP Three-Way Handshake",

      subject: "Computer Networks",

      level: "Beginner",

      explanation: {

        simple:
          "TCP uses three messages to establish a reliable connection between two devices.",

        detailed:
          "The client sends SYN, the server responds with SYN-ACK, and the client completes the connection with ACK.",

        realWorld:
          "This process happens when applications establish reliable TCP connections over networks."

      },

      visual: {

        type: "network",

        scene: "tcp-handshake",

        objects: [
          "client",
          "server",
          "syn",
          "syn-ack",
          "ack"
        ],

        relationships: [
          "client communicates with server",
          "server acknowledges client",
          "client confirms connection"
        ],

        interactions: [
          "play-sequence",
          "pause-sequence",
          "step-forward"
        ]

      },

      steps: [

        "Client sends SYN",

        "Server responds with SYN-ACK",

        "Client sends ACK",

        "TCP connection becomes established"

      ],

      quiz: []

    };
  }


  // -------------------------------
  // FALLBACK
  // -------------------------------

  return {

    id: "generic",

    topic: message,

    subject: "Unknown",

    level: "Adaptive",

    explanation: {

      simple:
        "TutorAI is breaking this concept into understandable pieces.",

      detailed:
        "",

      realWorld:
        ""

    },

    visual: {

      type: "generic",

      scene: "concept",

      objects: [],

      relationships: [],

      interactions: []

    },

    steps: [

      "Understand the concept",

      "Break it into smaller ideas",

      "Create a visual representation",

      "Check understanding"

    ],

    quiz: []

  };
}


module.exports = createLessonPlan;