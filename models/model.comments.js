const db = require("../db/connection");

exports.fetchArticleIdComments = (article_id) => {
  return db
    .query(
      `SELECT 
    comment_id, 
    votes, 
    created_at, 
    author, 
    body
    FROM comments
    WHERE article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.postCommentByArticleId = (articleId, username, comment) => {
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING body;",
      [comment, articleId, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};
