import request from "supertest";

import app from "../../app";
import db from "../../database/connection";

describe("LOGIN", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("should be able to login in application", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "brunocamposfow@gmail.com",
        password: "rayepenber",
      })

      expect(response.body).toHaveProperty('token');
      console.log('Token: ', response.body.token)
      
  });
});
