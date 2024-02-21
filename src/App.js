import React, { useState, useEffect } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryIntervalId, setRetryIntervalId] = useState(null);

  const fetchMoviesHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://swapi.dev/api/film/');

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const startRetry = () => {
    const intervalId = setInterval(() => {
      console.log('Retrying...');
      fetchMoviesHandler();
    }, 5000);
    setRetryIntervalId(intervalId);
  };

  const cancelRetry = () => {
    clearInterval(retryIntervalId);
    setRetryIntervalId(null);
  };

  useEffect(() => {
    if (error && retryIntervalId === null) {
      startRetry();
    }

    return () => clearInterval(retryIntervalId);
  }, [error, retryIntervalId]);

  let content = <p>Found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={cancelRetry}>Cancel Retry</button>
      </React.Fragment>
    );
  }

  if (loading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
