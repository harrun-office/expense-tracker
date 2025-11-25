"use strict";

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'categories',
      timestamps: true,
    }
  );

  Category.associate = function (models) {
    Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
  };

  return Category;
};
