/**
 * MainLayout component.
 *
 * Provides the application shell for authenticated pages:
 *   - Navbar (fixed top)
 *   - Sidebar (fixed left, 16rem / w-64)
 *   - Main content area (offset by navbar height and sidebar width)
 *
 * Nested routes are rendered via the <Outlet /> component from
 * react-router-dom so child pages automatically appear in the
 * content area without re-mounting the shell.
 */

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed top navigation */}
      <Navbar />

      {/* Fixed left sidebar */}
      <Sidebar />

      {/* Main content area -- offset to clear the fixed navbar and sidebar */}
      <main className="ml-64 mt-16 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
