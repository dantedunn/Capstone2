import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { fetchGameData } from '../api/api';
import '../styles/GameList.css';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        let mounted = true;

        const getGames = async () => {
            try {
                const data = await fetchGameData();
                if (mounted) {
                    setGames(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message);
                    setShowError(true);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getGames();

        return () => {
            mounted = false;
        };
    }, []);

    const handleCloseError = () => {
        setShowError(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <CircularProgress />
                <p>Loading games...</p>
            </div>
        );
    }

    return (
        <div className="game-list-container">
            <h1>Video Game Reviews</h1>
            {games.length > 0 ? (
                <div className="game-grid">
                    {games.map(game => (
                        <div key={game.id} className="game-card">
                            <div className="game-card-image">
                                <img 
                                    src={game.imageUrl} 
                                    alt={game.name} 
                                    className="game-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-game.jpg';
                                    }}
                                />
                            </div>
                            <div className="game-card-content">
                                <h2>{game.name}</h2>
                                <p className="game-genre">{game.genre}</p>
                                <p className="game-rating">
                                    {game.averageRating ? (
                                        <>
                                            <span className="rating-number">
                                                {parseFloat(game.averageRating).toFixed(1)}
                                            </span>
                                            <span className="rating-star">⭐</span>
                                        </>
                                    ) : (
                                        'Not rated'
                                    )}
                                </p>
                                <p className="game-platform">{game.platform}</p>
                                <Link to={`/game/${game.id}`} className="view-details-button">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-games-message">
                    <h2>No games found</h2>
                    <p>Try refreshing the page or check back later.</p>
                </div>
            )}
            
            <Snackbar 
                open={showError} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseError} severity="error">
                    {error || 'An error occurred while loading games'}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default GameList;