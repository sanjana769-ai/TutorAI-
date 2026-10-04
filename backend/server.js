require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const OLLAMA_URL =
    process.env.OLLAMA_URL ||
    "http://localhost:11434/api/generate";

const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL ||
    "qwen2.5:3b";

const createLessonPlan = require("./lesson-engine/lessonPlanner");
const getVisualRenderer = require("./lesson-engine/visualRouter");

const {
    createStudent,
    getStudent,
    getAllStudents,
    updateStudent,
     setStudentPasswordHash,
    addInteraction
} = require("./student-model/studentStore");
const generateLesson = require("./tutorai");
const crypto = require("crypto");

const {
    registerConcept,
    getConcept,
    updateMastery,
    recordAttempt
} = require("./knowledge-model/knowledgeStore");

const {
    diagnoseStudent,
    getPrerequisites
} = require("./diagnostic-engine/diagnosticEngine");

const {
    detectConcept
} = require("./conceptDetector");


const app = express();

app.use(cors());
app.use(bodyParser.json());

// ========================================
// ADMIN AUTHENTICATION
// ========================================

// Temporary in-memory tokens for local development.
// Tokens expire after 2 hours and are cleared when the server restarts.
const adminTokens = new Map();

const ADMIN_TOKEN_DURATION = 2 * 60 * 60 * 1000;

function requireAdmin(req, res, next) {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Admin authentication required."
        });
    }

    const token = authorization.slice("Bearer ".length);
    const expiresAt = adminTokens.get(token);

    if (!expiresAt || expiresAt < Date.now()) {
        adminTokens.delete(token);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin session."
        });
    }

    next();
}


// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (
        !process.env.ADMIN_USERNAME ||
        !process.env.ADMIN_PASSWORD
    ) {
        return res.status(500).json({
            success: false,
            message: "Admin credentials are not configured."
        });
    }

    if (
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid admin username or password."
        });
    }

    const token = crypto.randomBytes(32).toString("hex");

    adminTokens.set(
        token,
        Date.now() + ADMIN_TOKEN_DURATION
    );

    return res.json({
        success: true,
        message: "Admin login successful.",
        token
    });
});


// GET STUDENT DATA — ADMIN ONLY
app.get("/api/admin/students", requireAdmin, (req, res) => {
    try {
        const students = getAllStudents();

        // Return only the fields needed by the admin dashboard.
        // Never send passwordHash or full interaction messages.
        const safeStudents = students.map((student) => ({
            id: student.id,
            name: student.profile?.name || "Student",
            avatar: student.profile?.avatar || null,
            level: student.level || "Not set",
            interests: student.interests || [],
            learningPreferences: student.learningPreferences || {},
            concepts: student.concepts || {},
            interactionCount: Array.isArray(student.interactions)
                ? student.interactions.length
                : 0,
            createdAt: student.createdAt || null,
            updatedAt: student.updatedAt || null
        }));

        return res.json({
            success: true,
            count: safeStudents.length,
            students: safeStudents
        });
    } catch (error) {
        console.error("Admin student retrieval error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not retrieve student data."
        });
    }
});



// SET STUDENT PASSWORD — ADMIN ONLY
app.put("/api/admin/students/:studentId/password", requireAdmin, (req, res) => {
    try {
        const { studentId } = req.params;
        const { password } = req.body;

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        const student = getStudent(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        setStudentPasswordHash(studentId, passwordHash);

        return res.json({
            success: true,
            message: "Student password set successfully."
        });

    } catch (error) {
        console.error("Student password setup error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not set student password."
        });
    }
});


// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "TutorAI backend is running."
    });

});


// ========================================
// STUDENT MODEL
// ========================================

// CREATE STUDENT

app.post("/api/student", (req, res) => {

    try {

        const { name } = req.body;

        const student = createStudent(
            name || "Student"
        );

        res.json({
            success: true,
            student
        });

    } catch (error) {

        console.error(
            "Student creation error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Could not create student.",
            details: error.message
        });

    }

});


