import { useAuth } from '../hooks/useAuth.js';

const Header = ({ title, children }) => {
  const { logout, user } = useAuth();

  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>
      <div className="page-header__actions">
        {children}
        <button type="button" className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

