/**
 * StockMovementList component.
 *
 * Displays the full history of stock movements in a table.  Each row
 * shows the date, product, warehouse, movement type (as a coloured
 * badge), quantity, reference number, and notes.  A dropdown filter
 * allows narrowing the view by movement type (IN / OUT / TRANSFER).
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import * as stockMovementService from '../../services/stockMovementService';
import { formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * Maps a movement type string to the appropriate Tailwind badge classes.
 * IN = green, OUT = red, TRANSFER = blue.
 */
const typeBadgeClasses = {
  IN: 'bg-green-100 text-green-800',
  OUT: 'bg-red-100 text-red-800',
  TRANSFER: 'bg-blue-100 text-blue-800',
};

const StockMovementList = () => {
  /* ---- state ---- */
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL | IN | OUT | TRANSFER

  const navigate = useNavigate();

  /** Fetch every stock movement from the API. */
  const fetchMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stockMovementService.getAllMovements();
      setMovements(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock movements.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* Load movements on mount */
  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  /**
   * Apply the type filter.  When set to "ALL" every movement is shown;
   * otherwise only movements whose type matches the filter are kept.
   */
  const filteredMovements = typeFilter === 'ALL'
    ? movements
    : movements.filter((m) => m.type === typeFilter);

  /* ---- conditional renders ---- */

  if (loading) return <LoadingSpinner message="Loading stock movements..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMovements} />;

  return (
    <div className="space-y-6">
      {/* Page header with filter and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Stock Movements</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Type filter dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
          >
            <option value="ALL">All Types</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
            <option value="TRANSFER">TRANSFER</option>
          </select>

          {/* Record movement button */}
          <button
            type="button"
            onClick={() => navigate('/stock-movements/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FiPlus size={16} />
            Record Movement
          </button>
        </div>
      </div>

      {/* Movements table card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                    {typeFilter !== 'ALL'
                      ? `No ${typeFilter} movements found.`
                      : 'No stock movements recorded yet.'}
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement, index) => (
                  <tr
                    key={movement.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {/* Date column formatted with formatDateTime */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(movement.movementDate || movement.createdAt)}
                    </td>

                    {/* Product name -- may be nested or flattened depending on backend */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {movement.productName || movement.product?.name || 'N/A'}
                    </td>

                    {/* Warehouse name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {movement.warehouseName || movement.warehouse?.name || 'N/A'}
                    </td>

                    {/* Movement type badge */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          typeBadgeClasses[movement.type] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {movement.type}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {movement.quantity?.toLocaleString() ?? 0}
                    </td>

                    {/* Reference number */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {movement.referenceNumber || '-'}
                    </td>

                    {/* Notes (truncated for long content) */}
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockMovementList;
