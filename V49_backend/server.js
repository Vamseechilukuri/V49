const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // Updated to bcryptjs

// Initialize environment variables
dotenv.config();
require('dotenv').config();


const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database');
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'my_JWT_secret_key';

// Login route for JWT generation
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Sign-Up route for new users
app.post('/auth/signup', async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Validate the data
  if (!fullName || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the email or username already exists
  const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.query(query, [email, username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }

    // Hash the password using bcrypt.js
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertQuery = 'INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [fullName, email, username, hashedPassword], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Middleware to validate JWT for protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'Token required' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// API to get dynamic chart data
app.get('/api/summary-chart', (req, res) => {
  const material = req.query.material; // Get the selected material from query parameters

  const validMaterials = [
    'materials_excl_rock', 'rock', 'concrete', 'steel', 'aluminum', 'chromium', 'glass',
    'iron', 'lithium', 'manganese', 'nickel', 'phosphate', 'solar_pv_cover_glass', 'silicon',
    'copper', 'niobium', 'molybdenum', 'magnesium', 'lead', 'graphite', 'silver', 'tin',
    'cobalt', 'boron', 'rare_earths', 'uranium', 'titanium', 'tungsten', 'zinc'
  ];

  if (!validMaterials.includes(material)) {
    return res.status(400).json({ error: 'Invalid material selected' });
  }

  const sqlQuery = `SELECT entity_name, ${material} FROM summary_data`;

  db.query(sqlQuery, (err, results) => {
    if (err) return res.status(500).send(err);

    const data = results.map(item => ({
      label: item.entity_name,
      value: item[material],
    }));

    res.json(data);
  });
});

// Reports Data
app.get('/api/reports-chart', (req, res) => {
  db.query('SELECT * FROM reports_data', (err, results) => {
    if (err) return res.status(500).send(err);

    const data = results.map(item => ({
      entity: item.entity,
      ratio: item.rock_to_metal_ratio,
    }));

    res.json(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
