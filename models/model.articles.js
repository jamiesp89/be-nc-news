const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      console.log(result);
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
  // if (!voteInc) {
  //   return Promise.reject({
  //     status: 400,
  //     msg: `Bad request`,
  //   });
  // }
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [articleId, voteInc]
    )
    .then((article) => {
      // const article = result.rows[0];
      // console.log(article.rows[0]);
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for aritcle_id: ${articleId}`,
        });
      }
      return article.rows[0];
    });
};
