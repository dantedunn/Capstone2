const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;
const prisma = new PrismaClient();

// Configure CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check JWT and set req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware to check admin
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.sendStatus(403);
}

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        role: "user",
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: "Username or email already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const userData = {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
  };
  const token = jwt.sign(userData, JWT_SECRET);
  res.json({ token, user: userData });
});

// Games routes
app.get("/api/games", async (req, res) => {
  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
  });
  res.json(games);
});

app.get("/api/games/:id", async (req, res) => {
  const { id } = req.params;
  const game = await prisma.game.findUnique({
    where: { id },
  });
  if (!game) return res.sendStatus(404);
  res.json(game);
});

app.get("/api/games/search", async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return res.json([]);
  }
  const searchTerm = q.trim();
  try {
    const games = await prisma.game.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { genre: { contains: searchTerm, mode: "insensitive" } },
          { publisher: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
    });
    res.json(games);
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for games" });
  }
});

app.post("/api/games", authenticateToken, requireAdmin, async (req, res) => {
  const {
    name,
    description,
    genre,
    platform,
    publisher,
    game_mode,
    theme,
    release_date,
    average_rating,
    image_url,
  } = req.body;
  const game = await prisma.game.create({
    data: {
      name,
      description,
      genre,
      platform,
      publisher,
      game_mode,
      theme,
      release_date: release_date ? new Date(release_date) : null,
      average_rating,
      image_url,
    },
  });
  res.json(game);
});

app.put("/api/games/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    genre,
    platform,
    publisher,
    game_mode,
    theme,
    release_date,
    average_rating,
    image_url,
  } = req.body;
  const game = await prisma.game.update({
    where: { id },
    data: {
      name,
      description,
      genre,
      platform,
      publisher,
      game_mode,
      theme,
      release_date: release_date ? new Date(release_date) : null,
      average_rating,
      image_url,
    },
  });
  res.json(game);
});

app.delete(
  "/api/games/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    await prisma.game.delete({
      where: { id },
    });
    res.sendStatus(204);
  }
);

// Reviews endpoints
app.get("/api/reviews", authenticateToken, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: {
        game: true,
        comments: {
          include: {
            user: { select: { username: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch reviews", message: error.message });
  }
});

app.get("/api/games/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { gameId: id },
      include: {
        user: { select: { username: true } },
        comments: {
          include: { user: { select: { username: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch reviews", message: error.message });
  }
});

app.post("/api/games/:id/reviews", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, rating } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        content,
        rating,
        userId: req.user.id,
        gameId: id,
      },
      include: {
        user: { select: { username: true } },
      },
    });
    res.json(review);
  } catch (e) {
    res.status(400).json({ error: "You have already reviewed this game" });
  }
});

app.put("/api/reviews/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, rating } = req.body;

  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      console.log("Review not found");
      return res.status(404).json({ error: "Review not found" });
    }

    console.log("Incoming PUT /api/reviews/:id request:");
    console.log("req.body:", req.body);
    console.log("req.user.id:", req.user.id);
    console.log("DB review.userId:", review.userId);

    if (review.userId !== req.user.id) {
      console.log("User mismatch, returning 403");
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { content, rating: Number(rating) }, // Make sure rating is a number
    });

    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.sendStatus(500);
  }
});

/* DELETE REVIEW */
app.delete("/api/reviews/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      console.log("Review not found");
      return res.status(404).json({ error: "Review not found" });
    }

    console.log("DB review.userId:", review.userId);
    console.log("Token user id (req.user.id):", req.user.id);

    if (review.userId !== req.user.id) {
      console.log("User mismatch, returning 403");
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.review.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    console.error("Error deleting review:", e);
    res.sendStatus(500);
  }
});

// Comments endpoints
app.get("/api/reviews/:reviewId/comments", async (req, res) => {
  const { reviewId } = req.params;
  const comments = await prisma.comment.findMany({
    where: { reviewId },
    include: {
      user: { select: { username: true } },
    },
    orderBy: { id: "desc" },
  });
  res.json(comments);
});

// 🚀 NEW: GET /api/comments - Fetch all comments by the current user
app.get("/api/comments", authenticateToken, async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { userId: req.user.id },
      include: {
        review: {
          include: { game: { select: { name: true, id: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (err) {
    console.error("Error fetching user comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.post(
  "/api/reviews/:reviewId/comments",
  authenticateToken,
  async (req, res) => {
    const { reviewId } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        reviewId,
      },
      include: {
        user: { select: { username: true } },
      },
    });
    res.json(comment);
  }
);

app.put("/api/comments/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      console.log("Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    console.log("Incoming PUT /api/comments/:id request:");
    console.log("req.body:", req.body);
    console.log("req.user.id:", req.user.id);
    console.log("DB comment.userId:", comment.userId);

    if (comment.userId !== req.user.id) {
      console.log("User mismatch, returning 403");
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.sendStatus(500);
  }
});

/* DELETE COMMENT */
app.delete("/api/comments/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      console.log("Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    console.log("DB comment.userId:", comment.userId);
    console.log("Token user id (req.user.id):", req.user.id);

    if (comment.userId !== req.user.id) {
      console.log("User mismatch, returning 403");
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.comment.delete({ where: { id } });
    res.sendStatus(204);
  } catch (e) {
    console.error("Error deleting comment:", e);
    res.sendStatus(500);
  }
});

// Admin endpoints
app.get(
  "/api/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        reviews: { select: { id: true } },
      },
    });
    res.json(users);
  }
);

app.put(
  "/api/admin/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, email: true, role: true },
    });
    res.json(user);
  }
);

app.delete(
  "/api/games/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    await prisma.game.delete({
      where: { id },
    });
    res.sendStatus(204);
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const server = app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Please stop the other process or use a different port.`
      );
      process.exit(1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    prisma.$disconnect().then(() => {
      console.log("Prisma disconnected");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    prisma.$disconnect().then(() => {
      console.log("Prisma disconnected");
      process.exit(0);
    });
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  server.close(() => {
    prisma.$disconnect().then(() => {
      process.exit(1);
    });
  });
});
