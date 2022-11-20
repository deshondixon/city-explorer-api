const axios = require('axios');

async function getMovies(request, response) {
  let searchValue = request.query.search;

  let params = {
    api_key: process.env.MOVIE_API_KEY,
    query: searchValue,
  };
  let baseURL = 'http://api.themoviedb.org/3/search/movie';

  axios.get(baseURL, { params })
    .then((results) => results.data.results.map((movie) => new Movie(movie)))
    .then((moviesArr) => response.send(moviesArr))
    .catch((error) => console.log(error));
}

//CLASS

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.summary = movieObject.overview;
    this.averageVotes = movieObject.vote_average;
    this.totalVotes = movieObject.vote_count;
    this.poster = movieObject.poster_path
      ? `http://image.tmdb.org/t/p/original/${movieObject.poster_path}`
      : '';
    this.releasedDate = movieObject.released_date;
  }
}

module.exports = getMovies;