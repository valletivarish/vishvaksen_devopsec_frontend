/**
 * Navbar component.
 *
 * Fixed top navigation bar displaying the application title on the
 * left and the authenticated user's name with a logout button on the
 * right.  Uses indigo-700 background for brand consistency.
 */

import { FiLogOut, FiUser, FiBox } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-indigo-700 text-white shadow-md z-50 flex items-center justify-between px-6">
      {/* Left side -- app branding */}
      <div className="flex items-center gap-2">
        <FiBox className="text-xl" />
        <h1 className="text-lg font-bold tracking-wide">Inventory Management System</h1>
      </div>

      {/* Right side -- user info and logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <FiUser />
          <span>{user?.username || 'Guest'}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 bg-indigo-800 hover:bg-indigo-900 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
