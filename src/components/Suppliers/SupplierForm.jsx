/**
 * SupplierForm component.
 *
 * A dual-purpose form for creating and editing suppliers.  When an `id`
 * route parameter is present the component enters edit mode: it fetches
 * the existing supplier and pre-fills the form via react-hook-form's
 * reset().  Validation is handled by the shared supplierSchema (Yup).
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { supplierSchema } from '../../utils/validators';
import * as supplierService from '../../services/supplierService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const SupplierForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* Determine whether the form is in edit mode */
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode); // only show spinner when fetching
  const [error, setError] = useState(null);

  /* Initialise react-hook-form with Yup resolver */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      name: '',
      contactEmail: '',
      phone: '',
      address: '',
    },
  });

  /**
   * In edit mode, fetch the supplier data and populate the form.
   * reset() ensures the form values and dirty/touched state are correct.
   */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchSupplier = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await supplierService.getSupplierById(id);
        const supplier = response.data;
        reset({
          name: supplier.name || '',
          contactEmail: supplier.contactEmail || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load supplier details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id, isEditMode, reset]);

  /**
   * Handle form submission for both create and update operations.
   * Displays a success toast and redirects to the supplier list.
   */
  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await supplierService.updateSupplier(id, data);
        toast.success('Supplier updated successfully.');
      } else {
        await supplierService.createSupplier(data);
        toast.success('Supplier created successfully.');
      }
      navigate('/suppliers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save supplier.');
    }
  };

  /* ---- conditional renders ---- */

  if (loading) return <LoadingSpinner message="Loading supplier..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Supplier' : 'Add Supplier'}
      </h1>

      {/* Form card */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter supplier name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Contact email field */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              id="contactEmail"
              type="email"
              {...register('contactEmail')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                errors.contactEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="supplier@example.com"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-xs text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>

          {/* Phone field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g. +1-555-0101"
            />
            <p className="mt-1 text-xs text-gray-500">e.g. +1-555-0101</p>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Address field */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              {...register('address')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-vertical ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter supplier address"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/suppliers')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                  ? 'Update Supplier'
                  : 'Create Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;
