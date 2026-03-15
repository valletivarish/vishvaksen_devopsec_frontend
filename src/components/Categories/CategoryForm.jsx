/**
 * CategoryForm component.
 *
 * A dual-purpose form for creating and editing categories.  When an
 * :id route parameter is present the component enters edit mode,
 * fetching the existing category and pre-filling the fields via
 * react-hook-form's reset().
 *
 * Validation uses yupResolver with the categorySchema from
 * utils/validators.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FiSave, FiX } from 'react-icons/fi';

import * as categoryService from '../../services/categoryService';
import { categorySchema } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /** True when editing an existing category. */
  const isEditMode = Boolean(id);

  // ----- state -----
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ----- react-hook-form setup -----
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // ----- data fetching (edit mode only) -----

  /**
   * In edit mode, fetch the category by id and reset the form with
   * the returned data so every field is pre-filled.
   */
  useEffect(() => {
    if (!isEditMode) return;

    const loadCategory = async () => {
      try {
        const response = await categoryService.getCategoryById(id);
        const category = response.data;
        reset({
          name: category.name || '',
          description: category.description || '',
        });
      } catch (err) {
        const message =
          err.response?.data?.message || 'Failed to load category.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, isEditMode, reset]);

  // ----- submit handler -----

  /**
   * Called after yup validation passes.  Creates a new category or
   * updates the existing one depending on the current mode.
   */
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        await categoryService.updateCategory(id, data);
        toast.success('Category updated successfully');
      } else {
        await categoryService.createCategory(data);
        toast.success('Category created successfully');
      }
      navigate('/categories');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to save category.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ----- conditional renders -----

  if (loading) return <LoadingSpinner message="Loading category..." />;

  if (error) return <ErrorMessage message={error} />;

  // ----- main render -----

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Page heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Category' : 'Add New Category'}
      </h1>

      {/* Form card */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Category name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter category name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description textarea */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Optional category description"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Form action buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/categories')}
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
                  ? 'Update Category'
                  : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
