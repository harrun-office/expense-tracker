const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');
const Category = require('../models/Category');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({
    where: {
      [Op.or]: [{ userId: req.user.id }, { isDefault: true }],
    },
    order: [['createdAt', 'ASC']],
  });

  res.json({ categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const category = await Category.create({ name, userId: req.user.id });
  res.status(201).json({ category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findOne({ where: { id, userId: req.user.id } });

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  await category.update(req.body);
  res.json({ category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Category.destroy({ where: { id, userId: req.user.id } });

  if (!deleted) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(204).send();
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };

