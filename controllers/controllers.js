const {
  selectCategories,
  selectReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
  updateVotesByReviewId,
  fetchUsers,
  removeComment,
} = require("../models/models.js");
const endPoints = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  res.status(200).send(endPoints);
};

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  selectReviews(req.query)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getUsers = (req, res, nest) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { body, username } = req.body;
  if (!body || !username) {
    res.status(400).send({ msg: "Bad Request" });
  }
  insertCommentByReviewId(review_id, req.body)
    .then((insertedComment) => {
      res.status(201).send({ insertedComment });
    })
    .catch(next);
};

exports.patchVotesByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesByReviewId(inc_votes, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.comment_id)
    .then((deletedComment) => {
      if (!deletedComment.length) {
        res.status(404).send({ msg: "Comment does not exist" });
      }
      res.status(204).send();
    })
    .catch(next);
};
