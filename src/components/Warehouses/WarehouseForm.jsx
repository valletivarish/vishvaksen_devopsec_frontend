/**
 * WarehouseForm component.
 *
 * Dual-purpose create / edit form for warehouses.  Uses the shared
 * warehouseSchema for Yup validation.  In edit mode the existing
 * warehouse data is fetched and injected into the form via reset().
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { warehouseSchema } from '../../utils/validators';
import * as warehouseService from '../../services/warehouseService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const WarehouseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* Determine mode based on route parameter */
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  /* Initialise react-hook-form with Yup validation */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(warehouseSchema),
    defaultValues: {
      name: '',
      location: '',
      capacity: '',
    },
  });

  /**
   * Fetch existing warehouse data in edit mode and
   * populate the form fields using reset().
   */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchWarehouse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await warehouseService.getWarehouseById(id);
        const warehouse = response.data;
        reset({
          name: warehouse.name || '',
          location: warehouse.location || '',
          capacity: warehouse.capacity ?? '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load warehouse details.');
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [id, isEditMode, reset]);

  /**
   * Submit handler for create and update.
   * On success, show a toast and navigate back to the warehouse list.
   */
  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await warehouseService.updateWarehouse(id, data);
        toast.success('Warehouse updated successfully.');
      } else {
        await warehouseService.createWarehouse(data);
        toast.success('Warehouse created successfully.');
      }
      navigate('/warehouses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save warehouse.');
    }
  };

  /* ---- conditional renders ---- */

  if (loading) return <LoadingSpinner message="Loading warehouse..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Warehouse' : 'Add Warehouse'}
      </h1>

      {/* Form card */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter warehouse name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Location field */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              {...register('location')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter warehouse location"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Capacity field */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity <span className="text-red-500">*</span>
            </label>
            <input
              id="capacity"
              type="number"
              min={1}
              max={1000000}
              {...register('capacity')}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                errors.capacity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter storage capacity"
            />
            {errors.capacity && (
              <p className="mt-1 text-xs text-red-600">{errors.capacity.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/warehouses')}
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
                  ? 'Update Warehouse'
                  : 'Create Warehouse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseForm;
