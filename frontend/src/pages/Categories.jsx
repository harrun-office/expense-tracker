import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import { fetchCategories, createCategory, deleteCategory } from '../api/categories';
import { useAuth } from '../hooks/useAuth.js';

const Categories = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories(token);
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory(token, { name });
      setName('');
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (category) => {
    if (category.isDefault) return;
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(token, category.id ?? category._id);
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <Header title="Categories" />
      <div className="grid grid-2">
        <div className="card">
          <h2>Add category</h2>
          <form className="form-inline" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit" className="btn">
              Add
            </button>
          </form>
        </div>
        <div className="card">
          <h2>Your categories</h2>
          {error && <p className="error">{error}</p>}
          {loading ? (
            <div className="loader-section">
              <div className="loader" />
              <p>Loading categories...</p>
            </div>
          ) : (
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category.id ?? category._id}>
                  <span>
                    {category.name}{' '}
                    {category.isDefault && <small className="muted">(default)</small>}
                  </span>
                  {!category.isDefault && (
                    <button
                      className="btn btn-text text-danger"
                      onClick={() => handleDelete(category)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;

