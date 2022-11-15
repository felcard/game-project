exports.wrongPaths = (req, res, next) => {
    res.status(404).send({ msg: "Wrong URL!" });
};


exports.catchAll = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' });
    } else res.status(500).send({ msg: 'Internal Server Error' });
};