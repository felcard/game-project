exports.wrongPaths = (req, res, next) => {
    res.status(404).send({ msg: "Wrong URL!" });
};