const { fetchTopics } = require('../models/model.topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
      // here is where you can apply a key of topics to the response body
    })
    .catch(next);
};
