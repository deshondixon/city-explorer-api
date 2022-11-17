'use strict';

console.log('our first server');

const express = require('express');
let data = require('./data/weather.json');

require('dotenv').config();

const cors = require('cors');
const { response } = require('express');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('Hello, from my server');
});

app.get('/weather', (request, response, next) => {
  try {
    let cityName = request.query.city;
    let selectedCity = data.find((city) => city.city_name === cityName);

    let forecastArr = selectedCity.data.map((day) => new Forecast(day));
    response.send(forecastArr);
  } catch (error) {
    next(error);
  }
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.get('*', (request, response) => {
  response.send('That route does not exist');
});

class Forecast {
  constructor(forecastObject) {
    this.date = forecastObject.valid_date;
    this.description = forecastObject.weather.description;
  }
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
