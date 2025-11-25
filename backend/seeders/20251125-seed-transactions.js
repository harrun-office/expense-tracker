"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transactions', [
      {
        amount: 12.5,
        type: 'expense',
        date: new Date().toISOString().slice(0,10),
        note: 'Lunch',
        userId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 1500.0,
        type: 'income',
        date: new Date().toISOString().slice(0,10),
        note: 'Monthly salary',
        userId: 1,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', { userId: 1 }, {});
  },
};
