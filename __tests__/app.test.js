const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
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

  test("Status: 404 - responds with an object containing a key of msg and a value of 'path not found'.", () => {
    return request(app)
      .get("/api/chickens")
      .expect(404)
      .then((res) => {
        console.log(res.body);
        expect(res.body.msg).toEqual("path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Status 200 - responds with an article object with the following propertyies: author, title, article_id, body, topic, created_at, votes.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        console.log(typeof res.body.msg.created_at);
        expect(res.body.msg).toBeInstanceOf(Object);
        expect(res.body.msg).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  test.skip("Status 404 - responds with an object conatining a key of msg and a value of 'valid but non-existent id'.", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("valid but non-existent id");
      });
  });

  test.skip("Status 400 - responds with an object containing a key of msg and a value of 'bad request'.", () => {
    return request(app)
      .get("/api/articles/kestrels")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("bad request");
      });
  });
});
