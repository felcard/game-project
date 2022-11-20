const db = require('../db/connection.js');
const { utilCheckReviewExist, utilCheckUsernameExist } = require('../utils/utils.js');

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories;').then(categories => {
        return categories.rows;
    });
};

exports.selectReviews = (query) => {
    const { category, sort_by, order } = query;
    let queryStr = 'SELECT * FROM reviews ';
    if (category) {
        queryStr += 'WHERE category = $1 ';
    }
    if (sort_by) {
        if (['review_id', 'title', 'designer', 'owner', 'review_img_url', 'review_body', 'category', 'created_at', 'votes'].includes(sort_by)) {
            queryStr += `ORDER BY ${sort_by}`;
        } else {
            return Promise.reject({ status: 400, msg: 'Invalid sort query' });
        }
    } else {
        queryStr += `ORDER BY created_at`;
    }
    if (order) {
        if (['ASC', 'DESC'].includes(order)) {
            queryStr += ` ${order}`;
        }
        else {
            return Promise.reject({ status: 400, msg: 'Invalid order query' });
        }
    } else {
        queryStr += ' DESC;';
    }
    return db.query(queryStr, [category ? category : '']).then(reviews => {
        if (!reviews.rows.length) {
            return Promise.reject({
                status: 404,
                msg: 'Not Found',
            }
            );
        }
        return reviews.rows;
    });
};

exports.fetchReviewById = (review_id) => {
    return db.query('SELECT reviews.owner,reviews.title,reviews.review_body,reviews.category,reviews.review_img_url,reviews.created_at,reviews.votes,reviews.designer, COUNT(comments.review_id) AS comment_count FROM reviews INNER JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;', [review_id]).then(review => {
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

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users;').then(users => {
        return users.rows;
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
    return utilCheckReviewExist(review_id)
        .then(() => {
            return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;', [inc_votes, review_id]);
        }).then(updatedVote => {
            if (updatedVote.rows[0].votes < 0) {
                const newObj = Object.assign({}, updatedVote.rows[0]);
                newObj.votes = 0;
                return newObj;
            }
            return updatedVote.rows;
        });
};

