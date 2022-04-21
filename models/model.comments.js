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
