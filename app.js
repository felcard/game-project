const express = require('express');
const { getCategories } = require('./controllers/controllers.js');
const { catchAll } = require('./controllers/errors');

const app = express();

app.get('/api/categories', getCategories);

app.all('/*', (req,res) => {
    res.status(404).send({ msg: "Wrong URL!" });
});

app.use(catchAll);

module.exports = app;