const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

//PATH NOT FOUND TEST
describe("Non-existent endpoints", () => {
  test("Status: 404 - path provided does not exist.", () => {
    return request(app)
      .get("/api/notAPath")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found");
      });
  });
});

//TOPIC TESTS
describe("TOPICS", () => {
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
describe("USERS", () => {
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
    test("Status 404 - valid username but non-existent user.", () => {
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
describe("ARTICLES", () => {
  //TICKET 9 + TICKET 10
  describe("GET /api/articles", () => {
    //HAPPY PATH
    test("Status: 200 - responds with an array of article objects, sorted by date in descending order.", () => {
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
    test("Status 200 - responds with the specified article object.", () => {
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
    test("Status 404 - valid article ID but non-existent article.", () => {
      return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("No article found for article_id: 20");
        });
    });

    //SAD PATH
    test("Status 400 - invalid article ID.", () => {
      return request(app)
        .get("/api/articles/kestrels")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("bad request");
        });
    });
  });

  //TICKET 7
  describe("PATCH /api/articles/:article_id", () => {
    //HAPPY PATH
    test("Status 200 - responds with an article object including the updated vote count.", () => {
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
        });
    });

    //SAD PATH
    test("Status 404 - valid request but a non-existent article", () => {
      const req = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/1111111")
        .send(req)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("No article found for aritcle_id: 1111111");
        });
    });

    //SAD PATH
    test("Status 400 - request has a malformed body / missing required fields.", () => {
      const articleUpdate = {};
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(400)
        .then((res) => {
          const msg = res.body.msg;
          expect(msg).toEqual("bad request");
        });
    });
  });
});

//COMMENT TESTS
describe("COMMENTS", () => {
  //TICKET 15
  describe("GET /api/articles/:article_id/comments", () => {
    //HAPPY PATH
    test("Status 200 - responds with an an array of comments for the given article_id.", () => {
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
    test("Status 404 - valid article ID but non-existent article.", () => {
      return request(app)
        .get("/api/articles/20/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("Article_id: 20 not found");
        });
    });

    //SAD PATH
    test("Status 400 - invalid article ID..", () => {
      return request(app)
        .get("/api/articles/albatross/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("bad request");
        });
    });
  });

  //TICKET 11
  describe("POST /api/articles/:article_id/comments", () => {
    //HAPPY PATH
    test("Status 201 - responds with the successfully posted comment", () => {
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
    test("Status 404 - valid but non-existent article ID", () => {
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
            msg: "not found",
          });
        });
    });

    //SAD PATH
    test("Status 400 - invalid article ID", () => {
      const req = {
        username: "rogersop",
        comment: "Yeah I agree. Totally!",
      };
      return request(app)
        .post("/api/articles/invalid_id/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({ msg: "bad request" });
        });
    });

    //SAD PATH
    test("Status 400 - request has a malformed body / missing required fields", () => {
      const req = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
  });
});
