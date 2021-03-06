const { checkArticleExists } = require("../models/model.articles");
const {
  fetchArticleIdComments,
  postCommentByArticleId,
  removeCommentByCommentId,
  checkCommentExists,
} = require("../models/model.comments");

exports.getArticleIdComments = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchArticleIdComments(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.sendCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, comment } = req.body;

  postCommentByArticleId(article_id, username, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;

  Promise.all([
    checkCommentExists(comment_id),
    removeCommentByCommentId(comment_id),
  ])
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
