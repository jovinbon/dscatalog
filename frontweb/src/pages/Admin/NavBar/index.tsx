import { NavLink } from 'react-router-dom';
import { hasAnyRole } from 'util/auth';
import './styles.css';

const NavBar = () => {
  return (
    <nav className="admin-nav-container">
      <ul>
        <li className="admin-nav-items-container">
          <NavLink to="/admin/products" className="admin-nav-item">
            <p>Produtos</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categories" className="admin-nav-item">
            <p>Categorias</p>
          </NavLink>
        </li>
        {hasAnyRole(['ROLE_ADMIN']) && (
          <li>
            <NavLink to="/admin/users" className="admin-nav-item">
              <p>Usuários</p>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
