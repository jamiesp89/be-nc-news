const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET api/topics", () => {
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

  test("Status: 404 - responds with an object with a key of msg and a value of Path not found", () => {
    return request(app)
      .get("/api/chickens")
      .expect(404)
      .then((res) => {
        console.log(res.body);
        expect(res.body.msg).toEqual("path not found");
      });
  });
});
