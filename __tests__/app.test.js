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
      .get("/api/notAPath")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
});

//TOPIC TESTS
describe("Topics", () => {
  //TICKET 3
  describe("GET /api/topics", () => {
    //HAPPY PATH
    test("Status: 200 - responds with an array of all topic objects.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toBeInstanceOf(Array);
          expect(res.body.topics).toHaveLength(3);
          res.body.topics.forEach((topicArrayElement) => {
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
  //TICKET 21
  describe("GET /api/users", () => {
    //HAPPY PATH
    test("Status 200 - responds with an array of all user objects.", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body.users).toBeInstanceOf(Array);
          expect(res.body.users).toHaveLength(4);
          res.body.users.forEach((usersArrayElement) => {
            expect(usersArrayElement).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  //TICKET 22
  describe("GET /api/users/:username", () => {
    //HAPPY PATH
    test("Status: 200 - responds with the specified user object.", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then((res) => {
          expect(res.body.user).toBeInstanceOf(Object);
          expect(res.body.user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
    });

    //SAD PATH
    test("Status 404 - responds with an object containing a key of msg and a value of 'No user found for username: pigeondave'", () => {
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
  //TICKET 9 + TICKET 10
  describe("GET /api/articles", () => {
    //HAPPY PATH
    test("Status: 200 - an array of article objects, each of which should have the following properties: author (which is the `username` from the users table), title, article_id, topic, created_at, votes. The articles should be sorted by date in descending order.", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeInstanceOf(Array);
          expect(res.body.articles).toHaveLength(12);
          res.body.articles.forEach((articleArrayElement) => {
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
          expect(res.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });

  //TICKET 14 + TICKET 5
  describe("GET /api/articles/:article_id", () => {
    //HAPPY PATH
    test("Status 200 - responds with an article object with the following propertyies: author, title, article_id, body, topic, created_at, votes.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeInstanceOf(Object);
          expect(res.body.article).toMatchObject({
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

    //SAD PATH
    test("Status 404 - responds with an object conatining a key of msg and value of 'No article found for article_id: 20'.", () => {
      return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("No article found for article_id: 20");
        });
    });

    //SAD PATH
    test("Status 400 - responds with an object containing a key of msg and a value of 'Bad request'.", () => {
      return request(app)
        .get("/api/articles/kestrels")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad request");
        });
    });
  });

  //TICKET 15
  describe("GET /api/articles/:article_id/comments", () => {
    //HAPPY PATH
    test("Status 200 - responds with an an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author(username from users tables and body.", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeInstanceOf(Array);
          expect(res.body.comments).toHaveLength(11);
          res.body.comments.forEach((commentArrayElement) => {
            expect(commentArrayElement).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });

    //HAPPY PATH
    test("Status 200 - Responds with an empty array. Article exists but has zero comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([]);
        });
    });

    //SAD PATH
    test("Status 404 - responds with an object conatining a key of msg and value of 'No article found for article_id: 20'.", () => {
      return request(app)
        .get("/api/articles/20/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("Article_id: 20 not found");
        });
    });

    //SAD PATH
    test("Status 400 - responds with an object containing a key of msg and a value of 'Bad request'.", () => {
      return request(app)
        .get("/api/articles/albatross/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("Bad request");
        });
    });
  });

  //TICKET 7
  describe("PATCH /api/articles/:article_id", () => {
    //HAPPY PATH
    test("Status 200 - responds with updated article object", () => {
      const articleUpdate = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeInstanceOf(Object);
          expect(res.body.article).toMatchObject({
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

    //SAD PATH
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

    //SAD PATH
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

  //TICKET 11
  describe("POST /api/articles/:article_id/comments", () => {
    //HAPPY PATH
    test("responds with status 201 and an object of the posted comment", () => {
      const req = {
        username: "rogersop",
        comment: "Yeah I agree. Totally!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(req)
        .expect(201)
        .then((res) => {
          expect(res.body.comment.body).toEqual("Yeah I agree. Totally!");
        });
    });

    //SAD PATH
    test('responds with status 404 and msg "article not found" for valid but NON-EXISTENT ID', () => {
      const req = {
        username: "rogersop",
        comment: "Yeah I agree. Totally!",
      };
      return request(app)
        .post("/api/articles/99999/comments")
        .send(req)
        .expect(404)
        .then((res) => {
          console.log(res.body);
          expect(res.body).toEqual({
            msg: "Not found",
          });
        });
    });

    //SAD PATH
    test('responds with status 400 and msg "bad request" when passed a bad ID', () => {
      const req = {
        username: "rogersop",
        comment: "Yeah I agree. Totally!",
      };
      return request(app)
        .post("/api/articles/invalid_id/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({ msg: "Bad request" });
        });
    });

    //SAD PATH
    test('responds with status 400 and msg "bad request" when req body is malformed', () => {
      const req = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });

    //SAD PATH
    test('responds with status 400 and msg "bad request" when req body uses incorrect type', () => {
      const req = { inc_votes: "ten" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad request");
        });
    });
  });
});
