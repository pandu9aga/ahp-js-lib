// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
    processAHP
} = require('./ahp');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('AHP API is running. Use POST /api/ahp to calculate.');
});

app.post("/api/ahp", (req, res) => {
  try {
    const result = processAHP(req.body);
    res.json({ priorities: result });
  } catch (err) {
    console.error("❌ AHP Processing Error:", err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`AHP server running at http://localhost:${port}`);
});