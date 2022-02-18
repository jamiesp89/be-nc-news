const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/controller.topic");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/controller.articles");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
