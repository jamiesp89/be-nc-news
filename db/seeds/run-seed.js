// import development data
const devData = require("../data/development-data/index.js");
// import seed function
const seed = require("./seed.js");
// import connection to database
const db = require("../connection.js");

const runSeed = () => {
  // run the seed function
  return (
    seed(devData)
      // close the database connection
      .then(() => db.end())
  );
};

// run the seed file
runSeed();
