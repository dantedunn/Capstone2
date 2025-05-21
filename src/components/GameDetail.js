import React from 'react';

const GameDetail = ({ game }) => {
    if (!game) {
        return <div>Select a game to see the details.</div>;
    }

    return (
        <div className="game-detail">
            <h2>{game.name}</h2>
            {game.cover && <img src={game.cover.url} alt={game.name} />}
            <p><strong>Release Date:</strong> {new Date(game.first_release_date).toLocaleDateString()}</p>
            <p><strong>Rating:</strong> {game.rating ? game.rating.toFixed(1) : 'N/A'}</p>
            <p><strong>Summary:</strong> {game.summary}</p>
            <p><strong>Genres:</strong> {game.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Platforms:</strong> {game.platforms.map(platform => platform.name).join(', ')}</p>
        </div>
    );
};

export default GameDetail;