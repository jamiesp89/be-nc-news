const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/controller.topic");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(404).send({ msg: "Path not found" });
// });

module.exports = app;
