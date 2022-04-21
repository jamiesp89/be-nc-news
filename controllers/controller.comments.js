const { checkArticleExists } = require("../models/model.articles");
const { fetchArticleIdComments } = require("../models/model.comments");

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
