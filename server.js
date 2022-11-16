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
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.city_name;
    let selectedCity = data.find(holder => holder.weather === holder);
    let forecast = new Forecast(selectedCity);
    response.send(forecast);
  } catch (error) {

    next(error);
  }
});

app.use((error, request, respone, next) => {
  response.status(500).send(error.message);
});

app.get('*', (request, response) => {
  response.send('That route does not exist');
});


class Forecast {
  constructor(forecastObject) {
    this.date = forecastObject.valid_date;
    this.description = forecastObject.description;
  }
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
