import React, { useEffect, useState } from "react";
import {
  fetchUserReviews,
  fetchUserComments,
  updateReview,
  deleteReview,
  updateComment,
  deleteComment,
} from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    content: "",
    rating: "",
  });
  const [editCommentData, setEditCommentData] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviewsData, commentsData] = await Promise.all([
          fetchUserReviews(),
          fetchUserComments(),
        ]);
        setReviews(reviewsData);
        setComments(commentsData);
      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };
    loadData();
  }, []);

  // REVIEW Handlers
  const handleReviewEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditReviewData({ content: review.content, rating: review.rating });
  };

  const handleReviewEditSubmit = async (e, reviewId) => {
    e.preventDefault();
    try {
      const updated = await updateReview(reviewId, editReviewData);
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      setEditingReviewId(null);
      setEditReviewData({ content: "", rating: "" });
    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // COMMENT Handlers
  const handleCommentEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentData(comment.content);
  };

  const handleCommentEditSubmit = async (e, commentId) => {
    e.preventDefault();
    try {
      const updated = await updateComment(commentId, editCommentData);

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c))
      );
      setEditingCommentId(null);
      setEditCommentData("");
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="profile-container">
      <h2>{user?.username}'s Profile</h2>

      {/* Reviews Section */}
      <section className="profile-section">
        <h3>Your Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              {editingReviewId === review.id ? (
                <form
                  onSubmit={(e) => handleReviewEditSubmit(e, review.id)}
                  className="edit-form"
                >
                  <textarea
                    value={editReviewData.content}
                    onChange={(e) =>
                      setEditReviewData({
                        ...editReviewData,
                        content: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    value={editReviewData.rating}
                    onChange={(e) =>
                      setEditReviewData({
                        ...editReviewData,
                        rating: e.target.value,
                      })
                    }
                    min={0}
                    max={100}
                    required
                  />
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setEditingReviewId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p>
                    <strong>Game:</strong> {review.game?.name || "Unknown Game"}
                  </p>
                  <p>
                    <strong>Rating:</strong> {review.rating}/100
                  </p>
                  <p>
                    <strong>Review:</strong> {review.content}
                  </p>
                  <div className="review-actions">
                    <button onClick={() => handleReviewEditClick(review)}>
                      Edit
                    </button>
                    <button onClick={() => handleReviewDelete(review.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </section>

      {/* Comments Section */}
      <section className="profile-section">
        <h3>Your Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              {editingCommentId === comment.id ? (
                <form
                  onSubmit={(e) => handleCommentEditSubmit(e, comment.id)}
                  className="edit-form"
                >
                  <textarea
                    value={editCommentData}
                    onChange={(e) => setEditCommentData(e.target.value)}
                    required
                  />
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setEditingCommentId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p>
                    <strong>Game:</strong>{" "}
                    {comment.review?.game?.name || "Unknown Game"}
                  </p>
                  <p>
                    <strong>Comment:</strong> {comment.content}
                  </p>
                  <div className="review-actions">
                    <button onClick={() => handleCommentEditClick(comment)}>
                      Edit
                    </button>
                    <button onClick={() => handleCommentDelete(comment.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Profile;
