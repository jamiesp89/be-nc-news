const db = require("../db/connection");

exports.fetchTopics = () => {
  console.log("Hi from the topic models file");
  return db.query("SELECT * FROM topics;").then((result) => result.rows);
};
