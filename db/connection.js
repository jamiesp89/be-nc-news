// require the pg module
const { Pool } = require("pg");

// set environment variables
const ENV = process.env.NODE_ENV || "development";

// require the dotenv module
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

// check that the .env file has the required variables
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

// set the configuration for the database
const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

// export the connection to the database
module.exports = new Pool(config);
