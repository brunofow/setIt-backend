import express from 'express';
import cors from 'cors';

import jwtAuth from './auth';
import routes from './routes';

const auth = jwtAuth();
const app = express();

app.use(cors());
app.use(express.json());
app.use(auth.initialize());
app.use(routes);


export default app;