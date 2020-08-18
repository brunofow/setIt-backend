import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('votes', table => {
    table.increments('id').primary();
    table.integer('guide_id').references('id').inTable('guides');
    table.integer('user_id').notNullable();
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('votes');
}