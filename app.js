const express = require('express');
const { getCategories, getReviews } = require('./controllers/controllers.js');
const { catchAll } = require('./controllers/errors');

const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: "Wrong URL!" });
});

module.exports = app;