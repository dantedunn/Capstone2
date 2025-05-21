const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check JWT and set req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware to check admin
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.sendStatus(403);
}

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (id, username, password, email, role) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id, username, email, role',
      [username, hash, email, 'user']
    );
    const user = result.rows[0];
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role, email: user.email }, JWT_SECRET);
  res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email } });
});

// Games routes
app.get('/api/games', async (req, res) => {
  const result = await pool.query('SELECT * FROM games ORDER BY name');
  res.json(result.rows);
});

app.get('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
  if (result.rows.length === 0) return res.sendStatus(404);
  res.json(result.rows[0]);
});

app.get('/api/games/search', async (req, res) => {
  const { q } = req.query;
  const result = await pool.query('SELECT * FROM games WHERE LOWER(name) LIKE $1', [`%${q.toLowerCase()}%`]);
  res.json(result.rows);
});

app.post('/api/games', authenticateToken, requireAdmin, async (req, res) => {
  const { name, description, genre, platform, publisher, game_mode, theme, release_date, average_rating, image_url } = req.body;
  const result = await pool.query(
    'INSERT INTO games (id, name, description, genre, platform, publisher, game_mode, theme, release_date, average_rating, image_url) VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
    [name, description, genre, platform, publisher, game_mode, theme, release_date, average_rating, image_url]
  );
  res.json(result.rows[0]);
});

app.put('/api/games/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, genre, platform, publisher, game_mode, theme, release_date, average_rating, image_url } = req.body;
  const result = await pool.query(
    'UPDATE games SET name=$1, description=$2, genre=$3, platform=$4, publisher=$5, game_mode=$6, theme=$7, release_date=$8, average_rating=$9, image_url=$10 WHERE id=$11 RETURNING *',
    [name, description, genre, platform, publisher, game_mode, theme, release_date, average_rating, image_url, id]
  );
  if (result.rows.length === 0) return res.sendStatus(404);
  res.json(result.rows[0]);
});

app.delete('/api/games/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM games WHERE id = $1', [id]);
  res.sendStatus(204);
});

// Reviews endpoints
app.get('/api/reviews', authenticateToken, async (req, res) => {
  // Get all reviews by the logged-in user
  const result = await pool.query('SELECT * FROM reviews WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});

app.get('/api/games/:id/reviews', async (req, res) => {
  // Get all reviews for a specific game
  const { id } = req.params;
  const result = await pool.query(
    'SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.game_id = $1',
    [id]
  );
  res.json(result.rows);
});

app.post('/api/games/:id/reviews', authenticateToken, async (req, res) => {
  // Add a review for a game (one per user per game)
  const { id } = req.params;
  const { content, rating } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reviews (id, content, rating, user_id, game_id) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *',
      [content, rating, req.user.id, id]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: 'You have already reviewed this game.' });
  }
});

app.put('/api/reviews/:id', authenticateToken, async (req, res) => {
  // Edit a review (only by owner)
  const { id } = req.params;
  const { content, rating } = req.body;
  const result = await pool.query(
    'UPDATE reviews SET content = $1, rating = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
    [content, rating, id, req.user.id]
  );
  if (result.rows.length === 0) return res.sendStatus(403);
  res.json(result.rows[0]);
});

app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  // Delete a review (only by owner)
  const { id } = req.params;
  const result = await pool.query('DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
  if (result.rows.length === 0) return res.sendStatus(403);
  res.sendStatus(204);
});

// Comments endpoints
app.get('/api/comments', authenticateToken, async (req, res) => {
  // Get all comments by the logged-in user
  const result = await pool.query('SELECT * FROM comments WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});

app.get('/api/reviews/:id/comments', async (req, res) => {
  // Get all comments for a specific review
  const { id } = req.params;
  const result = await pool.query(
    'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.review_id = $1',
    [id]
  );
  res.json(result.rows);
});

app.post('/api/reviews/:id/comments', authenticateToken, async (req, res) => {
  // Add a comment to a review
  const { id } = req.params;
  const { content } = req.body;
  const result = await pool.query(
    'INSERT INTO comments (id, content, user_id, review_id) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
    [content, req.user.id, id]
  );
  res.json(result.rows[0]);
});

app.put('/api/comments/:id', authenticateToken, async (req, res) => {
  // Edit a comment (only by owner)
  const { id } = req.params;
  const { content } = req.body;
  const result = await pool.query(
    'UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [content, id, req.user.id]
  );
  if (result.rows.length === 0) return res.sendStatus(403);
  res.json(result.rows[0]);
});

app.delete('/api/comments/:id', authenticateToken, async (req, res) => {
  // Delete a comment (only by owner)
  const { id } = req.params;
  const result = await pool.query('DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
  if (result.rows.length === 0) return res.sendStatus(403);
  res.sendStatus(204);
});

// Admin endpoints
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  // List all users with role, email, and review count
  const result = await pool.query(`
    SELECT u.id, u.username, u.email, u.role, COUNT(r.id) AS review_count
    FROM users u
    LEFT JOIN reviews r ON u.id = r.user_id
    GROUP BY u.id
    ORDER BY u.username
  `);
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
