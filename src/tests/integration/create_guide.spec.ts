import request from "supertest";

import app from "../../app";
import db from "../../database/connection";

describe("GUIDES", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("should be able to create a guide", async () => {
    const response = await request(app)
      .post("/guides")
      .send({
        name: "Ambiente Javascript",
        category: "Programação",
        introduction: "Guia simples sobre ambientes javascript",
        snippets: [
          {description: 'Parte 1', snippet: 'pipipipopopo1'},
          {description: 'Parte 2', snippet: 'popopopipipi' }
        ]
      })
      .query({ id: '1' })
      .set('Authorization', 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.UgpE2ORVaErN-wCKvgFkCbElI_20mFsgsGuCWhw7Dqk')

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Guia criado com sucesso')
  });
});