// GET STUDENT
app.get("/api/student/:studentId", (req, res) => {
  try {
    const student = getStudent(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Exclude sensitive information before sending data to frontend
    const {
      passwordHash,
      ...safeStudent
    } = student;

    return res.json({
      success: true,
      student: safeStudent
    });

  } catch (error) {
    console.error("Get student error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student profile"
    });
  }
});

// ========================================
// SAVE STUDENT ONBOARDING PREFERENCES
// ========================================

app.post("/api/student/preferences", (req, res) => {
    try {
        const {
            studentId,
            interests,
            learningPreferences
        } = req.body;

        // Validate required fields
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: "Student ID is required."
            });
        }

        if (
            !Array.isArray(interests) ||
            interests.length === 0
        ) {
            return res.status(400).json({
                success: false,
                error: "Please select at least one interest."
            });
        }

        if (
            !learningPreferences ||
            !Array.isArray(learningPreferences.preferredStyle) ||
            learningPreferences.preferredStyle.length === 0
        ) {
            return res.status(400).json({
                success: false,
                error: "Please select a learning preference."
            });
        }

        const { preferredStyle, difficulty } = learningPreferences;

        const validDifficulties = [
            "beginner",
            "intermediate",
            "advanced",
            "adaptive"
        ];

        if (!validDifficulties.includes(difficulty)) {
            return res.status(400).json({
                success: false,
                error: "Invalid learning difficulty."
            });
        }

        // Find existing student
        const student = getStudent(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: "Student not found. Please login again."
            });
        }

        // Update student preferences
        const updatedStudent = updateStudent(studentId, {
            ...student,

            interests,

            level: difficulty,

            learningPreferences: {
                ...student.learningPreferences,
                preferredStyle,
                difficulty
            },

            onboardingCompleted: true
        });

        console.log(
            "Student preferences saved successfully:",
            studentId
        );

        return res.json({
            success: true,
            message: "Learning preferences saved successfully.",
            student: updatedStudent
        });

    } catch (error) {
        console.error(
            "Preference save error:",
            error
        );

        return res.status(500).json({
            success: false,
            error: "Could not save learning preferences.",
            details: error.message
        });
    }
});


// ========================================
// UPDATE STUDENT AVATAR
// ========================================

app.put("/api/student/:studentId/avatar", (req, res) => {
    try {
        const { avatar } = req.body;
        const { studentId } = req.params;

        if (!avatar || !["boy", "girl"].includes(avatar)) {
            return res.status(400).json({
                success: false,
                error: "Avatar must be either boy or girl."
            });
        }

        const student = getStudent(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: "Student not found."
            });
        }

        const updatedStudent = updateStudent(studentId, {
            profile: {
                ...student.profile,
                avatar
            }
        });

        res.json({
            success: true,
            message: "Avatar updated successfully.",
            student: updatedStudent
        });

    } catch (error) {
        console.error("Avatar update error:", error);

        res.status(500).json({
            success: false,
            error: "Could not update avatar.",
            details: error.message
        });
    }
});


// ========================================
// KNOWLEDGE MODEL
// ========================================

// REGISTER CONCEPT

app.post(
    "/api/knowledge/concept",
    (req, res) => {

        try {

            const {
                studentId,
                conceptName,
                subject,
                parent
            } = req.body;

            if (!studentId || !conceptName) {

                return res.status(400).json({
                    success: false,
                    error:
                        "studentId and conceptName are required."
                });

            }

            const concept = registerConcept(
                studentId,
                conceptName,
                {
                    subject,
                    parent,
                    status: "learning"
                }
            );

            res.json({
                success: true,
                concept
            });

        } catch (error) {

            console.error(
                "Concept registration error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Could not register concept.",
                details: error.message
            });

        }

    }
);


// GET CONCEPT

app.get(
    "/api/knowledge/:studentId/:conceptName",
    (req, res) => {

        try {

            const concept = getConcept(
                req.params.studentId,
                req.params.conceptName
            );

            if (!concept) {

                return res.status(404).json({
                    success: false,
                    error: "Concept not found."
                });

            }

            res.json({
                success: true,
                concept
            });

        } catch (error) {

            console.error(
                "Concept retrieval error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Could not retrieve concept.",
                details: error.message
            });

        }

    }
);


// UPDATE MASTERY

app.post(
    "/api/knowledge/mastery",
    (req, res) => {

        try {

            const {
                studentId,
                conceptName,
                mastery
            } = req.body;

            if (
                !studentId ||
                !conceptName ||
                mastery === undefined
            ) {

                return res.status(400).json({
                    success: false,
                    error:
                        "studentId, conceptName and mastery are required."
                });

            }

            const concept = updateMastery(
                studentId,
                conceptName,
                Number(mastery)
            );

            res.json({
                success: true,
                concept
            });

        } catch (error) {

            console.error(
                "Mastery update error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Could not update mastery.",
                details: error.message
            });

        }

    }
);


// ========================================
// DIAGNOSTIC ENGINE
// ========================================

app.get(
    "/api/diagnostic/:studentId/:targetConcept",
    (req, res) => {

        try {

            const result = diagnoseStudent(
                req.params.studentId,
                req.params.targetConcept
            );

            res.json({
                success: true,
                diagnostic: result
            });

        } catch (error) {

            console.error(
                "Diagnostic error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Could not diagnose student.",
                details: error.message
            });

        }

    }
);


// ========================================
// LESSON GENERATION
// ========================================

app.post(
    "/api/lesson",
    async (req, res) => {

        try {

            const {
                message,
                mode,
                studentId
            } = req.body;


            console.log(
                "Student question:",
                message
            );

            console.log(
                "Learning mode:",
                mode
            );


            if (!message) {

                return res.status(400).json({
                    success: false,
                    error: "Message is required."
                });

            }


           // ========================================
// DIAGNOSE BEFORE TEACHING
// ========================================

const targetConcept = detectConcept(message);

let diagnostic = null;

if (studentId && targetConcept) {

    diagnostic = diagnoseStudent(
        studentId,
        targetConcept
    );

    console.log(
        "Diagnostic result:",
        diagnostic
    );

}


// ========================================
// STOP IF PREREQUISITES ARE MISSING
// ========================================

if (
    diagnostic &&
    !diagnostic.ready
) {

    return res.json({

        success: true,

        type: "diagnostic",

        mode:
            mode || "Learn",

        diagnostic,

        message:
            diagnostic.recommendation

    });

}


// ========================================
// GENERATE LESSON
// ========================================

const studentContext = studentId
    ? getStudent(studentId)
    : null;

const lesson =
    await generateLesson(
        message,
        mode,
        studentContext,
        diagnostic
    );


            // ========================================
            // SAVE STUDENT INTERACTION
            // ========================================

            if (studentId) {

                const student =
                    getStudent(studentId);


                if (student) {

                    addInteraction(
                        studentId,
                        {
                            type: "lesson",
                            message,
                            mode: mode || "Learn",
                            topic: lesson.topic,
                            subject: lesson.subject
                        }
                    );

                }

            }


            // ========================================
            // VISUAL RENDERER
            // ========================================

            const renderer =
                getVisualRenderer(lesson);


            console.log(
                "Lesson generated:",
                lesson.topic
            );

            console.log(
                "Renderer:",
                renderer
            );


            // ========================================
            // RESPONSE
            // ========================================

            res.json({

                success: true,

                mode:
                    mode || "Learn",

                renderer,

                lesson

            });


        } catch (error) {

            console.error(
                "Lesson generation error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "TutorAI could not generate the lesson.",

                details:
                    error.message

            });

        }

    }
);

// ========================================
// FAST AI CHAT
// ========================================

