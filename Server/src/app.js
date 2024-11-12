const express = require('express');
const app = express();
const cors = require('cors');
const { ref, get, child } = require('firebase/database');
const { db } = require('./firebaseConnect');
const { findOptimizedPickupPath } = require('./pathOptimization');

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://iot-dustbin-management-system-default-rtdb.firebaseio.com'],
    credentials: true,
}));

async function getSensorData() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, 'sensor_data'));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error getting sensor data:', error);
    }
}
app.get('/optimize-path', async (req, res) => {
  try {
    // Call your path optimization logic here
    const optimizedPath = await findOptimizedPickupPath();
    res.json({ path: optimizedPath });
  } catch (error) {
    console.error('Error calculating optimized path:', error);
    res.status(500).json({ error: 'Failed to calculate optimized path' });
  }
});

app.get('/', async (req, res) => {
  // res.send('Backend is working!');
    const dustbins_sensor_data = await getSensorData();
    res.json({ data: dustbins_sensor_data });
});

  

module.exports = app;
