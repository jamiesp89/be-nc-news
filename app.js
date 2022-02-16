const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/controller.topic");
const { getArticleById } = require("./controllers/controller.articles");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(404).send({ msg: "Path not found" });
// });

module.exports = app;
