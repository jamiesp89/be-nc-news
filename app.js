const express = require('express');
const app = express();

app.use(express.json());

//require controller.topics
const { getTopics } = require('./controllers/controller.topics');

//require controller.articles
const {
  getArticles,
  getArticleById,
  getArticleIdComments,
  patchArticleById,
  sendCommentByArticleId,
} = require('./controllers/controller.articles');

//require controller.users
const {
  getUsers,
  getUserByUsername,
} = require('./controllers/controller.users');

//require errors
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require('./errors');

//topic endpoints
app.get('/api/topics', getTopics);

//user endpoints
app.get('/api/users', getUsers);
app.get('/api/users/:username', getUserByUsername);

//article endpoints
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getArticleIdComments);
app.patch('/api/articles/:article_id', patchArticleById);
app.post('/api/articles/:article_id/comments', sendCommentByArticleId)

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

//error handler functions
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

// This file looks bang on!
// I would recommend however that all of your requires appear at the top of the file. purely by convention alone
