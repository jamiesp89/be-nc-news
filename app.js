const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/controller.topics");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/controller.articles");
const { getUserByUsername } = require("./controllers/controller.users");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

//topic endpoints
app.get("/api/topics", getTopics);
//user endpoints
app.get("/api/users/:username", getUserByUsername);
//article endpoints
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
