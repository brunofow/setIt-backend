import request from "supertest";

import app from "../../app";
import db from "../../database/connection";

describe("USERS", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("should be able to create a user", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        name: "Bruno Test",
        email: "brunocamposfow@gmail.com",
        password: "rayepenber",
        interests: "Programação"
      })

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Usuário cadastrado com sucesso');
      
  });
});
