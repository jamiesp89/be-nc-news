const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC;")
    .then((articles) => articles.rows);
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      if (article) {
        article.comment_count = parseInt(article.comment_count);
      }
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

exports.fetchArticleIdComments = (article_id) => {
  return db
    .query(
      "SELECT articles.article_id, comments.* FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1;",
      [article_id]
    )
    .then((result) => {
      const comments = result.rows;
      console.log(comments);
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article_id: ${article_id}`,
        });
      }
      return comments;
    });
};

exports.updateArticleById = (articleId, voteInc) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [articleId, voteInc]
    )
    .then((article) => {
      // const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for aritcle_id: ${articleId}`,
        });
      }
      return article.rows[0];
    });
};
