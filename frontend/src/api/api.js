// Helper function for handling API responses
async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    try {
      const errorJson = JSON.parse(text);
      throw new Error(
        errorJson.error || `${response.status} ${response.statusText}: ${text}`
      );
    } catch (e) {
      throw new Error(`${response.status} ${response.statusText}: ${text}`);
    }
  }
  return response.json();
}

// Default headers for JSON requests
const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all games
export async function fetchGameData() {
  try {
    const response = await fetch("/api/games", {
      method: "GET",
      headers: jsonHeaders,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch games:", error);
    throw error;
  }
}

// Fetch a single game by ID
export async function fetchGameById(id) {
  const response = await fetch(`/api/games/${id}`, {
    headers: jsonHeaders,
  });
  return handleResponse(response);
}

// Fetch reviews for a game
export async function fetchReviewsForGame(id) {
  const response = await fetch(`/api/games/${id}/reviews`, {
    headers: jsonHeaders,
  });
  return handleResponse(response);
}

// Login
export async function loginUser(username, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
}

// Signup
export async function signupUser(username, email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(response);
}

// User reviews
export async function getUserReviews() {
  const response = await fetch("/api/reviews", {
    headers: { ...jsonHeaders, ...getAuthHeaders() },
  });
  return handleResponse(response);
}

// User comments
export async function getUserComments() {
  const response = await fetch("/api/comments", {
    headers: { ...jsonHeaders, ...getAuthHeaders() },
  });
  return handleResponse(response);
}

// Admin: all games
export async function getAllGames() {
  const response = await fetch("/api/games", {
    headers: { ...jsonHeaders, ...getAuthHeaders() },
  });
  return handleResponse(response);
}

// Admin: all users
export async function getAllUsers() {
  const response = await fetch("/api/admin/users", {
    headers: { ...jsonHeaders, ...getAuthHeaders() },
  });
  return handleResponse(response);
}

// Update user role (admin only)
export async function updateUserRole(userId, role) {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "PUT",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
    body: JSON.stringify({ role }),
  });
  return handleResponse(response);
}

// Create a new game (admin only)
export async function createGame(gameData) {
  const response = await fetch("/api/games", {
    method: "POST",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
    body: JSON.stringify(gameData),
  });
  return handleResponse(response);
}

// Update a game (admin only)
export async function updateGame(gameId, gameData) {
  const response = await fetch(`/api/games/${gameId}`, {
    method: "PUT",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
    body: JSON.stringify(gameData),
  });
  return handleResponse(response);
}

// Delete a game (admin only)
export async function deleteGame(gameId) {
  const response = await fetch(`/api/games/${gameId}`, {
    method: "DELETE",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
  });
  return handleResponse(response);
}

// Create a review
export async function createReview(gameId, reviewData) {
  const response = await fetch(`/api/games/${gameId}/reviews`, {
    method: "POST",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
}

// Update a review
export async function updateReview(reviewId, reviewData) {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
}

// Delete a review
export async function deleteReview(reviewId) {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
  });
  return handleResponse(response);
}

// Get comments for a review
export async function getReviewComments(reviewId) {
  const response = await fetch(`/api/reviews/${reviewId}/comments`, {
    headers: jsonHeaders,
  });
  return handleResponse(response);
}

// Create a comment
export async function createComment(reviewId, content) {
  const response = await fetch(`/api/reviews/${reviewId}/comments`, {
    method: "POST",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
}

// Update a comment
export async function updateComment(commentId, content) {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PUT",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
}

// Delete a comment
export async function deleteComment(commentId) {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
    headers: { ...jsonHeaders, ...getAuthHeaders() },
  });
  return handleResponse(response);
}

// Search games
export async function searchGames(query) {
  const response = await fetch(
    `/api/games/search?q=${encodeURIComponent(query)}`,
    {
      headers: jsonHeaders,
    }
  );
  return handleResponse(response);
}

// Additional helper functions from OscarsBranch
export const fetchUserReviews = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/reviews", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user reviews");
  return res.json();
};

export const fetchUserComments = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/comments", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user comments");
  return res.json();
};
