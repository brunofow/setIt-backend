import knex from 'knex';
import path from 'path';
const configuration = require('../../knexfile');

const config = process.env.NODE_ENV == 'test' ? configuration.test : configuration.development;

const connection = knex(config);

export default connection;