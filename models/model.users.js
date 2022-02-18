const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then((topics) => topics.rows);
};

exports.fetchUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1;", [username])
    .then((result) => {
      const user = result.rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `No user found for username: ${username}`,
        });
      }
      return user;
    });
};
