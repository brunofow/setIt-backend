import { Request, Response } from "express";

import db from "../database/connection";

export default class RatingController {
  async index(req: Request, resp: Response) {
    const { id } = req.query;

    try {
      const guide_rating = await db("guides").where({ id }).select("rating");

      const rating = guide_rating[0].rating.toFixed(1);

      return resp.json({ rating: Number(rating)});
    } catch (err) {
      return resp.status(400).send({ error: "Erro ao mostrar avaliações" });
    }
  }

  async store(req: Request, resp: Response) {
    const { rate } = req.body;
    const { id } = req.params;
    const { user_id } = req.query;

    try {
      const guide = await db("guides").where({ id }).select("*");
      const voted = await db('votes').where('guide_id', '=', id).select('user_id');

      if(voted) {
        console.log('Votações: ', voted);
        voted.forEach(vote => {
          if(vote.user_id == user_id) {
            return resp.status(400).send({ error: 'Você ja avaliou esse guia' })
          }
        })
      }

      const total_votes = guide[0].total_votes + 1;
      const total_rating = guide[0].total_rating + rate;
      const rating = total_rating / total_votes;

      await db("guides").where({ id }).update({
        total_votes,
        total_rating,
        rating,
      });

      await db('votes').insert({
        guide_id: id,
        user_id
      })

      return resp.json({ message: "Obrigado por sua avaliação" });
    } catch (err) {
      console.log('Erro',)
      return resp
        .status(400)
        .send({ error: "Erro ao enviar sua avaliação, tente novamente" });
    }
  }
}
