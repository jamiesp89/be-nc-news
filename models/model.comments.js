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
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [comment, articleId, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};

exports.checkCommentExists = (id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `comment not found`,
        });
      }
    });
};
