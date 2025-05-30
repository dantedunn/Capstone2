import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Breadcrumbs,
  Link as MuiLink,
  LinearProgress,
  Paper,
  Button,
  makeStyles
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { searchGames } from '../api/api';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  breadcrumbs: {
    marginBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
  cardContent: {
    flexGrow: 1,
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
  noResults: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  searchCount: {
    marginBottom: theme.spacing(2),
  }
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const classes = useStyles();
  const query = useQuery().get('q');
  const history = useHistory();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setIsSearching(true);
      try {
        const results = await searchGames(query);
        setGames(results);
        setError(null);
      } catch (err) {
        console.error('Error searching games:', err);
        setError('Failed to search games. Please try again.');
      } finally {
        setLoading(false);
        // Small delay to show the searching animation
        setTimeout(() => {
          setIsSearching(false);
        }, 500);
      }
    };

    if (query) {
      fetchSearchResults();
      // Update page title with search query
      document.title = `Search: ${query} | Game Reviews`;
    } else {
      setGames([]);
      setLoading(false);
      setIsSearching(false);
      document.title = 'Game Reviews';
    }

    // Restore title when component unmounts
    return () => {
      document.title = 'Game Reviews';
    };
  }, [query]);

  // Function to handle new search from this page
  const handleNewSearch = (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('new-search-input');
    if (searchInput && searchInput.value.trim()) {
      history.push(`/search?q=${encodeURIComponent(searchInput.value.trim())}`);
    }
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        <MuiLink 
          component={Link} 
          to="/" 
          color="inherit" 
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon style={{ marginRight: 5 }} fontSize="small" />
          Home
        </MuiLink>
        <Typography color="textPrimary" style={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon style={{ marginRight: 5 }} fontSize="small" />
          Search Results
        </Typography>
      </Breadcrumbs>

      {/* Search status indicator */}
      {isSearching && <LinearProgress />}
      
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results for: "{query}"
      </Typography>
      
      {loading ? (
        <div className={classes.loaderContainer}>
          <CircularProgress />
          <Typography variant="body1" style={{ marginTop: 16 }}>
            Searching for games...
          </Typography>
        </div>
      ) : error ? (
        <Paper elevation={3} className={classes.noResults}>
          <Typography color="error" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/"
          >
            Return to Home
          </Button>
        </Paper>
      ) : games.length === 0 ? (
        <Paper elevation={3} className={classes.noResults}>
          <Typography variant="h6" paragraph>
            No games found matching your search.
          </Typography>
          <Typography variant="body1" paragraph>
            Try searching with different keywords or browse all games.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/"
          >
            Browse All Games
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="body1" className={classes.searchCount}>
            Found {games.length} {games.length === 1 ? 'result' : 'results'}
          </Typography>
          
          <Grid container spacing={4}>
            {games.map((game) => (
              <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                  <CardActionArea component={Link} to={`/game/${game.id}`}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={game.imageUrl || '/placeholder-game.jpg'}
                      title={game.name}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {game.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p" noWrap>
                        {game.description}
                      </Typography>
                      {game.genre && (
                        <Typography variant="caption" color="textSecondary">
                          Genre: {game.genre}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SearchResults;
