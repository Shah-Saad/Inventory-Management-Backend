'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Inventories', [
      {
        store_id: 1,
        product_id: 1,
        quantity: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        store_id: 1,
        product_id: 2,
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        store_id: 2,
        product_id: 1,
        quantity: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Inventories', null, {});
  }
};
