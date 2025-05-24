import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        '& a': {
            color: 'white',
            textDecoration: 'none',
        }
    },
    button: {
        marginLeft: theme.spacing(1)
    }
}));

const NavigationBar = () => {
    const classes = useStyles();
    const { user, logout } = useAuth();
    const history = useHistory();

    const handleLogout = () => {
        logout();
        history.push('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/">
                        Game Reviews
                    </Link>
                </Typography>
                <Button color="inherit" component={Link} to="/" className={classes.button}>
                    Games
                </Button>
                {user ? (
                    <>
                        <Typography variant="body1" className={classes.button}>
                            Welcome, {user.username}!
                        </Typography>
                        {user.role === 'admin' && (
                            <Button 
                                color="inherit" 
                                component={Link} 
                                to="/admin" 
                                className={classes.button}
                            >
                                Admin
                            </Button>
                        )}
                        <Button 
                            color="inherit" 
                            onClick={handleLogout} 
                            className={classes.button}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/login" 
                            className={classes.button}
                        >
                            Login
                        </Button>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/signup" 
                            className={classes.button}
                        >
                            Sign Up
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
