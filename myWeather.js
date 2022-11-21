'use strict';

const axios = require('axios');

let cache = require('./modules/cache.js');

async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let key = lat + lon + 'Data';

    let timeRightNow = Date.now();
    let acceptableTimeToCache = 1000 * 60 * 60 * 24 * 7 * 4;

    if (
      cache[key] &&
       timeRightNow - cache[key].timeStamp < acceptableTimeToCache
    ) {
      console.log('weather cache hit');

      response.status(200).send(cache[key].data);
    } else {
      console.log('weather cache miss');

      let params = {
        key: process.env.WEATHER_API_KEY,
        days: 3,
        lat: lat,
        lon: lon,
      };
      let baseURL = 'http://api.weatherbit.io/v2.0/forecast/daily';
      let results = await axios.get(baseURL, { params });
      let forecastArr = results.data.data.map((day) => new Forecast(day));

      cache[key] = {
        data: forecastArr,
        timeStamp: Date.now(),
      };

      response.status(200).send(forecastArr);
    }
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
