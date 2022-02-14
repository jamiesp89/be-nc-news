const { fetchTopics } = require("../models/model.topic");

exports.getTopics = (req, res, next) => {
  console.log("Hi from the topics controller file");
  fetchTopics().then((topics) => {
    res.status(200).send(topics);
  });
};
