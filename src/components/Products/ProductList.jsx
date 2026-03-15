/**
 * ProductList component.
 *
 * Fetches all products on mount and renders them in a responsive,
 * striped table.  Provides client-side search filtering by product
 * name, inline stock-status badges, and action buttons for editing
 * and deleting individual products.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

import * as productService from '../../services/productService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

const ProductList = () => {
  const navigate = useNavigate();

  // ----- state -----
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Confirm dialog state for delete operations
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // ----- data fetching -----

  /** Load the full product list from the backend. */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to load products.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Fetch once when the component mounts. */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ----- derived data -----

  /**
   * Filter the loaded product list by the current search term.
   * The comparison is case-insensitive and matches any part of the name.
   */
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----- event handlers -----

  /** Open the confirm dialog and store the target product id. */
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  /** Execute the delete after the user confirms. */
  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    try {
      await productService.deleteProduct(deleteTargetId);
      toast.success('Product deleted successfully');
      fetchProducts(); // refresh the list
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to delete product.';
      toast.error(message);
    }
  };

  /** Close the confirm dialog without deleting. */
  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setDeleteTargetId(null);
  };

  // ----- render helpers -----

  /**
   * Return a coloured badge based on stock level vs reorder threshold.
   * Green "In Stock" when currentStock exceeds the reorder level,
   * red "Low Stock" when currentStock is at or below reorder level.
   */
  const renderStockBadge = (currentStock, reorderLevel) => {
    const isLow = currentStock <= reorderLevel;
    const badgeClasses = isLow
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800';
    const label = isLow ? 'Low Stock' : 'In Stock';

    return (
      <span
        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${badgeClasses}`}
      >
        {label}
      </span>
    );
  };

  // ----- conditional renders -----

  if (loading) return <LoadingSpinner message="Loading products..." />;

  if (error) return <ErrorMessage message={error} onRetry={fetchProducts} />;

  // ----- main render -----

  return (
    <div className="p-6">
      {/* Page header with search bar and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Client-side search input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full sm:w-64"
            />
          </div>

          {/* Navigate to the create-product form */}
          <button
            onClick={() => navigate('/products/new')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <FiPlus />
            Add Product
          </button>
        </div>
      </div>

      {/* Products table wrapped in a white card with shadow */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500 text-sm">
                    {searchTerm
                      ? 'No products match your search.'
                      : 'No products found. Add your first product.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.categoryName || product.category?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.supplierName || product.supplier?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {formatCurrency(product.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {product.currentStock ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {product.reorderLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStockBadge(
                        product.currentStock ?? 0,
                        product.reorderLevel
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit navigates to /products/edit/:id */}
                        <button
                          onClick={() => navigate(`/products/edit/${product.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Edit product"
                        >
                          <FiEdit size={16} />
                        </button>
                        {/* Delete opens the confirm dialog */}
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete product"
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
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default ProductList;
