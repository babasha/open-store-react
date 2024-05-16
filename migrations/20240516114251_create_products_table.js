/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};

// migrations/{timestamp}_create_products_table.js
exports.up = function(knex) {
    return knex.schema.createTable('products', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('price').notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('products');
  };
  