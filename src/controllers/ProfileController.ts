import { Request, Response } from "express";
import fs from 'fs';

import db from "../database/connection";

export default class ProfileController {

  async index(req: Request, resp: Response) {
    const { id } = req.query;

    try {

      const user = await db('users').where({ id }).select('name', 'email', 'interests');

      return resp.json(user);
      
    } catch (err) {
      return resp.status(400).send({ error: 'Não foi possível carregar o perfil'})
    }
  }

  async update (req: Request, resp: Response) {
    const { name, email, interests } = req.body;
    const { id } = req.params;
    if (req.file) {
      const destination = req.file.destination;
      const filename = req.file.filename;
      var avatar = `${destination}/${filename}`;
    }

    try {

      
      const user = await db('users').where('id', '=', id).select("*");

      if(!user[0]) {
        return resp.status(400).send({ error: 'Usuário não encontrado'})
      }

      await db('users').where('id', '=', id).update({
        name,
        email,
        interests,
        avatar
      })

      return resp.json({ message: 'Usuário editado com sucesso'})

    } catch (err) {
      return resp.status(400).send({ error: 'Não foi possível atualizar seu perfil, tente novamente'})
    }
  }
}