'use strict';

const axios = require('axios');

let cache = require('./cache.js');

async function getMovies(request, response, next) {
  try {
    let searchValue = request.query.search;

    let cacheKey = searchValue + 'Data';

    let timeRightNow = Date.now();
    let acceptableTimeToCache = 1000 * 60 * 60 * 24 * 7 * 4;

    if (
      cache[cacheKey] &&
      timeRightNow - cache[cacheKey].timeStamp < acceptableTimeToCache
    ) {
      console.log('movies cache hit');

      response.status(200).send(cache[cacheKey].data);
    } else {
      console.log('movies cache miss');

      let params = {
        api_key: process.env.MOVIE_API_KEY,
        query: searchValue,
      };
      let baseURL = 'https://api.themoviedb.org/3/search/movie';
      let results = await axios.get(baseURL, { params });

      let moviesArr = results.data.results.map((movie) => new Movie(movie));

      cache[cacheKey] = {
        data: moviesArr,
        timeStamp: Date.now(),
      };

      response.status(200).send(moviesArr);
    }
  } catch (error) {
    Promise.resolve()
      .then(() => {
        throw new Error(error.message);
      })
      .catch(next);
  }
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
