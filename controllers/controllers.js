const { selectCategories } = require('../models/models.js');

exports.getCategories = (req, res, next) => {
    selectCategories().then(categorie => {
        res.status(200).send({categorie});
    });
};