/**
 * SupplierList component.
 *
 * Displays a searchable table of all suppliers with options to add,
 * edit, or delete individual records.  Supplier data is fetched from
 * the backend via supplierService and rendered inside a styled
 * Tailwind card with striped rows.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as supplierService from '../../services/supplierService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

const SupplierList = () => {
  /* ---- state ---- */
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null); // supplier to delete

  const navigate = useNavigate();

  /**
   * Fetch the full supplier list from the API.
   * Wrapped in useCallback so it can be reused after a delete.
   */
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supplierService.getAllSuppliers();
      setSuppliers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* Load suppliers on mount */
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  /**
   * Handle confirmed deletion of a supplier.
   * Shows a success toast and refreshes the list on success.
   */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await supplierService.deleteSupplier(deleteTarget.id);
      toast.success(`Supplier "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete supplier.');
      setDeleteTarget(null);
    }
  };

  /**
   * Filter the supplier list by name based on the current search term.
   * The comparison is case-insensitive for a smooth UX.
   */
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---- render helpers ---- */

  if (loading) return <LoadingSpinner message="Loading suppliers..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSuppliers} />;

  return (
    <div className="space-y-6">
      {/* Page header with search bar and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-full sm:w-64"
            />
          </div>

          {/* Add supplier button */}
          <button
            type="button"
            onClick={() => navigate('/suppliers/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FiPlus size={16} />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers table card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                    {searchTerm ? 'No suppliers match your search.' : 'No suppliers found. Add one to get started.'}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier, index) => (
                  <tr
                    key={supplier.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {supplier.contactEmail || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {supplier.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {supplier.address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {supplier.productCount ?? supplier.products?.length ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit button */}
                        <button
                          type="button"
                          onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Edit supplier"
                        >
                          <FiEdit size={16} />
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(supplier)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete supplier"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm-delete dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Deactivate Supplier"
        message={`Are you sure you want to deactivate "${deleteTarget?.name}"? You can reactivate it later.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default SupplierList;
