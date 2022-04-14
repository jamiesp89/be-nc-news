const {
  fetchArticles,
  fetchArticleById,
  fetchArticleIdComments,
  updateArticleById,
  postCommentByArticleId,
} = require("../models/model.articles");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleIdComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleIdComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, comment } = req.body;

  postCommentByArticleId(article_id, username, comment)
    .then((body) => {
      res.status(201).send({ body });
    })
    .catch(next);
};
