import { Request, Response } from "express";

import db from "../database/connection";

interface SnippetItem {
  id: number;
  description: string;
  snippet: string;
}

export default class GuideController {
  async index(req: Request, resp: Response) {
    const { id } = req.query;

    try {
      const guides = await db("guides").where({ id }).select("*");

      const about = guides[0];

      const snippets = await db("snippets")
        .where("guide_id", "=", about.id)
        .select("*");

      const guide = [{ about }, { snippets }];

      return resp.json({ guide });
    } catch (err) {
      console.log("Erro: ", err);
      return resp.status(400).send({ error: "Erro ao mostrar guia" });
    }
  }

  async store(req: Request, resp: Response) {
    const { name, category, introduction, snippets } = req.body;
    const { id } = req.query;

    const trx = await db.transaction();

    try {
      const user = await trx("users").where({ id }).select("*");

      if (!user[0]) {
        return resp.status(400).json({ error: "Usuário não encontrado" });
      }

      console.log("User: ", user);

      console.log("Id: ", id);

      const guideId = await trx("guides").insert({
        name,
        category,
        introduction,
        user_id: id,
      });

      const guide_id = guideId[0];

      const guideSnippet = snippets.map((snippetItem: SnippetItem) => {
        return {
          guide_id,
          description: snippetItem.description,
          snippet: snippetItem.snippet,
        };
      });

      await trx("snippets").insert(guideSnippet);

      await trx.commit();

      return resp.status(201).json({ message: "Guia criado com sucesso" });
    } catch (err) {
      return resp
        .status(400)
        .json({ error: "Não foi possível criar o guia, tente novamente " });
    }
  }

  async update(req: Request, resp: Response) {
    const { name, category, introduction, snippets } = req.body;
    const { id } = req.params;
    const { user_id } = req.query;

    const trx = await db.transaction();

    try {
      const guide = await trx("guides").where({ id }).select("*");

      if (guide[0].user_id != user_id) {
        return resp
          .status(401)
          .send({ error: "Você não tem permissão para isso" });
      }

      await trx("guides").update({
        name,
        category,
        introduction,
        user_id,
      });

      snippets.forEach(async (snippetItem: SnippetItem) => {
        await db("snippets")
          .where('id', '=', snippetItem.id)
          .update(snippetItem);
      });

      await trx.commit();

      return resp.status(201).json({ message: "Guia alterado com sucesso" });
    } catch (err) {
      console.log(err);
      return resp
        .status(400)
        .json({ error: "Não foi possível atualizar o guia, tente novamente " });
    }
  }

  async destroy(req: Request, resp: Response) {
    const { id } = req.params;
    const { user_id } = req.query;

    try {
      const guide = await db("guides").where({ id }).select("*");

      if (guide[0].user_id != user_id)
        return resp
          .status(401)
          .send({ error: "Você não tem permissão para isso" });

      await db("guides").where({ id }).delete();

      return resp.status(200).send();
    } catch (err) {
      return resp
        .status(400)
        .send({ error: "Não foi possível remover o guia, tente novamente" });
    }
  }

  async search(req: Request, resp: Response) {
    const { searched } = req.query;

    try {
      const guides = await db("guides").select("id", "name", "category");

      const mapped = guides.map((guide) => {
        if (guide.name.toLowerCase().includes(String(searched).toLowerCase()))
          return guide;
      });

      const result = mapped.filter((item) => {
        return item != null;
      });

      return resp.json({ result });
    } catch (err) {
      return resp
        .status(400)
        .send({ error: `Erro ao pesquisar o termo ${searched}` });
    }
  }
}
