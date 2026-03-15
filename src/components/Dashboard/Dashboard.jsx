import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../services/dashboardService';
import { formatCurrency, formatDateTime, getMovementTypeColor, getMovementTypeLabel } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { FiPackage, FiGrid, FiDatabase, FiTruck, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

/**
 * Dashboard component displaying an overview of the inventory system.
 * Shows summary cards, total stock value, low stock alerts, and recent movements.
 */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard summary data on component mount
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardSummary();
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  // Summary cards configuration for the top row
  const summaryCards = [
    { title: 'Total Products', value: data.totalProducts, icon: FiPackage, color: 'bg-blue-500' },
    { title: 'Total Categories', value: data.totalCategories, icon: FiGrid, color: 'bg-green-500' },
    { title: 'Total Warehouses', value: data.totalWarehouses, icon: FiDatabase, color: 'bg-purple-500' },
    { title: 'Total Suppliers', value: data.totalSuppliers, icon: FiTruck, color: 'bg-orange-500' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your inventory</p>
      </div>

      {/* Summary cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total stock value card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center gap-3">
          <FiDollarSign className="text-3xl" />
          <div>
            <p className="text-sm font-medium opacity-90">Total Stock Value</p>
            <p className="text-3xl font-bold">{formatCurrency(data.totalStockValue)}</p>
          </div>
        </div>
      </div>

      {/* Two-column layout for alerts and recent movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low stock alerts section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiAlertTriangle className="text-red-500" />
              Low Stock Alerts
            </h2>
          </div>
          <div className="p-6">
            {data.lowStockProducts && data.lowStockProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.lowStockProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.currentStock}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.reorderLevel}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">All products are well stocked.</p>
            )}
          </div>
        </div>

        {/* Recent stock movements section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h2>
          </div>
          <div className="p-6">
            {data.recentMovements && data.recentMovements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.recentMovements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(movement.movementDate)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{movement.productName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
                            {getMovementTypeLabel(movement.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{movement.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent movements.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
