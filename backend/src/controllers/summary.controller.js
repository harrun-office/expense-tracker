const { Op, fn, col } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const summary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const where = { userId: req.user.id };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  const aggregation = await Transaction.findAll({
    where,
    attributes: [
      'categoryId',
      [fn('SUM', col('Transaction.amount')), 'totalAmount'],
      [fn('COUNT', col('Transaction.id')), 'count'],
    ],
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    group: ['categoryId', 'category.id'],
  });

  const breakdown = aggregation.map((entry) => {
    const plain = entry.get({ plain: true });
    return {
      _id: plain.categoryId,
      categoryId: plain.categoryId,
      totalAmount: Number(plain.totalAmount),
      count: Number(plain.count),
      category: plain.category,
    };
  });

  const total = breakdown.reduce((sum, item) => sum + item.totalAmount, 0);

  res.json({
    total,
    breakdown,
  });
});

module.exports = { summary };

