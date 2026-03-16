/**
 * StockMovementForm component.
 *
 * Create-only form for recording a new stock movement.  The user
 * selects a product, warehouse, movement type (IN / OUT / TRANSFER),
 * and quantity.  Optional fields include a reference number and notes.
 *
 * Product and warehouse options are fetched on mount and rendered as
 * select dropdowns.  Validation uses the shared stockMovementSchema.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { stockMovementSchema } from '../../utils/validators';
import * as stockMovementService from '../../services/stockMovementService';
import * as productService from '../../services/productService';
import * as warehouseService from '../../services/warehouseService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const StockMovementForm = () => {
  const navigate = useNavigate();

  /* Dropdown data sources */
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  /* UI state */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Initialise react-hook-form with Yup validation */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(stockMovementSchema),
    defaultValues: {
      productId: '',
      warehouseId: '',
      quantity: '',
      type: '',
      referenceNumber: '',
      notes: '',
    },
  });

  /**
   * Fetch products and warehouses in parallel on mount.
   * Both lists are needed to populate the select dropdowns.
   */
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsRes, warehousesRes] = await Promise.all([
          productService.getAllProducts(),
          warehouseService.getAllWarehouses(),
        ]);
        setProducts(productsRes.data);
        setWarehouses(warehousesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load form options.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  /**
   * Submit handler -- creates a new stock movement.
   * On success, shows a toast and navigates back to the list.
   * On failure, displays the backend error (e.g. "Insufficient stock").
   */
  const onSubmit = async (data) => {
    try {
      await stockMovementService.createMovement(data);
      toast.success('Stock movement recorded successfully.');
      navigate('/stock-movements');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record stock movement.');
    }
  };

  /* ---- conditional renders ---- */

  if (loading) return <LoadingSpinner message="Loading form options..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Record Stock Movement</h1>

      {/* Form card */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Product select */}
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
              Product <span className="text-red-500">*</span>
            </label>
            <select
              id="productId"
              {...register('productId')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white ${
                errors.productId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select a product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="mt-1 text-xs text-red-600">{errors.productId.message}</p>
            )}
          </div>

          {/* Warehouse select */}
          <div>
            <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse <span className="text-red-500">*</span>
            </label>
            <select
              id="warehouseId"
              {...register('warehouseId')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white ${
                errors.warehouseId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select a warehouse --</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} - {warehouse.location}
                </option>
              ))}
            </select>
            {errors.warehouseId && (
              <p className="mt-1 text-xs text-red-600">{errors.warehouseId.message}</p>
            )}
          </div>

          {/* Movement type select */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Movement Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              {...register('type')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select type --</option>
              <option value="IN">IN - Stock received</option>
              <option value="OUT">OUT - Stock dispatched</option>
              <option value="TRANSFER">TRANSFER - Inter-warehouse</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Quantity field */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              {...register('quantity')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Reference number field (optional) */}
          <div>
            <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <input
              id="referenceNumber"
              type="text"
              {...register('referenceNumber')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none ${
                errors.referenceNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g. PO-2026-001"
            />
            {errors.referenceNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.referenceNumber.message}</p>
            )}
          </div>

          {/* Notes field (optional) */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              {...register('notes')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-vertical ${
                errors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Optional notes about this movement"
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/stock-movements')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Record Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementForm;
