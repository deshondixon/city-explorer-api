'use strict';

console.log('City-Explorer-Api back-end server');

//----------------------------------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//----------------------------------------------
const getWeather = require('../weather.js');
const getMovies = require('../movies.js');

//----------------------------------------------
const app = express();

//USE
app.use(cors());

//PORT

const PORT = process.env.PORT || 3002;

//ROUTES
app.get('/weather', getWeather);

app.get('/movie', getMovies);

//ERROR ROUTES
app.get('*', (request, response) => {
  response.status(404).send('That route does not exist');
});

app.use((error, request, response) => {
  response.status(500).send(error.message);
});

//-------------------------------------------------
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
