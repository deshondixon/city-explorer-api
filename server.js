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
    let city = request.query.cityName;

    let selectedCity = data.find(object => object.city_name === city);

    let cityCleanedUp = [];

    for(let i = 0; i < selectedCity.data.length;i++) {
      cityCleanedUp.push(new Forecast(selectedCity.data[i]));
    }
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
  constructor(weatherDay) {
    this.date = weatherDay.valid_date;
    this.description = weatherDay.weather.description;
  }
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
