import React, { useState } from 'react';

function ReviewForm({ onSubmit }) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ review, rating });
        }
        setReview('');
        setRating(1);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="review">Review:</label>
                <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="rating">Rating:</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                >
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );
}

export default ReviewForm;