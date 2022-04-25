const db = require("../db/connection");

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  if (!["created_at", "votes", "author", "title"].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc", "ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryStr = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr).then((results) => {
    const articles = results.rows;
    return articles;
    // }
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

exports.updateArticleById = (articleId, voteInc) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [articleId, voteInc]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for aritcle_id: ${articleId}`,
        });
      }
      // This if statement again will never trigger as the parameter `article` is actually the result object
      // Think it was better if you uncomment line 71 👍
      return article;
    });
};

exports.checkArticleExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article_id: ${id} not found`,
        });
      }
    });
};
