const ExpenseFilters = ({ filters, categories, onChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="filters card">
      <div className="filters__group">
        <label>
          From
          <input type="date" name="startDate" value={filters.startDate || ''} onChange={handleChange} />
        </label>
        <label>
          To
          <input type="date" name="endDate" value={filters.endDate || ''} onChange={handleChange} />
        </label>
      </div>
      <div className="filters__group">
        <label>
          Category
          <select name="category" value={filters.category || ''} onChange={handleChange}>
            <option value="">All</option>
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
          Search note
          <input
            type="text"
            name="search"
            placeholder="e.g. groceries"
            value={filters.search || ''}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="filters__actions">
        <button type="button" className="btn btn-outline" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilters;

