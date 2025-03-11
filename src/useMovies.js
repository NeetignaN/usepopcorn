import { useEffect, useRef, useState } from "react";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      //   callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); //Setting Error Message as Empty String
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=9d2481a7&s=${query}`,
            { signal: controller.signal }
          );

          const data = await res.json();
          // console.log(data);

          if (data.Response === "False") throw new Error("Movie Not Found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.message === "Failed to fetch")
            setError("Something went wrong");
          else if (err.name !== "AbortError") {
            console.log(err);
            setError(err.message);
          } else {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
