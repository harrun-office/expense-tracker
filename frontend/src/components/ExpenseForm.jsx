import { useEffect, useState } from 'react';

const defaultValues = {
  amount: '',
  categoryId: '',
  type: 'expense',
  date: '',
  note: '',
};

const ExpenseForm = ({ categories, initialValues, onSubmit, onCancel }) => {
  const [form, setForm] = useState(defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setForm({
        amount: initialValues.amount,
        categoryId:
          initialValues.categoryId?.id ||
          initialValues.categoryId?._id ||
          initialValues.categoryId,
        type: initialValues.type,
        date: initialValues.date?.slice(0, 10),
        note: initialValues.note || '',
      });
    } else {
      setForm(defaultValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>
        Amount
        <input
          type="number"
          name="amount"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Category
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
          <option value="" disabled>
            Select category
          </option>
          {categories.map((category) => {
            const id = category.id ?? category._id;
            return (
              <option key={id} value={id}>
                {category.name}
              </option>
            );
          })}
        </select>
      </label>
      <label>
        Type
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      <label>
        Date
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </label>
      <label>
        Note
        <textarea name="note" rows="3" value={form.note} onChange={handleChange} />
      </label>
      <div className="form__actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;

