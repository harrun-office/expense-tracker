import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const routes = [
  { to: '/', label: 'Dashboard' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/categories', label: 'Categories' },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">MH</span>
        <div>
          <p className="sidebar__title">Expense Tracker</p>
          <p className="sidebar__subtitle">Personal finance</p>
        </div>
      </div>
      <nav className="sidebar__nav">
        {routes.map((route) => (
          <NavLink
            key={route.to}
            to={route.to}
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
            end={route.to === '/'}
          >
            {route.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__user">
        <p className="sidebar__user-name">{user?.name}</p>
        <p className="sidebar__user-email">{user?.email}</p>
      </div>
    </aside>
  );
};

export default Sidebar;

