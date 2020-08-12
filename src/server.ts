import express from 'express';
import cors from 'cors';

import jwtAuth from './auth';
import routes from './routes';

const auth = jwtAuth();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(auth.initialize());

app.get('/', (req, resp) => {
  return resp.json({ message: 'Works'})
})

app.listen(process.env.PORT || 3333);