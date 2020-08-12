import { Request, Response } from 'express';

import jwtAuth from '../auth';
import db from '../database/connection';
import passwordTool from '../utils/PasswordTool';

const auth = jwtAuth();

export default class SessionController {
  async login (req: Request, resp: Response) {

  }

  async register (req: Request, resp:Response) {
    const { name, email, password, interests } = req.body;
    const avatar = req.file.destination;

    const encryptedPassword = await passwordTool.hash(password);

    try {
      const user = await db('users').insert({
        name,
        avatar,
        email,
        password: encryptedPassword,
        interests
      })

      return resp.json({ user })
    } catch(error) {
      console.log(error)
      return resp.json({ error })
    }

    
  }
  
}
