"use strict";
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = bcrypt.hashSync('password123', 10);
    await queryInterface.bulkInsert('users', [
      {
        name: 'Demo User',
        email: 'demo@example.com',
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'demo@example.com' }, {});
  },
};
