// ========================================
// CONCEPT DETECTOR
// ========================================

function detectConcept(message) {

    const text = message.toLowerCase();

    if (text.includes("dbscan")) {
        return "DBSCAN";
    }

    if (text.includes("k-means") || text.includes("k means")) {
        return "K-Means";
    }

    if (
        text.includes("hierarchical clustering") ||
        text.includes("hierarchical")
    ) {
        return "Hierarchical Clustering";
    }

    return null;
}


module.exports = {
    detectConcept
};