// const listEndpoints = require("express-list-endpoints");

//EXPRESS MODULE
const express = require("express");

const app = express();

// MIDDLEWARE FUNCTIONS
app.use(express.json());

//REQUIRE CONTROLLER.TOPICS
const { getTopics } = require("./controllers/controller.topics");

//REQUIRE CONTROLLER.ARTICLES
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/controller.articles");

//REQUIRE CONTROLLER.USERS
const {
  getUsers,
  getUserByUsername,
} = require("./controllers/controller.users");

//REQUIRE CONTROLLER.COMMENTS
const {
  getArticleIdComments,
  sendCommentByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/controller.comments");

//REQUIRE CONTROLLER.ERRORS
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/controller.errors");

// app.get("/api", (req, res) => {
//   res.status(200).send(listEndpoints(app));
// });

//TOPIC ENDPOINTS
app.get("/api/topics", getTopics);

//USER ENDPOINTS
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

//ARTICLE ENDPOINTS
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

//COMMENT ENDPOINTS
app.get("/api/articles/:article_id/comments", getArticleIdComments);
app.post("/api/articles/:article_id/comments", sendCommentByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

//ERROR HANDLING
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
