import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchGameById,
  fetchReviewsForGame,
  createReview,
  createComment,
} from "../api/api";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "./ReviewForm";
import "../styles/GameDetail.css";

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewError, setReviewError] = useState("");
  const [newComments, setNewComments] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gameData, reviewsData] = await Promise.all([
          fetchGameById(id),
          fetchReviewsForGame(id),
        ]);
        setGame(gameData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const newReview = await createReview(id, reviewData);
      setReviews((prevReviews) => [newReview, ...prevReviews]);
      setReviewError("");
    } catch (err) {
      setReviewError(
        "You have already reviewed this game or there was an error submitting your review."
      );
    }
  };

  const handleCommentSubmit = async (e, reviewId) => {
    e.preventDefault();
    if (!newComments[reviewId]) return;

    try {
      const comment = await createComment(reviewId, newComments[reviewId]);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, comments: [...(review.comments || []), comment] }
            : review
        )
      );
      setNewComments({ ...newComments, [reviewId]: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to post comment.");
    }
  };

  if (loading) {
    return <div className="loading">Loading game details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!game) {
    return <div>Game not found.</div>;
  }

  const userHasReviewed =
    user && reviews.some((review) => review.userId === user.id);

  return (
    <div className="game-detail-container">
      <div className="game-detail">
        <div className="game-header">
          <img
            src={game.imageUrl}
            alt={game.name}
            className="game-detail-image"
          />
          <div className="game-info">
            <h1>{game.name}</h1>
            <p className="game-rating">
              Rating:{" "}
              {game.averageRating
                ? parseFloat(game.averageRating).toFixed(1) + " ⭐"
                : "No ratings yet"}
            </p>
            <p className="game-release">
              Released:{" "}
              {game.releaseDate
                ? new Date(game.releaseDate).toLocaleDateString()
                : "Release date unknown"}
            </p>
            <div className="game-tags">
              {game.genre && <span className="tag genre">{game.genre}</span>}
              {game.platform && (
                <span className="tag platform">{game.platform}</span>
              )}
              {game.publisher && (
                <span className="tag publisher">{game.publisher}</span>
              )}
            </div>
          </div>
        </div>

        <div className="game-description">
          <h2>Description</h2>
          <p>{game.description || "No description available."}</p>
        </div>

        <div className="game-metadata">
          <div className="metadata-item">
            <h3>Game Mode</h3>
            <p>{game.gameMode || "N/A"}</p>
          </div>
          <div className="metadata-item">
            <h3>Theme</h3>
            <p>{game.theme || "N/A"}</p>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          {user ? (
            !userHasReviewed ? (
              <div className="review-form-container">
                <h3>Write a Review</h3>
                {reviewError && (
                  <div className="error-message">{reviewError}</div>
                )}
                <ReviewForm onSubmit={handleReviewSubmit} />
              </div>
            ) : (
              <p className="already-reviewed">
                You have already reviewed this game.
              </p>
            )
          ) : (
            <p className="login-prompt">
              Please <a href="/login">login</a> to write a review.
            </p>
          )}

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">
                      {review.user.username}
                    </span>
                    <span className="review-rating">{review.rating} ⭐</span>
                  </div>
                  <p className="review-content">{review.content}</p>
                  <p className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>

                  {/* Comments Section */}
                  <div className="review-comments">
                    <h4>Comments</h4>
                    {review.comments && review.comments.length > 0 ? (
                      review.comments.map((comment) => (
                        <div key={comment.id} className="comment-card">
                          <p>
                            <strong>{comment.user.username}</strong>:{" "}
                            {comment.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                    {user && (
                      <form
                        onSubmit={(e) => handleCommentSubmit(e, review.id)}
                        className="comment-form"
                      >
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComments[review.id] || ""}
                          onChange={(e) =>
                            setNewComments({
                              ...newComments,
                              [review.id]: e.target.value,
                            })
                          }
                          required
                        />
                        <button type="submit">Post Comment</button>
                      </form>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-reviews">
                No reviews yet. Be the first to review this game!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
