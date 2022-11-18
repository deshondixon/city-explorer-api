'use strict';

console.log('City-Explorer-Api back-end server');

require('dotenv').config();
const axios  = require('axios');
const cors = require('cors');
const express = require('express');



const app = express();


//USE
app.use(cors());




//PORT

const PORT = process.env.PORT || 3002;




//ROUTES

app.get('/weather', async (request, response, next) => {
  try {

    let weatherLat = request.query.weatherLat;
    let weatherLon = request.query.weatherLon;
    let weatherUrl = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&unit=I&day=3&lat=${weatherLat}&lon=${weatherLon}`);
    let forecastArr = weatherUrl.data.data.map((day) => new Forecast(day));
    response.send(forecastArr);
  } catch (error) {
    next(error);
  }
});


app.get('/movie', async (request, response, next) => {
  try {
    let searchTerm = request.query.search;
    let movieUrl = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchTerm}`);
    let topMovies = movieUrl.data.results.map((movie) => new Movie(movie));
    response.send(topMovies);
  } catch (error) {
    next(error);
  }
});






app.get('*', (request, response) => {
  response.status(404).send('That route does not exist');
});

app.use((error, request, response) => {
  response.status(500).send(error.message);
});



//CLASS

class Forecast {
  constructor(forecastObject) {
    this.date = forecastObject.valid_date;
    this.description = `Low of ${forecastObject.low_temp}, high of ${forecastObject.high_temp} with ${forecastObject.weather.description}`;
  }
}

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.summary = movieObject.overview;
    this.averageVotes = movieObject.vote_average;
    this.totalVotes = movieObject.vote_count;
    this.poster = movieObject.poster_path ? `http://image.tmdb.org/t/p/original//${movieObject.poster_path}` : '';
    this.releasedDate = movieObject.released_date;
  }
}


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
