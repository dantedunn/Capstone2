import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import GameList from './components/GameList';
import GameDetail from './components/GameDetail';
import ReviewForm from './components/ReviewForm';
import Login from './components/Login';
import SignUp from './components/SignUp';
import SearchResults from './components/SearchResults';
import PrivateRoute from './components/PrivateRoute';
import { fetchGameData } from './api/api';
import './styles/App.css';

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
        <AuthProvider>
            <Router>
                <div className="App">
                    <NavigationBar />
                    <Switch>
                        <Route exact path="/" component={GameList} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/game/:id" component={GameDetail} />
                        <Route path="/review" component={ReviewForm} />
                        <Route path="/search" component={SearchResults} />
                    </Switch>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;