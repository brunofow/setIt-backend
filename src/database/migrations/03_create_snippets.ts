import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("snippets", (table) => {
    table.increments("id").primary();
    table.string("description").notNullable();
    table.string("snippet").notNullable();

    table
      .integer("guide_id")
      .notNullable()
      .references("id")
      .inTable("guides")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("snippets");
}
