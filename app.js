const express = require("express");
const app = express();

app.use(express.json());

//require controller.topics
const { getTopics } = require("./controllers/controller.topics");

//require controller.articles
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/controller.articles");

//require controller.users
const {
  getUsers,
  getUserByUsername,
} = require("./controllers/controller.users");

//require controller.comments
const {
  getArticleIdComments,
  sendCommentByArticleId,
} = require("./controllers/controller.comments");

//require errors
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/controller.errors");

//topic endpoints
app.get("/api/topics", getTopics);

//user endpoints
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

//article endpoints
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

//comment endpoints
app.get("/api/articles/:article_id/comments", getArticleIdComments);
app.post("/api/articles/:article_id/comments", sendCommentByArticleId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

//error handler functions
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
