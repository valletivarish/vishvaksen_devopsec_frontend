/**
 * Sidebar component.
 *
 * Fixed left sidebar that provides navigation links to every major
 * section of the application.  Uses NavLink so the active route is
 * automatically highlighted with an indigo accent.
 */

import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiTruck,
  FiDatabase,
  FiActivity,
} from 'react-icons/fi';

/**
 * Navigation items -- each entry maps an icon, label, and route path.
 * Adding a new page only requires a new entry here.
 */
const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/products', icon: FiPackage, label: 'Products' },
  { to: '/categories', icon: FiGrid, label: 'Categories' },
  { to: '/suppliers', icon: FiTruck, label: 'Suppliers' },
  { to: '/warehouses', icon: FiDatabase, label: 'Warehouses' },
  { to: '/stock-movements', icon: FiActivity, label: 'Stock Movements' },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <nav className="py-4">
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }`
                }
              >
                <Icon className="text-lg" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
