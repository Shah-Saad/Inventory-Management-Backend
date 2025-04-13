'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('stock_movements', [
      {
        store_id: 1,
        product_id: 1,
        movement_type: 'stock-in',
        quantity: 100,
        reason: 'Initial stock',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        store_id: 1,
        product_id: 2,
        movement_type: 'sale',
        quantity: 10,
        reason: 'Customer purchase',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        store_id: 2,
        product_id: 1,
        movement_type: 'manual-removal',
        quantity: 5,
        reason: 'Spoiled product',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('stock_movements', null, {});
  }
};
