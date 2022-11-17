'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
let data = require('./data/weather.json');



const app = express();


//USE
app.use(cors());
app.use((error, request, response) => {
  response.status(500).send(error.message);
});



//PORT

const PORT = process.env.PORT || 3002;




//ROUTES

app.get('/', (request, response) => {
  response.send('Hello, from my server');
});



app.get('/weather', async (request, response, next) => {
  try {
    let cityName = request.query.city;
    //let lat = request.query.lat;
    //let lon = request.query.lon;
    let selectedCity = data.find((city) => city.city_name === cityName);
    let forecastArr = selectedCity.data.map((day) => new Forecast(day));
    response.send(forecastArr);
  } catch (error) {
    next(error);
  }
});



app.get('*', (request, response) => {
  response.send('That route does not exist');
});



//CLASS

class Forecast {
  constructor(forecastObject) {
    this.date = forecastObject.valid_date;
    this.description = `Low of ${forecastObject.low_temp}, high of ${forecastObject.high_temp} with ${forecastObject.weather.description}`;
  }
}

//class Movies {
//  constructor(moviesObject) {
//  }
//}



app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
