import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, IconButton, makeStyles, Paper } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    title: {
        marginRight: theme.spacing(2),
        '& a': {
            color: 'white',
            textDecoration: 'none',
        }
    },
    button: {
        marginLeft: theme.spacing(1)
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            flexGrow: 1,
            marginLeft: 0,
            marginRight: 0,
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        [theme.breakpoints.down('xs')]: {
            width: '10ch',
        },
        '&:focus': {
            [theme.breakpoints.up('md')]: {
                width: '30ch',
            },
            [theme.breakpoints.down('xs')]: {
                width: '15ch',
            },
        },
    },
    grow: {
        flexGrow: 1,
    }
}));

const NavigationBar = () => {
    const classes = useStyles();
    const { user, logout } = useAuth();
    const history = useHistory();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        history.push('/');
    };
    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            history.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
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
                <div className={classes.grow}></div>
                <form onSubmit={handleSearchSubmit} className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search games…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 
                            'aria-label': 'search',
                            'type': 'search'
                        }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    />
                    <IconButton 
                        type="submit" 
                        color="inherit" 
                        aria-label="search"
                        edge="end"
                        style={{ visibility: searchQuery ? 'visible' : 'hidden' }}
                    >
                        <SearchIcon />
                    </IconButton>
                </form>
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
