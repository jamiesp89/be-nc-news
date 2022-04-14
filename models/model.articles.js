const { user } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then((results) => {
      const articles = results.rows;
      return articles;
      // }
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
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
      // This if statement again will never trigger as the parameter `article` is actually the result object
      // Think it was better if you uncomment line 71 👍
      return article.rows[0];
    });
};

exports.postCommentByArticleId = (articleId, username, comment) => {
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING body, author;",
      [comment, articleId, username]
    )
    .then((result) => {
      console.log(result);
      const { body } = result.rows[0];
      return body;
    });
};
