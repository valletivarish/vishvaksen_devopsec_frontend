/**
 * CategoryList component.
 *
 * Displays all product categories in a responsive, striped table.
 * Each row shows the category name, description, product count,
 * creation date, and action buttons for editing and deleting.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

import * as categoryService from '../../services/categoryService';
import { toggleCategoryStatus } from '../../services/categoryService';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

const CategoryList = () => {
  const navigate = useNavigate();

  // ----- state -----
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Confirm dialog state for delete operations
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // ----- data fetching -----

  /** Load all categories from the backend. */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to load categories.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Fetch once when the component mounts. */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ----- event handlers -----

  /**
   * Toggle the active/inactive status of a category.
   * Refreshes the list after a successful update.
   */
  const handleToggle = async (item) => {
    try {
      await toggleCategoryStatus(item.id);
      toast.success(`${item.name} ${item.active ? 'deactivated' : 'activated'} successfully.`);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  /** Open the confirm dialog for the selected category. */
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  /** Execute the delete after user confirmation. */
  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    try {
      await categoryService.deleteCategory(deleteTargetId);
      toast.success('Category deleted successfully');
      fetchCategories(); // refresh the list
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to delete category.';
      toast.error(message);
    }
  };

  /** Close the dialog without deleting. */
  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setDeleteTargetId(null);
  };

  // ----- conditional renders -----

  if (loading) return <LoadingSpinner message="Loading categories..." />;

  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  // ----- main render -----

  return (
    <div className="p-6">
      {/* Page header with add button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

        <button
          onClick={() => navigate('/categories/new')}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          <FiPlus />
          Add Category
        </button>
      </div>

      {/* Categories table card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No categories found. Add your first category.
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {category.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {category.productCount ?? category.products?.length ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        type="button"
                        onClick={() => handleToggle(category)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          category.active ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                        title={category.active ? 'Deactivate' : 'Activate'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            category.active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit navigates to /categories/edit/:id */}
                        <button
                          onClick={() => navigate(`/categories/edit/${category.id}`)}
                          className="text-teal-600 hover:text-teal-900 p-1 rounded hover:bg-teal-50 transition-colors"
                          title="Edit category"
                        >
                          <FiEdit size={16} />
                        </button>
                        {/* Delete opens the confirm dialog */}
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete category"
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

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Deactivate Category"
        message={`Are you sure you want to deactivate "${categories.find(c => c.id === deleteTargetId)?.name}"? You can reactivate it later.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default CategoryList;
