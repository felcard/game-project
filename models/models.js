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