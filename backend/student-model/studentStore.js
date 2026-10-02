const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "../data");
const dataFile = path.join(dataDirectory, "students.json");

// Make sure data directory exists
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
}

// Make sure students file exists
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
}


// ----------------------------------------
// INTERNAL HELPERS
// ----------------------------------------

function readStudents() {

    const data = fs.readFileSync(dataFile, "utf-8");

    return JSON.parse(data);

}


function saveStudents(students) {

    fs.writeFileSync(
        dataFile,
        JSON.stringify(students, null, 2)
    );

}


// ----------------------------------------
// GENERATE SHORT STUDENT ID
// ----------------------------------------

function generateStudentId(students) {

    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let studentId;

    do {

        let code = "";

        for (let i = 0; i < 5; i++) {
            code += characters[
                Math.floor(Math.random() * characters.length)
            ];
        }

        studentId = `STU${code}`;

    } while (students[studentId]);

    return studentId;

}


// ----------------------------------------
// CREATE STUDENT
// ----------------------------------------

function createStudent(name = "Student") {

    const students = readStudents();

    const studentId = generateStudentId(students);

    const student = {

        id: studentId,

        profile: {
            name,
            avatar: null
        },

        level: null,

        passwordHash: null,

        email: "",

        subjects: {},

        concepts: {},

        misconceptions: [],

        learningPreferences: {
            preferredStyle: null,
            difficulty: "adaptive"
        },

        interactions: [],

        history: [],

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString()

    };


    students[studentId] = student;

    saveStudents(students);

    return student;

}


// ----------------------------------------
// GET STUDENT
// ----------------------------------------

function getStudent(studentId) {

    const students = readStudents();

    return students[studentId] || null;

}

// ----------------------------------------
// GET ALL STUDENTS
// ----------------------------------------

function getAllStudents() {
    const students = readStudents();

    return Object.values(students);
}

// ----------------------------------------
// UPDATE STUDENT
// ----------------------------------------

function updateStudent(studentId, updates) {

    const students = readStudents();

    const student = students[studentId];

    if (!student) {
        return null;
    }

    students[studentId] = {

        ...student,

        ...updates,

        updatedAt: new Date().toISOString()

    };

    saveStudents(students);

    return students[studentId];

}


// ----------------------------------------
// SET STUDENT PASSWORD HASH
// ----------------------------------------

function setStudentPasswordHash(studentId, passwordHash) {
    return updateStudent(studentId, { passwordHash });
}


// ----------------------------------------
// ADD INTERACTION
// ----------------------------------------

function addInteraction(studentId, interaction) {

    const student = getStudent(studentId);

    if (!student) {
        return null;
    }

    student.interactions.push({

        ...interaction,

        timestamp: new Date().toISOString()

    });

    student.updatedAt = new Date().toISOString();

    const students = readStudents();

    students[studentId] = student;

    saveStudents(students);

    return student;

}


// ----------------------------------------
// UPDATE CONCEPT
// ----------------------------------------

function updateConcept(studentId, conceptName, conceptData) {

    const student = getStudent(studentId);

    if (!student) {
        return null;
    }

    student.concepts[conceptName] = {

        ...(student.concepts[conceptName] || {}),

        ...conceptData,

        updatedAt: new Date().toISOString()

    };

    student.updatedAt = new Date().toISOString();

    const students = readStudents();

    students[studentId] = student;

    saveStudents(students);

    return student;

}



function recordAttempt(studentId, conceptName) {
    const concept = getConcept(studentId, conceptName);

    if (!concept) {
        return registerConcept(studentId, conceptName, {
            attempts: 1,
            status: "learning"
        });
    }

    concept.attempts += 1;
    concept.lastUpdated = new Date().toISOString();

    updateConcept(studentId, conceptName, concept);
    return concept;
}


// ----------------------------------------
// EXPORTS
// ----------------------------------------

module.exports = {

    createStudent,

    getStudent,

    getAllStudents,

    updateStudent,

    setStudentPasswordHash,

    addInteraction,

    recordAttempt,
    
    updateConcept

};