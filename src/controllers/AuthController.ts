import { Request, Response } from "express";
import jwt from "jwt-simple";
import dotenv from "dotenv";
import crypto from "crypto";

import jwtAuth from "../auth";
import db from "../database/connection";
import passwordTool from "../utils/PasswordTool";
import mailer from "../modules/mailer";
import template from "../resources/mail/auth/template";
import authConfig from '@configs/authConfig.json';

dotenv.config();
const auth = jwtAuth();

export default class SessionController {
  async login(req: Request, resp: Response) {
    const { email, password } = req.body;
    const user = await db("users").select("*").where("email", "=", email);

    if (!user[0]) {
      return resp.status(400).json({ error: "Usuário não encontrado" });
    }

    const encryptedPassword = user[0].password;

    const match = await passwordTool.compare(password, encryptedPassword);

    if (match) {
      const payload = { id: user[0].id };
      const token = jwt.encode(payload, authConfig.jwt_secret);
      resp.json({ token });
    } else {
      return resp.status(400).json({ error: "Senha incorreta" });
    }
  }

  async register(req: Request, resp: Response) {
    const { name, email, password, interests } = req.body;
    if (req.file) {
      const destination = req.file.destination;
      const filename = req.file.filename;
      var avatar = `${destination}/${filename}`;
    }

    const dbUser = await db("users").select("*").where("email", "=", email);

    if (dbUser[0]) {
      return resp.status(400).json({ error: "Usuário já cadastrado" });
    }

    const encryptedPassword = await passwordTool.hash(password);

    try {
      await db("users").insert({
        name,
        avatar,
        email,
        password: encryptedPassword,
        interests,
      });

      return resp.json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
      console.log(error);
      return resp.json({ error });
    }
  }

  async forgot_password(req: Request, resp: Response) {
    const { email } = req.body;

    try {
      const user = await db("users").where("email", "=", email).select("*");

      if (!user) {
        return resp.status(400).json({ error: "Usuário não encontrado" });
      }

      const token = crypto.randomBytes(6).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await db("users").where("email", "=", email).update({
        recoverToken: token,
        recoverTokenExpires: now,
      });

      mailer.sendMail({
        to: email,
        subject: "Recuperar senha",
        from: "set it  <workfowtech@gmail.com>",
        html: template(token),
      });

      return resp.json({ message: "Email enviado" });
    } catch (err) {
      resp
        .status(400)
        .json({ error: "Erro ao recuperar senha, tente novamente" });
    }
  }

  async recover_password(req: Request, resp: Response) {
    const { email, token, password } = req.body;

    const newPassword = await passwordTool.hash(password);

    const user = await db("users").where("email", "=", email).select("*");

    if (token != user[0].recoverToken) {
      return resp.status(400).json({ error: "Token inválido" });
    }

    const now = new Date();

    if (now > user[0].recoverTokenExpires) {
      return resp.status(400).json({ error: "Token expirado" });
    }

    await db("users").where("email", "=", email).update({
      password: newPassword,
    });

    return resp.json({ message: "Senha alterada com sucesso" });
  }
}
