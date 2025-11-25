import { useEffect, useMemo, useState } from 'react';
import { subMonths, formatISO } from 'date-fns';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import Header from '../components/Header.jsx';
import StatsCard from '../components/StatsCard.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import { fetchSummary } from '../api/summary';
import { fetchExpenses } from '../api/expenses';
import { fetchCategories } from '../api/categories';
import { useAuth } from '../hooks/useAuth.js';
import { formatCurrency } from '../utils/format.js';

const COLORS = ['#2563eb', '#16a34a', '#f97316', '#a855f7', '#ec4899', '#0ea5e9'];

const Dashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, breakdown: [] });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, expensesData, categoriesData] = await Promise.all([
          fetchSummary(token, {
            startDate: formatISO(subMonths(new Date(), 1), { representation: 'date' }),
            endDate: formatISO(new Date(), { representation: 'date' }),
          }),
          fetchExpenses(token, { limit: 5 }),
          fetchCategories(token),
        ]);
        setSummary(summaryData);
        setRecentExpenses(expensesData.expenses);
        setCategories(categoriesData.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token]);

  const categoryLookup = useMemo(
    () =>
      categories.reduce((acc, category) => {
        const id = category.id ?? category._id;
        acc[id] = category.name;
        return acc;
      }, {}),
    [categories]
  );

  const chartData = useMemo(
    () =>
      summary.breakdown.map((item, index) => {
        const id =
          item.category?.id ??
          item.categoryId ??
          (typeof item._id === 'object' && item._id !== null ? item._id?.toString() : item._id);
        return {
          name: item.category?.name || categoryLookup[id] || 'Unknown',
          value: item.totalAmount,
          fill: COLORS[index % COLORS.length],
        };
      }),
    [summary.breakdown, categoryLookup]
  );

  return (
    <div className="page">
      <Header title="Dashboard" />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <div className="loader-section">
          <div className="loader" />
          <p>Loading summary...</p>
        </div>
      ) : (
        <>
          <section className="grid grid-3">
            <StatsCard label="Total spent" value={formatCurrency(summary.total)} />
            <StatsCard label="Categories tracked" value={summary.breakdown.length} />
            <StatsCard label="Recent transactions" value={recentExpenses.length} />
          </section>
          <section className="grid grid-2">
            <div className="card">
              <h2>Spending by category</h2>
              {chartData.length ? (
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" nameKey="name" label>
                        {chartData.map((entry, idx) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="muted">Add expenses to see category insights.</p>
              )}
            </div>
            <div className="card">
              <h2>Recent transactions</h2>
              <ExpenseTable expenses={recentExpenses} onEdit={() => {}} onDelete={() => {}} />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;

