const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const listExpenses = asyncHandler(async (req, res) => {
  const { startDate, endDate, category, search, page = 1, limit = 20 } = req.query;
  const filter = { userId: req.user.id };

  if (category) {
    filter.categoryId = category;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date[Op.gte] = startDate;
    if (endDate) filter.date[Op.lte] = endDate;
  }

  if (search) {
    filter.note = { [Op.like]: `%${search}%` };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Transaction.findAndCountAll({
    where: filter,
    include: [{ model: Category, as: 'category' }],
    order: [['date', 'DESC']],
    offset: skip,
    limit: Number(limit),
  });

  const expenses = rows.map((expense) => expense.get({ plain: true }));

  res.json({
    expenses,
    pagination: {
      total: count,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)) || 1,
    },
  });
});

const createExpense = asyncHandler(async (req, res) => {
  const expense = await Transaction.create({ ...req.body, userId: req.user.id });
  const created = await Transaction.findByPk(expense.id, {
    include: [{ model: Category, as: 'category' }],
  });
  res.status(201).json({ expense: created.get({ plain: true }) });
});

const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Transaction.findOne({ where: { id, userId: req.user.id } });

  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  await expense.update(req.body);
  const updated = await Transaction.findByPk(id, {
    include: [{ model: Category, as: 'category' }],
  });
  res.json({ expense: updated.get({ plain: true }) });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Transaction.destroy({ where: { id, userId: req.user.id } });

  if (!deleted) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  res.status(204).send();
});

module.exports = { listExpenses, createExpense, updateExpense, deleteExpense };

