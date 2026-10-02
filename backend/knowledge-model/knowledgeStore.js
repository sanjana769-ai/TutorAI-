const {
    getStudent,
    updateConcept
} = require("../student-model/studentStore");


// ========================================
// CREATE / REGISTER A CONCEPT
// ========================================

function registerConcept(studentId, conceptName, data = {}) {

    const student = getStudent(studentId);

    if (!student) {
        throw new Error("Student not found.");
    }

    const existingConcept = student.concepts[conceptName] || {};

    const concept = {

        subject: data.subject || existingConcept.subject || "Unknown",

        parent: data.parent || existingConcept.parent || null,

        status: data.status || existingConcept.status || "unknown",

        mastery: data.mastery ?? existingConcept.mastery ?? 0,

        confidence:
            data.confidence ||
            existingConcept.confidence ||
            "unknown",

        attempts:
            data.attempts ??
            existingConcept.attempts ??
            0,

        strengths:
            data.strengths ||
            existingConcept.strengths ||
            [],

        weaknesses:
            data.weaknesses ||
            existingConcept.weaknesses ||
            [],

        misconceptions:
            data.misconceptions ||
            existingConcept.misconceptions ||
            [],

        lastUpdated: new Date().toISOString()
    };


    updateConcept(
        studentId,
        conceptName,
        concept
    );


    return concept;
}


// ========================================
// GET A CONCEPT
// ========================================

function getConcept(studentId, conceptName) {

    const student = getStudent(studentId);

    if (!student) {
        throw new Error("Student not found.");
    }

    return student.concepts[conceptName] || null;
}


// ========================================
// UPDATE MASTERY
// ========================================

function updateMastery(
    studentId,
    conceptName,
    mastery
) {

    const concept = getConcept(
        studentId,
        conceptName
    );

    if (!concept) {

        return registerConcept(
            studentId,
            conceptName,
            {
                mastery
            }
        );

    }


    concept.mastery = Math.max(
        0,
        Math.min(100, mastery)
    );

    concept.status =
        concept.mastery >= 80
            ? "mastered"
            : concept.mastery >= 40
                ? "learning"
                : "weak";

    concept.lastUpdated =
        new Date().toISOString();


    updateConcept(
        studentId,
        conceptName,
        concept
    );


    return concept;
}


// ========================================
// RECORD AN ATTEMPT
// ========================================

function recordAttempt(studentId, conceptName, isCorrect) {
  const existingConcept = getConcept(studentId, conceptName) || {};

  const attempts = (existingConcept.attempts || 0) + 1;

  const correctAttempts =
    (existingConcept.correctAttempts || 0) + (isCorrect ? 1 : 0);

  const mastery = Math.round((correctAttempts / attempts) * 100);

  const status =
    mastery >= 80 ? "mastered" :
    mastery >= 40 ? "learning" :
    "weak";

  const updatedConcept = {
    ...existingConcept,
    attempts,
    correctAttempts,
    mastery,
    status,
    lastCorrect: isCorrect,
    lastUpdated: new Date().toISOString()
  };

  updateConcept(studentId, conceptName, updatedConcept);

  return updatedConcept;
}


// ========================================
// EXPORT
// ========================================

module.exports = {

    registerConcept,
    getConcept,
    updateMastery,
    recordAttempt

};