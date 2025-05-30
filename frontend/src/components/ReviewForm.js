import React, { useState } from 'react';
import '../styles/ReviewForm.css';

function ReviewForm({ onSubmit, initialData, loading, error }) {
    const [content, setContent] = useState(initialData?.content || '');
    const [rating, setRating] = useState(initialData?.rating || 5);
    const [validationError, setValidationError] = useState('');
    
    const validateReview = () => {
        if (content.trim().length < 10) {
            setValidationError('Review must be at least 10 characters long');
            return false;
        }
        setValidationError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateReview()) return;
        
        try {
            await onSubmit({ content, rating });
            if (!initialData) {
                setContent('');
                setRating(5);
            }
        } catch (err) {
            setValidationError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            {error && <div className="error-message">{error}</div>}
            {validationError && <div className="error-message">{validationError}</div>}
            
            <div className="form-group">
                <label htmlFor="content">Review:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                    required
                    minLength={10}
                    placeholder="Write your review here (minimum 10 characters)"
                    className="review-textarea"
                />
                <small>{content.length}/1000 characters</small>
            </div>
            
            <div className="form-group">
                <label htmlFor="rating">Rating:</label>
                <div className="rating-select">
                    {[5, 4, 3, 2, 1].map((num) => (
                        <label key={num} className="rating-option">
                            <input
                                type="radio"
                                name="rating"
                                value={num}
                                checked={rating === num}
                                onChange={(e) => setRating(Number(e.target.value))}
                                disabled={loading}
                            />
                            <span>{num} ⭐</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <button 
                type="submit" 
                disabled={loading || content.length < 10}
                className={`submit-button ${loading ? 'loading' : ''}`}
            >
                {loading ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
            </button>
        </form>
    );
}

export default ReviewForm;