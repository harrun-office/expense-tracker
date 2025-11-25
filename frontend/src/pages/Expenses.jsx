import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import ExpenseFilters from '../components/ExpenseFilters.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses';
import { fetchCategories } from '../api/categories';
import { useAuth } from '../hooks/useAuth.js';

const initialFilters = {
  startDate: '',
  endDate: '',
  category: '',
  search: '',
  page: 1,
};

const Expenses = () => {
  const { token } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const categoryData = await fetchCategories(token);
        setCategories(categoryData.categories);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) {
      loadInitial();
    }
  }, [token]);

  const loadExpenses = async (override = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters, ...override };
      const data = await fetchExpenses(token, params);
      setExpenses(data.expenses);
      setPagination(data.pagination);
      setFilters((prev) => ({ ...prev, page: params.page || prev.page }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    loadExpenses({ ...nextFilters, page: 1 });
  };

  const handleReset = () => {
    setFilters(initialFilters);
    loadExpenses(initialFilters);
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (expense) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(token, expense.id ?? expense._id);
      loadExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (formValues) => {
    if (editingExpense) {
      await updateExpense(token, editingExpense.id ?? editingExpense._id, formValues);
    } else {
      await createExpense(token, formValues);
    }
    setShowForm(false);
    loadExpenses();
  };

  const handlePageChange = (direction) => {
    const nextPage = filters.page + direction;
    if (nextPage < 1 || nextPage > pagination.pages) return;
    loadExpenses({ page: nextPage });
  };

  return (
    <div className="page">
      <Header title="Expenses">
        <button className="btn" type="button" onClick={handleAddClick}>
          Add expense
        </button>
      </Header>
      {error && <p className="error">{error}</p>}
      <ExpenseFilters
        filters={filters}
        categories={categories}
        onChange={handleFilterChange}
        onReset={handleReset}
      />
      {loading ? (
        <div className="loader-section">
          <div className="loader" />
          <p>Loading expenses...</p>
        </div>
      ) : (
        <>
          <ExpenseTable expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="pagination">
            <button
              className="btn btn-outline"
              onClick={() => handlePageChange(-1)}
              disabled={filters.page <= 1}
            >
              Prev
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              className="btn btn-outline"
              onClick={() => handlePageChange(1)}
              disabled={filters.page >= pagination.pages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal__content card">
            <h2>{editingExpense ? 'Edit expense' : 'Add expense'}</h2>
            <ExpenseForm
              categories={categories}
              initialValues={editingExpense}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;

