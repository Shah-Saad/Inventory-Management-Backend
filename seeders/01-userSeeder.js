'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Store Owner 1',
        email: 'owner1@example.com',
        password: hashedPassword,
        role: 'store_owner',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Store Owner 2',
        email: 'owner2@example.com',
        password: hashedPassword,
        role: 'store_owner',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Customer 1',
        email: 'customer1@example.com',
        password: hashedPassword,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
