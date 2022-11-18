const db = require('../db/connection.js');

exports.utilCheckReviewExist = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]).then(res => {
        if (res.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: 'Review not Found',
            }
            );
        }
    });
};

exports.utilCheckUsernameExist = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`,[username])
    .then(res => {
        if (res.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: 'Username not Found'
            }
            );
        }
    });
};

exports.utilCheckPositiveVotes = (review_id, inc_votes) => {
    return db.query('SELECT votes FROM reviews WHERE review_id = $1;', [review_id])
        .then(votes => {
            if (!votes.rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: 'Not Found'
                });
            }
            if (votes.rows[0].votes + inc_votes < 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'Negative Vote outcome'
                });
            }
        });
};