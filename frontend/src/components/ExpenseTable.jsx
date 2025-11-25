import { format } from 'date-fns';

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) {
    return <p className="muted">No expenses found for this range.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Note</th>
            <th>Type</th>
            <th className="text-right">Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const id = expense.id ?? expense._id;
            return (
              <tr key={id}>
              <td>{format(new Date(expense.date), 'dd MMM yyyy')}</td>
                <td>{expense?.category?.name || expense?.categoryId?.name || '—'}</td>
                <td>{expense.note || '—'}</td>
                <td className={expense.type === 'income' ? 'text-success' : 'text-danger'}>
                  {expense.type}
                </td>
                <td className="text-right amount">
                  {Number(expense.amount).toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </td>
                <td className="text-right">
                  <button className="btn btn-small" onClick={() => onEdit(expense)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-text text-danger"
                    onClick={() => onDelete(expense)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;

