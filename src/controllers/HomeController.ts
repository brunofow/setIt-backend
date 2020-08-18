import { Request, Response } from "express";

import db from "../database/connection";

export default class HomeController {
  async ranking(req: Request, resp: Response) {
    try {
      const guides = await db("guides")
        .join("users", "users.id", "=", "guides.user_id")
        .select([
          "guides.id",
          "guides.name as guide_name",
          "guides.category",
          "users.name",
          "users.avatar",
        ])
        .orderBy("rating", "desc")
        .limit(5);

      return resp.json(guides);
    } catch (err) {
      return resp
        .status(400)
        .send({ error: "Erro ao mostrar ranking de guias" });
    }
  }

  async recent(req: Request, resp: Response) {
    try {
      const guides = await db("guides")
        .join("users", "users.id", "=", "guides.user_id")
        .select([
          "guides.id",
          "guides.name as guide_name",
          "guides.category",
          "users.name",
          "users.avatar",
        ])
        .orderBy("guides.id", "desc")
        .limit(5);

      return resp.json(guides);
    } catch (err) {
      return resp
        .status(400)
        .send({ error: "Não foi possível mostrar os mais recentes" });
    }
  }

  async interests(req: Request, resp: Response) {
    const { interests } = req.query;

    try {
      const guides = await db("guides")
        .where({category: interests})
        .join('users', 'users.id', '=', 'guides.user_id')
        .select([
          'guides.id',
          'guides.name as guide_name',
          'guides.category',
          'users.name',
          'users.avatar'
        ])
        .limit(5)

      return resp.json(guides);
    } catch( err ) {
      return resp.status(400).send({ error: 'Erro ao mostrar com base no interesse'})
    }
  }
}
