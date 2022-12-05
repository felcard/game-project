const express = require("express");
const cors = require("cors");
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchVotesByReviewId,
  getUsers,
  deleteComment,
  getApi,
} = require("./controllers/controllers.js");
const { catchAll, customErrors, psqlErrors } = require("./controllers/errors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getApi);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.patch("/api/reviews/:review_id", patchVotesByReviewId);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(psqlErrors);
app.use(customErrors);
app.use(catchAll);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Wrong URL!" });
});

module.exports = app;
