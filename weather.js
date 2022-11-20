const axios = require('axios');

async function getWeather(request, response, next) {
  try {
    let weatherLat = request.query.weatherLat;
    let weatherLon = request.query.weatherLon;

    let params = {
      key: process.env.WEATHER_API_KEY,
      days: 3,
      lat: weatherLat,
      lon: weatherLon,
    };
    let baseURL = 'http://api.weatherbit.io/v2.0/forecast/daily';
    let results = await axios.get(baseURL, { params });
    let forecastArr = results.data.data.map((day) => new Forecast(day));
    response.send(forecastArr);
  } catch (error) {
    Promise.resolve()
      .then(() => {
        throw new Error(error.message);
      })
      .catch(next);
  }
}

// CLASS

class Forecast {
  constructor(forecastObject) {
    this.date = forecastObject.valid_date;
    this.description = `Low of ${forecastObject.low_temp}, high of ${forecastObject.high_temp} with ${forecastObject.weather.description}`;
  }
}

module.exports = getWeather;
