import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUserReviews, fetchUserComments } from "../api/api";
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserReviews().then(setReviews).catch(console.error);
      fetchUserComments().then(setComments).catch(console.error);
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-container">
      <h2>{user.username}'s Profile</h2>

      <section className="profile-section">
        <h3>Your Reviews</h3>
        {reviews.length === 0 ? (
          <p>You haven't posted any reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <p>
                <strong>Game:</strong> {review.game?.name || "Unknown Game"}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating}/100
              </p>
              <p>
                <strong>Content:</strong> {review.content}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="profile-section">
        <h3>Your Comments</h3>
        {comments.length === 0 ? (
          <p>You haven't posted any comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <p>
                <strong>Game:</strong>{" "}
                {comment.review?.game?.name || "Unknown Game"}
              </p>
              <p>
                <strong>Comment:</strong> {comment.content}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Profile;
