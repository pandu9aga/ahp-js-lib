// ahp.js
function normalizeMatrix(matrix) {
    const size = matrix.length;
    const colSums = Array(size).fill(0);

    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            colSums[j] += matrix[i][j];
        }
    }

    return matrix.map(row => row.map((val, j) => val / colSums[j]));
}

function calculatePriorities(normMatrix) {
    const size = normMatrix.length;
    return normMatrix.map(row => {
        const sum = row.reduce((acc, v) => acc + v, 0);
        return sum / size;
    });
}

function processNode(node, parentWeight = 1.0) {
    let result = [];

    if (!node.children || node.children.length === 0) {
        result.push({
            name: node.name,
            weight: parseFloat(parentWeight.toFixed(6))
        });
        return result;
    }

    const children = node.children;
    const comparisons = node.comparisons;

    if (!comparisons || comparisons.length !== children.length) {
        throw new Error(`Node "${node.name}" missing or invalid comparisons`);
    }

    const normMatrix = normalizeMatrix(comparisons);
    const localWeights = calculatePriorities(normMatrix);

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childWeight = parentWeight * localWeights[i];
        const childResult = processNode(child, childWeight);
        result = result.concat(childResult);
    }

    return result;
}

function processAHP(input) {
    if (!input || !input.comparisons || !input.children) {
        throw new Error("Invalid AHP input");
    }

    const results = processNode(input);
    results.sort((a, b) => b.weight - a.weight);
    return {
        priorities: results
    };
}

// Export agar bisa dipakai di Node.js (optional untuk frontend)
if (typeof module !== "undefined") {
    module.exports = {
        processAHP
    };
}