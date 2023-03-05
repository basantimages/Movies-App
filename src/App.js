import React, { useEffect, useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";

import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [addInterval, setAddInterval] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong...Retrying!");
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
      setAddInterval(true);
    }
    setIsLoading(false);
  }, []);

  function cancelInterval() {
    clearInterval(intervalId);
    setIntervalId(null);
    setError("Retrying cancelled!");
    setAddInterval(false);
  }

  useEffect(() => {
    if (addInterval) {
      const interval = setInterval(fetchMoviesHandler, 5000);
      setIntervalId(interval);
    }
  }, [addInterval, fetchMoviesHandler]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function addMovieHandler(movie) {
    console.log(movie);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {error && <button onClick={cancelInterval}>Cancel Retrying</button>}
      </section>
      <section>{content}</section>
    </>
  );
}

export default App;
