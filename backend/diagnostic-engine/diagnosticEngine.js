const { getStudent } = require("../student-model/studentStore");
const { getConcept } = require("../knowledge-model/knowledgeStore");


// ========================================
// PREREQUISITE MAP
// ========================================

const prerequisiteMap = {

    "K-Means": [
        "Clustering",
        "Distance"
    ],

    "DBSCAN": [
        "Clustering",
        "Distance",
        "Density"
    ],

    "Hierarchical Clustering": [
        "Clustering",
        "Distance"
    ]

};


// ========================================
// GET PREREQUISITES
// ========================================

function getPrerequisites(conceptName) {

    return prerequisiteMap[conceptName] || [];

}


// ========================================
// DIAGNOSE STUDENT
// ========================================

function diagnoseStudent(studentId, targetConcept) {

    const student = getStudent(studentId);

    if (!student) {
        throw new Error("Student not found.");
    }


    const prerequisites =
        getPrerequisites(targetConcept);


    const known = [];
    const weak = [];
    const unknown = [];


    for (const prerequisite of prerequisites) {

        const concept =
            getConcept(studentId, prerequisite);


        if (!concept) {

            unknown.push(prerequisite);

            continue;
        }


        if (concept.mastery >= 70) {

            known.push(prerequisite);

        } else {

            weak.push(prerequisite);

        }

    }


    let recommendation;


    if (unknown.length > 0) {

        recommendation =
            `Learn ${unknown[0]} before starting ${targetConcept}.`;

    } else if (weak.length > 0) {

        recommendation =
            `Review ${weak[0]} before starting ${targetConcept}.`;

    } else {

        recommendation =
            `Student is ready to learn ${targetConcept}.`;

    }


    return {

        studentId,

        targetConcept,

        prerequisites,

        known,

        weak,

        unknown,

        ready:
            unknown.length === 0 &&
            weak.length === 0,

        recommendation

    };

}


// ========================================
// EXPORT
// ========================================

module.exports = {

    getPrerequisites,
    diagnoseStudent

};