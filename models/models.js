const db = require('../db/connection.js');
const reviews = require('../db/data/test-data/reviews.js');

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
    return db.query('SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC;', [review_id]).then(comments => {
        if (!comments.rows[0]) {
            return Promise.reject({
                status: 404,
                msg: 'Not Found',
            }
            );
        }
        return comments.rows;
    });
};