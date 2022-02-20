const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

//TOPIC TESTS
describe("Topics", () => {
  //ticket 3
  describe("GET /api/topics", () => {
    //happy path
    test("Status: 200 - responds with an array of all topic objects containing a slug and a description.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body).toHaveLength(3);
          res.body.forEach((topicArrayElement) => {
            expect(topicArrayElement).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });

    //sad path
    test("Status: 404 - responds with an object containing a key of msg and a value of 'path not found'.", () => {
      return request(app)
        .get("/api/chickens")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("path not found");
        });
    });
  });
});

//USER TESTS
describe("Users", () => {
  //ticket 21
  describe("GET /api/users", () => {
    //happy path
    test("Status 200 - responds with an array of all the user objects containing the username property.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body).toHaveLength(4);
          res.body.forEach((userArrayElement) => {
            expect(userArrayElement).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  //ticket 22
  describe("GET /api/users/:username", () => {
    //happy path
    test("Status: 200 - responds with a user object with the following properties: username, name, avatar_url.", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then((res) => {
          const { user } = res.body;
          console.log(user);
          expect(user).toBeInstanceOf(Object);
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
    });

    //sad path
    test("Status 404 - responds with an object containing a key of msg and a value of 'No user found for username: rogersop'", () => {
      return request(app)
        .get("/api/users/pigeondave")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual(
            "No user found for username: pigeondave"
          );
        });
    });
  });
});

//ARTICLE TESTS
describe("Articles", () => {
  //ticket 9
  describe("GET /api/articles", () => {
    //happy path
    test("Status: 200 - an array of article objects, each of which should have the following properties: author (which is the `username` from the users table), title, article_id, topic, created_at, votes. The articles should be sorted by date in descending order.", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body).toHaveLength(12);
          res.body.forEach((articleArrayElement) => {
            expect(articleArrayElement).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            });
          });
          expect(res.body).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  //ticket 14 + ticket 5
  describe("GET /api/articles/:article_id", () => {
    //happy path
    test("Status 200 - responds with an article object with the following propertyies: author, title, article_id, body, topic, created_at, votes.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          console.log(res.body.article);
          expect(res.body.article).toBeInstanceOf(Object);
          expect(res.body.article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
    });

    //sad path
    test("Status 404 - responds with an object conatining a key of msg and value of 'No article found for article_id: 20'.", () => {
      return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("No article found for article_id: 20");
        });
    });

    //sad path
    test("Status 400 - responds with an object containing a key of msg and a value of 'Bad request'.", () => {
      return request(app)
        .get("/api/articles/kestrels")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad request");
        });
    });
  });

  //ticket 15
  describe("GET /api/articles/:article_id/comments", () => {
    //happy path
    test("Status 200 - responds with an an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author(username from users tables and body.", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          console.log(res.body.comments);
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments[0]).toBeInstanceOf(Object);
          expect(res.body.comments[0]).toMatchObject({
            article_id: expect.any(Number),
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });

    //sad path
    test("Status 404 - responds with an object conatining a key of msg and value of 'No article found for article_id: 20'.", () => {
      return request(app)
        .get("/api/articles/20/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("No comments found for article_id: 20");
        });
    });

    //sad path
    test("Status 400 - responds with an object containing a key of msg and a value of 'Bad request'.", () => {
      return request(app)
        .get("/api/articles/albatross/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad request");
        });
    });
  });

  //ticket 7
  describe("PATCH /api/articles/:article_id", () => {
    //happy path
    test("Status 200 - responds with updated article object", () => {
      const articleUpdate = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeInstanceOf(Object);
          expect(res.body.article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
          expect(res.body.article.votes).toEqual(101);
        });
    });

    //sad path
    test("Status 400 - Tries to patch with an empty object and responds with an object containing a key of msg and a value of 'Bad request'.", () => {
      const articleUpdate = {};
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad request");
        });
    });

    //sad path
    test("Status 400 - Tries to increment a number by 'turkey' and responds with an object containing a key of msg and a value of 'invalid input on request body'.", () => {
      const articleUpdate = { inc_votes: "turkey" };
      return request(app)
        .patch("/api/articles/3")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad request");
        });
    });
  });
});
