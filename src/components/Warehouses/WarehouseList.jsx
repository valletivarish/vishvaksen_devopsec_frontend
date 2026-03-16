/**
 * WarehouseList component.
 *
 * Renders all warehouses in a table with capacity utilization bars.
 * Each row shows a colour-coded progress indicator: green when usage
 * is below 60 %, yellow between 60-80 %, and red above 80 %.
 * Supports add, edit, and delete operations with a confirmation dialog.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as warehouseService from '../../services/warehouseService';
import { toggleWarehouseStatus } from '../../services/warehouseService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * Return the appropriate Tailwind colour classes for the utilization bar.
 * Green for healthy (<60%), yellow for moderate (60-80%), red for high (>80%).
 */
const getUtilizationColor = (percentage) => {
  if (percentage > 80) return 'bg-red-500';
  if (percentage >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

const WarehouseList = () => {
  /* ---- state ---- */
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  /** Fetch all warehouses from the API. */
  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseService.getAllWarehouses();
      setWarehouses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load warehouses.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* Load warehouses on mount */
  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  /**
   * Toggle the active/inactive status of a warehouse.
   * Refreshes the list after a successful update.
   */
  const handleToggle = async (item) => {
    try {
      await toggleWarehouseStatus(item.id);
      toast.success(`${item.name} ${item.active ? 'deactivated' : 'activated'} successfully.`);
      fetchWarehouses();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  /** Confirm and execute warehouse deletion. */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await warehouseService.deleteWarehouse(deleteTarget.id);
      toast.success(`Warehouse "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchWarehouses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete warehouse.');
      setDeleteTarget(null);
    }
  };

  /* ---- conditional renders ---- */

  if (loading) return <LoadingSpinner message="Loading warehouses..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchWarehouses} />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Warehouses</h1>

        <button
          type="button"
          onClick={() => navigate('/warehouses/new')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          <FiPlus size={16} />
          Add Warehouse
        </button>
      </div>

      {/* Warehouses table card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warehouses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                    No warehouses found. Add one to get started.
                  </td>
                </tr>
              ) : (
                warehouses.map((warehouse, index) => {
                  /* Calculate utilization percentage, capping at 100 for the bar */
                  const currentUtilization = warehouse.currentUtilization ?? warehouse.currentStock ?? 0;
                  const percentage = warehouse.capacity > 0
                    ? Math.round((currentUtilization / warehouse.capacity) * 100)
                    : 0;
                  const barWidth = Math.min(percentage, 100);

                  return (
                    <tr
                      key={warehouse.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {warehouse.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {warehouse.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {warehouse.capacity?.toLocaleString() ?? 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {currentUtilization.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          {/* Progress bar container */}
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getUtilizationColor(percentage)}`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          onClick={() => handleToggle(warehouse)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            warehouse.active ? 'bg-teal-600' : 'bg-gray-300'
                          }`}
                          title={warehouse.active ? 'Deactivate' : 'Activate'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              warehouse.active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/warehouses/edit/${warehouse.id}`)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit warehouse"
                          >
                            <FiEdit size={16} />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(warehouse)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete warehouse"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm-delete dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Deactivate Warehouse"
        message={`Are you sure you want to deactivate "${deleteTarget?.name}"? You can reactivate it later.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default WarehouseList;
