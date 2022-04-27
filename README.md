# Northcoders News API

## Description

### Background

A backend project created during my time on the [Northcoders Bootcamp](https://northcoders.com/), which will be utilized by my frontend project, also made during the bootcamp, to create a Reddit-style forum API.

### Tech overview

This project is a CRUD RESTful API, built in a Node.js environment, running on an Express.js server and uses a PostgreSQL database. Node-postgres is used to interact with postgreSQL from the Node.js environment.

It was created using a Test Driven Development approach, for which the Jest JavaScript Testing Framework was used.

A hosted version can be found [here](https://be-nc-news-1.herokuapp.com/api)

### Concept

An API similar in function to the popular social news aggregation, web content rating, and discussion website - Reddit.

It allows users to create, read, update and delete articles. It also allows users to comment on articles, and vote articles and comments up or down.

## Getting started

### Cloning

To get started, navigate to location you want to install the repository. Then, in the terminal, run the following command:

`git clone https://github.com/jamiesp89/be-nc-news.git`

### Install dependancies

Once cloned, cd(change directory) into the cloned repository folder and run the command:

`npm i`

### .ENV files

You will need to create two .env files: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

### Database

Ensure PostgreSQL is installed on your machine for the following to work correctly.

With PostgreSQL installed, you can create the databases with the command:

`npm run setup-dbs`

To seed the databases, run:

`npm run seed`

## Testing

To run the tests written in the tests directory, use the command:

`npm t`

### Tested tech versions

Node.js version `v17.1.0`

PostgreSQL version `14.0`

## Thank you

Thank you for taking the time to look at my repository - Jamie Speirs :slightly_smiling_face:
