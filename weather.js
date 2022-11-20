const axios = require('axios');

async function getWeather(request, response) {
  let weatherLat = request.query.weatherLat;
  let weatherLon = request.query.weatherLon;

  let params = {
    key: process.env.WEATHER_API_KEY,
    days: 3,
    lat: weatherLat,
    lon: weatherLon,
  };
  let baseURL = 'http://api.weatherbit.io/v2.0/forecast/daily';

  axios.get(baseURL, { params })
    .then((results) => results.data.data.map((day) => new Forecast(day)))
    .then((forecastArr) => response.send(forecastArr))
    .catch((error) => console.log(error));
}

// CLASS

class Forecast {
  constructor(forecastObject) {
    this.date = forecastObject.valid_date;
    this.description = `Low of ${forecastObject.low_temp}, high of ${forecastObject.high_temp} with ${forecastObject.weather.description}`;
  }
}

module.exports = getWeather;
