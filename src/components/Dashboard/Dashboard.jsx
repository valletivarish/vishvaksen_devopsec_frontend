/**
 * Dashboard component.
 *
 * Main landing page that provides a high-level overview of the inventory system.
 * Fetches aggregated data from the backend dashboard endpoint and renders:
 *   - Summary cards (products, categories, warehouses, suppliers)
 *   - Total stock value highlight card
 *   - Low stock alerts table
 *   - Recent stock movements table
 */

import { useState, useEffect } from "react";
import { FiPackage, FiGrid, FiDatabase, FiTruck, FiAlertCircle, FiActivity } from "react-icons/fi";
import { getDashboardSummary } from "../../services/dashboardService";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

const Dashboard = () => {
  /* -----------------------------------------------------------
   * State: dashboard payload, loading flag, and error message
   * --------------------------------------------------------- */
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -----------------------------------------------------------
   * Fetch dashboard summary on component mount
   * --------------------------------------------------------- */
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardSummary();
      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* -----------------------------------------------------------
   * Conditional renders for loading and error states
   * --------------------------------------------------------- */
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboard} />;
  }

  /* -----------------------------------------------------------
   * Destructure the dashboard payload for convenient access
   * --------------------------------------------------------- */
  const {
    totalProducts = 0,
    totalCategories = 0,
    totalWarehouses = 0,
    totalSuppliers = 0,
    totalStockValue = 0,
    lowStockProducts = [],
    recentMovements = [],
  } = dashboardData || {};

  /* -----------------------------------------------------------
   * Configuration array for the four summary cards.
   * Each entry drives one card in the top-row grid.
   * --------------------------------------------------------- */
  const summaryCards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: FiPackage,
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Categories",
      value: totalCategories,
      icon: FiGrid,
      bgColor: "bg-green-500",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Warehouses",
      value: totalWarehouses,
      icon: FiDatabase,
      bgColor: "bg-teal-500",
      lightBg: "bg-teal-50",
      textColor: "text-teal-600",
    },
    {
      title: "Total Suppliers",
      value: totalSuppliers,
      icon: FiTruck,
      bgColor: "bg-orange-500",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  /**
   * Map a movement type string to the appropriate Tailwind badge classes.
   * IN = green, OUT = red, TRANSFER = blue.
   */
  const getMovementBadgeClass = (type) => {
    switch (type) {
      case "IN":
        return "bg-green-100 text-green-800";
      case "OUT":
        return "bg-red-100 text-red-800";
      case "TRANSFER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* -----------------------------------------------------------
   * Render
   * --------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* ---- Page header ---- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your inventory
        </p>
      </div>

      {/* ---- Summary cards grid ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  {/* Prominent count number */}
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                {/* Colored icon container */}
                <div className={`rounded-full ${card.lightBg} p-3`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Total Stock Value highlight card ---- */}
      <div className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white shadow hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-100">
              Total Stock Value
            </p>
            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(totalStockValue)}
            </p>
          </div>
          <div className="rounded-full bg-white/20 p-3">
            <FiActivity className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* ---- Low Stock Alerts section ---- */}
      <div className="rounded-lg bg-white shadow">
        {/* Section header */}
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
          <FiAlertCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Low Stock Alerts
          </h2>
        </div>

        {lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {product.currentStock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.reorderLevel}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {/* Red badge indicating low stock */}
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state when all products are sufficiently stocked */
          <div className="px-6 py-12 text-center">
            <FiPackage className="mx-auto h-10 w-10 text-green-400" />
            <p className="mt-3 text-sm text-gray-500">
              All products are well stocked
            </p>
          </div>
        )}
      </div>

      {/* ---- Recent Stock Movements section ---- */}
      <div className="rounded-lg bg-white shadow">
        {/* Section header */}
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
          <FiActivity className="h-5 w-5 text-teal-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Stock Movements
          </h2>
        </div>

        {recentMovements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentMovements.slice(0, 10).map((movement, index) => (
                  <tr
                    key={movement.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDateTime(movement.movementDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {movement.productName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {movement.warehouseName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {/* Color-coded movement type badge */}
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMovementBadgeClass(movement.type)}`}
                      >
                        {movement.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {movement.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {movement.referenceNumber || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state when there are no recent movements */
          <div className="px-6 py-12 text-center">
            <FiActivity className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              No recent stock movements
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
