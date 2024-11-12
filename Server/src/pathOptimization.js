const { ref, get, child } = require('firebase/database');
const { db } = require('./firebaseConnect');  // Import the database connection

// Fetch the sensor data from the Firebase database
async function getSensorData() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, 'sensor_data'));
        if (snapshot.exists()) {
           
            return snapshot.val();  // Return the sensor data
            
        } else {
            console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error getting sensor data:', error);
    }
}

// Node and Edge Definitions
const edges = [
    { from: "start", to: "A", distance: 10 },
    { from: "start", to: "B", distance: 15 },
    { from: "start", to: "C", distance: 20 },
    { from: "A", to: "B", distance: 35 },
    { from: "A", to: "C", distance: 25 },
    { from: "A", to: "D", distance: 30 },
    { from: "B", to: "D", distance: 20 },
    { from: "C", to: "D", distance: 15 },
    { from: "C", to: "B", distance: 10 },
];

const FILL_THRESHOLD = 60;

// Filter nodes based on the fill threshold
function filterNodesAboveThreshold(nodes, threshold) {
    return nodes.filter(node => node.fill > threshold).map(node => node.id);
}

// Create the adjacency list from the edges
function createAdjacencyList(edges) {
    const graph = {};
    edges.forEach(({ from, to, distance }) => {
        if (!graph[from]) graph[from] = [];
        if (!graph[to]) graph[to] = [];
        graph[from].push({ to, distance });
        graph[to].push({ to: from, distance });  
    });
    return graph;
}

// Find the minimum cost path using the Traveling Salesman Problem (TSP) approach
function findMinCostPath(graph, start, requiredNodes) {
    const visited = new Set();
    const path = [];
    let minCost = Infinity;

    function tsp(currentNode, currentCost, depth) {
        if (depth === requiredNodes.length && graph[currentNode].some(edge => edge.to === start)) {
            const returnEdge = graph[currentNode].find(edge => edge.to === start);
            const totalCost = currentCost + returnEdge.distance;
            if (totalCost < minCost) {
                minCost = totalCost;
                path.length = 0;
                path.push(...visited);
            }
            return;
        }

        for (const edge of graph[currentNode]) {
            if (!visited.has(edge.to)) {
                visited.add(edge.to);
                tsp(edge.to, currentCost + edge.distance, depth + (requiredNodes.includes(edge.to) ? 1 : 0));
                visited.delete(edge.to);
            }
        }
    }
    visited.add(start);
    tsp(start, 0, 0);
    return { path: [start, ...path, start], cost: minCost };
}
// Main function to get optimized pickup path
async function findOptimizedPickupPath() {
    const sensorData = await getSensorData();  // Fetch sensor data from Firebase
    console.log("Sensor Data:", sensorData);

    if (!sensorData) {
        console.log("No sensor data available.");
        return { path: [], cost: 0 };
    }

    // Prepare nodes from the fetched sensor data
    const nodes = Object.keys(sensorData).map(key => ({
        id: key.replace('fill_', ''),  // Removing 'fill_' prefix to get the node name (A, B, C, D)
        fill: sensorData[key]  // Directly using the value from the sensor data
    }));

    console.log("Nodes:", nodes);  // Print the nodes to check the processed data
    const requiredNodes = filterNodesAboveThreshold(nodes, FILL_THRESHOLD);
    console.log("Required Nodes:", requiredNodes);  // Print the nodes above the threshold

    const graph = createAdjacencyList(edges);

    if (requiredNodes.length === 0) {
        console.log("No nodes require pickup.");
        return { path: [], cost: 0 };
    }
    const { path, cost } = findMinCostPath(graph, "start", requiredNodes);
    return { path, cost };
}

module.exports = { findOptimizedPickupPath };
