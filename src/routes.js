const express = require('express');

const routes = express.Router();

const movieService = require('./services/movieService');

routes.get('/movies', movieService.index);
routes.get('/movies/:name', movieService.show);

module.exports = routes;