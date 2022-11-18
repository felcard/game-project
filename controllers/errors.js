exports.customErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    else {
        next(err);
    }
};
exports.psqlErrors = (err, req, res, next) => {
    if (["23502", "22P02", "23503"].includes(err.code)) {
        res.status(400).send({ msg: "Bad Request" });
    }
    next(err);
};

exports.catchAll = (err, req, res, next) => {
    res.status(500).send('Server Error!');
};