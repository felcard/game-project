const db = require('../db/connection.js');
const { utilCheckReviewExist, utilCheckUsernameExist, utilCheckPositiveVotes } = require('../utils/utils.js');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;').then(categories => {
        return categories.rows;
    });
};

exports.selectReviews = () => {
    return db.query('SELECT reviews.owner,reviews.title,reviews.review_id,reviews.category,reviews.review_img_url,reviews.created_at,reviews.votes,reviews.designer, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;').then(reviews => {
        return reviews.rows;
    });
};

exports.fetchReviewById = (review_id) => {
    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id]).then(review => {
        if (!review.rows[0]) {
            return Promise.reject({
                status: 404,
                msg: 'Not Found',
            }
            );
        }
        return review.rows;
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
    return utilCheckReviewExist(review_id)
        .then(() => {
            return db.query('SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;', [review_id]);
        })
        .then(comments => {
            return comments.rows;
        });
};

exports.insertCommentByReviewId = (review_id, { username, body }) => {
    return utilCheckReviewExist(review_id)
        .then(() => {
            return utilCheckUsernameExist(username)
                .then(() => {
                    return db.query(`INSERT INTO comments (body,review_id,author) VALUES ($1,$2,$3) RETURNING*;`, [body, review_id, username]);
                }).then(insertedComment => {
                    return insertedComment.rows[0];
                });
        });
};

exports.updateVotesByReviewId = (inc_votes, review_id) => {
    return utilCheckPositiveVotes(review_id, inc_votes)
        .then(() => {
            return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 AND votes + $1 >= 0 RETURNING *;', [inc_votes, review_id]);
        }).then(updatedVote => {
            return updatedVote.rows;
        });
};