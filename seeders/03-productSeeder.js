'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Sugar-1kg',
        sku: 'SUGAR001',
        barcode: '1234567890',
        price: 120,
        is_global: true,
        created_by_store_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Flour-5kg',
        sku: 'FLOUR001',
        barcode: '0987654321',
        price: 500,
        is_global: false,
        created_by_store_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
