import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GameList from './components/GameList';
import GameDetail from './components/GameDetail';
import ReviewForm from './components/ReviewForm';
import { fetchGameData } from './api/api';

function App() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const getGames = async () => {
            const data = await fetchGameData();
            setGames(data);
        };
        getGames();
    }, []);

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" exact>
                        <GameList games={games} />
                    </Route>
                    <Route path="/game/:id" component={GameDetail} />
                    <Route path="/review" component={ReviewForm} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;