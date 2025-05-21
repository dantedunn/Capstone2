import React, { useEffect, useState } from 'react';
import { fetchGameData } from '../api/api';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getGames = async () => {
            try {
                const data = await fetchGameData();
                setGames(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getGames();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching games: {error.message}</div>;
    }

    return (
        <div>
            <h1>Video Game List</h1>
            <ul>
                {games.map(game => (
                    <li key={game.id}>
                        <h2>{game.name}</h2>
                        <p>Rating: {game.aggregated_rating}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameList;