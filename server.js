'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const getMovies = require('./modules/movies.js');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
app.get('/weather', weatherHandler);
app.get('/movie', getMovies);

function weatherHandler(request, response) {
  const lat  = request.query.lat;
  const lon  = request.query.lon;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(404).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Server up on ${process.env.PORT}`));
