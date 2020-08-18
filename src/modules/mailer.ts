import path from 'path';
import nodemailer from 'nodemailer';
import { host, port, user, pass } from '@configs/mailerConfig.json';
import dotenv from 'dotenv';

dotenv.config();

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  },
  tls: {
    rejectUnauthorized: false
  }
});


export default transport;