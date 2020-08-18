import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("guides", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("category").notNullable();
    table.string("introduction").notNullable();
    table.integer('total_rating');
    table.integer('total_votes');
    table.float('rating')

    table.integer("user_id").notNullable().references("id").inTable("users");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("guides");
}
