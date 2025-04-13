'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Stores', [
      {
        name: 'Main Kiryana',
        owner_id: 2,
        location: 'Karachi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sub Kiryana',
        owner_id: 3,
        location: 'Lahore',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stores', null, {});
  }
};
