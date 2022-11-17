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