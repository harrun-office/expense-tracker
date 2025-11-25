"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      { name: 'Food', isDefault: true, userId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Transport', isDefault: true, userId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rent', isDefault: true, userId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Salary', isDefault: true, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', { userId: 1 }, {});
  },
};
