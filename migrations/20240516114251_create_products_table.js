// migrations/{timestamp}_add_multilingual_fields_to_products.js
exports.up = function(knex) {
  return knex.schema.table('products', function(table) {
    table.string('name_en').notNullable();
    table.string('name_ru').notNullable();
    table.string('name_geo').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('products', function(table) {
    table.dropColumn('name_en');
    table.dropColumn('name_ru');
    table.dropColumn('name_geo');
  });
};
