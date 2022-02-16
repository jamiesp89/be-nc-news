const { fetchArticleById } = require("../models/model.articles");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ msg: article });
    })
    .catch(next);
};