app.post(
    "/api/chat",
    async (req, res) => {

        try {

            const {
                message,
                mode,
                studentId
            } = req.body;

            if (!message) {

                return res.status(400).json({
                    success: false,
                    error: "Message is required."
                });

            }

            console.log("----------------------------------");
            console.log("Fast TutorAI question:", message);
            console.log("Learning mode:", mode || "Learn");

            const student =
                studentId
                    ? getStudent(studentId)
                    : null;

            const studentLevel =
                student?.level || "beginner";

            const prompt = `
You are TutorAI, a friendly and adaptive personal AI tutor.

Your goal is to help students understand concepts clearly,
not merely provide short definitions.

STUDENT CONTEXT:
Student level: ${studentLevel}
Learning mode: ${mode || "Learn"}

STUDENT QUESTION:
${message}

QUESTION TYPE:
Identify whether the question asks for theory, a numerical solution,
a derivation, a proof, a comparison, revision, or programming help.

Adapt your answer to the question type.

For THEORY questions:
- Begin with a definition or introduction when relevant.
- Explain the concept in logical steps.
- Include characteristics, types, components, applications,
  advantages, limitations, or examples when relevant.
- Include exam-relevant points when requested.
- Use headings and bullet points where helpful.

For NUMERICAL problems:
- List the given values.
- State what must be calculated.
- Write the relevant formula.
- Explain why the formula applies.
- Substitute values and show calculations step by step.
- Include units wherever applicable.
- Clearly state the final answer.
- Do not invent missing values.
- Ask for clarification if essential information is missing.

For DERIVATIONS and PROOFS:
- State the result to be derived or proved.
- Identify relevant assumptions and formulas.
- Show the logical steps in order.
- Explain important transformations.
- Clearly state the final result.

For REVISION:
- Prioritize concise definitions, key points, formulas,
  and examples where useful.

For MATHEMATICAL CONTENT:
- Use LaTeX for mathematical expressions.
- Use single dollar signs for inline math, like $ \sqrt{25} = 5 $.
- Use double dollar signs for display equations, like:
  $$ \sqrt{25} = 5 $$
- Use $ \frac{a}{b} $ for fractions.
- Use $ \sqrt{x} $ for square roots.
- Use $ \sqrt[n]{x} $ for nth roots.
- Do not use \( ... \) or \[ ... \] delimiters.
- Do not put mathematical equations inside code blocks.
- Explain equations in student-friendly language.

GENERAL RULES:
- Match the explanation to the student's level and learning mode.
- Be accurate, relevant, and easy to follow.
- Use Markdown headings, numbered steps, and bullets when useful.
- Do not generate JSON in this chat response.
- Avoid unnecessary repetition.

IMPORTANT RESPONSE RULES:
- Answer the student's question accurately and directly.
- Use correct technical terminology and verify that each concept belongs to the correct category or layer.
- Do not invent protocols, features, or examples.
- Avoid repeating the same explanation in multiple sections.
- Use clear headings, concise explanations, and relevant examples.
- For questions asking for a specific number of items, explain every item and do not skip any.
- Finish with a brief summary.
- If unsure about a detail, state the uncertainty instead of guessing.
Answer the student's question directly.
`;


            
           
            // ========================================
            // CALL OLLAMA — FAST CHAT
            // ========================================

            console.log("TutorAI → Ollama");
            console.log("Model:", OLLAMA_MODEL);

            const startTime = Date.now();

            const response = await fetch(
                OLLAMA_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        model: OLLAMA_MODEL,
                        prompt: prompt,
                        stream: false,
                        keep_alive: "10m",
                        options: {
                            temperature: 0.2,
                            num_predict: 10000
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Ollama returned ${response.status}`
                );
            }

            const data = await response.json();

            const endTime = Date.now();

            console.log(
                `Fast AI generation time: ${(endTime - startTime) / 1000} seconds`
            );

            console.log(
                "Ollama token counts:",
                {
                    prompt_tokens: data.prompt_eval_count,
                    completion_tokens: data.eval_count,
                    total_tokens:
                        (data.prompt_eval_count || 0) +
                        (data.eval_count || 0)
                }
            );

            const reply = data.response?.trim();

            if (!reply) {
                throw new Error(
                    "Ollama returned an empty answer."
                );
            }

            console.log(
                "Fast answer generated successfully."
            );

            res.json({
                success: true,
                reply,
                mode: mode || "Learn"
            });

                    } catch (error) {
            console.error("Fast AI chat error:", error);

            return res.status(500).json({
                success: false,
                error: "TutorAI could not generate a response."
            });
        }
    }
);



app.post("/api/quiz/submit", (req, res) => {
  try {
    const { studentId, answers } = req.body;

    if (!studentId || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "studentId and answers array are required"
      });
    }

    const student = getStudent(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const fs = require("fs");
    const path = require("path");

    const questionsPath = path.join(
      __dirname,
      "data",
      "quizQuestions.json"
    );

    const questions = JSON.parse(
      fs.readFileSync(questionsPath, "utf8")
    );

    const questionMap = new Map(
      questions.map((question) => [question.id, question])
    );

    let score = 0;
    const results = [];

    for (const submittedAnswer of answers) {
      const question = questionMap.get(submittedAnswer.questionId);

      if (!question) {
        return res.status(400).json({
          success: false,
          message: `Invalid question ID: ${submittedAnswer.questionId}`
        });
      }

      const isCorrect = submittedAnswer.answer === question.answer;

      if (isCorrect) {
        score++;
      }

      const updatedConcept = recordAttempt(
        studentId,
        question.conceptName,
        isCorrect
      );

      results.push({
        questionId: question.id,
        conceptName: question.conceptName,
        isCorrect,
        correctAnswer: question.answer,
        mastery: updatedConcept.mastery,
        status: updatedConcept.status
      });
    }

    const totalQuestions = answers.length;
    const percentage = totalQuestions
      ? Math.round((score / totalQuestions) * 100)
      : 0;

    return res.json({
      success: true,
      score,
      totalQuestions,
      percentage,
      results
    });

  } catch (error) {
    console.error("Quiz submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz"
    });
  }
});



// ========================================
// STUDENT SIGNUP / REGISTRATION
// ========================================

app.post("/api/signup", (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required."
            });
        }

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        // Check whether email is already registered
        const existingStudent = getAllStudents().find(
            student =>
                student.email?.toLowerCase() === normalizedEmail
        );

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Create student record and generate Student ID
        const student = createStudent(normalizedName);

        // Hash password before saving it
        const passwordHash = bcrypt.hashSync(password, 10);

        // Save email and password hash
        const updatedStudent = updateStudent(student.id, {
            email: normalizedEmail,
            passwordHash
        });

        if (!updatedStudent) {
            return res.status(500).json({
                success: false,
                message: "Could not complete student registration."
            });
        }

        return res.status(201).json({
            success: true,
            message: "Account created successfully!",
            student: {
                id: updatedStudent.id,
                name: updatedStudent.profile.name,
                email: updatedStudent.email
            }
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
});


app.post("/api/login", (req, res) => {
  try {
    const { studentId, email, password } = req.body;

    if (!studentId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID, email and password are required."
      });
    }

    const student = getStudent(studentId);

    if (!student || !student.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or password."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

if (!student.email || student.email.toLowerCase() !== normalizedEmail) {
  return res.status(401).json({
    success: false,
    message: "Invalid Student ID, email, or password."
  });
}

    const validPassword = bcrypt.compareSync(
      password,
      student.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or password."
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      student: {
        id: student.id,
        profile: student.profile,
        level: student.level
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
});

// ========================================
// SERVER
// ========================================

const PORT = 3000;

app.listen(
    PORT,
    () => {

        console.log(
            "----------------------------------"
        );

        console.log(
            "TutorAI backend running on port " +
            PORT
        );

        console.log(
            "http://localhost:" +
            PORT
        );

        console.log(
            "----------------------------------"
        );

    }
);