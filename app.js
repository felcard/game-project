const express = require('express');
const { getCategories, getReviews, getReviewById } = require('./controllers/controllers.js');
const { catchAll, customErrors, psqlErrors } = require('./controllers/errors');

const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById);

app.use(psqlErrors);
app.use(customErrors);


app.all('/*', (req, res) => {
    res.status(404).send({ msg: "Wrong URL!" });
});

module.exports = app;