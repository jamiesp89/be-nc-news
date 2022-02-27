const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

//PATH NOT FOUND TEST
describe("Non-existent endpoints", () => {
  test("Status: 404 - responds with an object containing a key of msg and a value of 'path not found'.", () => {
    return request(app)
      .get("/api/chickens")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
});

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
          const { topics } = res.body;
          // I would refactor here to use the same response body shape as your later tests
          // Instead of the the reponse body being the topics array, put it on a key of topics
          // eg. res.body.topics rather than res.body
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topicArrayElement) => {
            expect(topicArrayElement).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
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
          const { users } = res.body;
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);
          users.forEach((usersArrayElement) => {
            expect(usersArrayElement).toMatchObject({
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
  //ticket 9 + ticket 10
  describe("GET /api/articles", () => {
    //happy path
    test("Status: 200 - an array of article objects, each of which should have the following properties: author (which is the `username` from the users table), title, article_id, topic, created_at, votes. The articles should be sorted by date in descending order.", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          articles.forEach((articleArrayElement) => {
            expect(articleArrayElement).toMatchObject({
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
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
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
          const { article } = res.body;
          expect(article).toBeInstanceOf(Object);
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11,
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
          const { comments } = res.body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(11);
          comments.forEach((commentArrayElement) => {
            expect(commentArrayElement).toMatchObject({
              article_id: expect.any(Number),
              comment_id: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });

    // We'll want an extra 200 happy path test for this endpoint
    // An empty array for no comments but the article DOES exist
    //happy path
    test("Status 200 - Responds with an empty array. A test for an article_id that exists but has zero comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          const { comments } = res.body;
          console.log(comments);
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(1);
          comments.forEach((commentArrayElement) => {
            expect(commentArrayElement).toMatchObject({
              article_id: null,
              comment_id: null,
              body: null,
              author: null,
              votes: null,
              created_at: null,
            });
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
          const article = res.body.article;
          expect(article).toBeInstanceOf(Object);
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
          });
          // I like that you have this assertion to actually check the votes property has been updated
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
          const msg = res.body.msg;
          expect(msg).toEqual("Bad request");
        });
    });

    //sad path
    test("Status 400 - Tries to increment a number by 'turkey' and responds with an object containing a key of msg and a value of 'invalid input on request body'.", () => {
      const articleUpdate = { inc_votes: "turkey" };
      // Bear in mind that you're not actually sending this request body - it's essentially the same as the above test
      return request(app)
        .patch("/api/articles/3")
        .send(articleUpdate)
        .expect(400)
        .then((res) => {
          const msg = res.body.msg;
          expect(msg).toEqual("Bad request");
        });
    });
    // For this endpoint, you'll ALSO want to assert against a 404 for article id being non existent and 400 for being invalid
    // Just like you've done for GET - but still need to make sure it works for PATCH too
  });
});
