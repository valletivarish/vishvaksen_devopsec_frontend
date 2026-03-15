/**
 * ProductForm component.
 *
 * A dual-purpose form used for both creating new products and editing
 * existing ones.  The mode is determined by the presence of an :id
 * route parameter -- if present the form loads the existing product
 * data and pre-fills every field.
 *
 * Validation is handled by react-hook-form with a yup resolver using
 * the productSchema defined in utils/validators.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FiSave, FiX } from 'react-icons/fi';

import * as productService from '../../services/productService';
import * as categoryService from '../../services/categoryService';
import * as supplierService from '../../services/supplierService';
import { productSchema } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /** True when an existing product id is present in the URL. */
  const isEditMode = Boolean(id);

  // ----- state -----
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // ----- react-hook-form setup -----
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      unitPrice: '',
      reorderLevel: '',
      categoryId: '',
      supplierId: '',
    },
  });

  // ----- data fetching -----

  /**
   * Load categories and suppliers for the select dropdowns.
   * In edit mode also fetch the product by id and reset the form
   * with its values so all fields are pre-filled.
   */
  useEffect(() => {
    const loadFormData = async () => {
      try {
        // Fetch dropdown options in parallel
        const [catRes, supRes] = await Promise.all([
          categoryService.getAllCategories(),
          supplierService.getAllSuppliers(),
        ]);
        setCategories(catRes.data);
        setSuppliers(supRes.data);

        // In edit mode, fetch the product and populate the form
        if (isEditMode) {
          const prodRes = await productService.getProductById(id);
          const product = prodRes.data;
          reset({
            name: product.name || '',
            sku: product.sku || '',
            description: product.description || '',
            unitPrice: product.unitPrice ?? '',
            reorderLevel: product.reorderLevel ?? '',
            categoryId: product.categoryId ?? product.category?.id ?? '',
            supplierId: product.supplierId ?? product.supplier?.id ?? '',
          });
        }
      } catch (err) {
        const message =
          err.response?.data?.message || 'Failed to load form data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [id, isEditMode, reset]);

  // ----- submit handler -----

  /**
   * Called only after yup validation passes.  Delegates to the
   * correct service method depending on create vs. edit mode.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        await productService.updateProduct(id, data);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(data);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to save product.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ----- conditional renders -----

  if (loading) return <LoadingSpinner message="Loading form data..." />;

  if (error) return <ErrorMessage message={error} />;

  // ----- main render -----

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      {/* Form card */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name and SKU side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Product name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter product name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* SKU with helper text */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                id="sku"
                type="text"
                placeholder="e.g. PROD-001"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  errors.sku ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('sku')}
              />
              <p className="mt-1 text-xs text-gray-400">Alphanumeric and hyphens only</p>
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
              )}
            </div>
          </div>

          {/* Description textarea */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              placeholder="Optional product description"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Unit Price and Reorder Level side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Unit Price */}
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price ($)
              </label>
              <input
                id="unitPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('unitPrice')}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>
              )}
            </div>

            {/* Reorder Level */}
            <div>
              <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Reorder Level
              </label>
              <input
                id="reorderLevel"
                type="number"
                placeholder="e.g. 10"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  errors.reorderLevel ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('reorderLevel')}
              />
              {errors.reorderLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.reorderLevel.message}</p>
              )}
            </div>
          </div>

          {/* Category and Supplier dropdowns side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Category select */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="categoryId"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('categoryId')}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Supplier select */}
            <div>
              <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <select
                id="supplierId"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white ${
                  errors.supplierId ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('supplierId')}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="mt-1 text-sm text-red-600">{errors.supplierId.message}</p>
              )}
            </div>
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FiX />
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave />
              {submitting
                ? 'Saving...'
                : isEditMode
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
