/**
 * Category service.
 *
 * CRUD operations for product categories.  Categories are used to
 * logically group products in the inventory.
 */

import api from './api';

/** Fetch all categories. */
export const getAllCategories = () => {
  return api.get('/categories');
};

/**
 * Fetch a single category by ID.
 * @param {number|string} id - Category primary key.
 */
export const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};

/**
 * Create a new category.
 * @param {Object} data - { name, description }
 */
export const createCategory = (data) => {
  return api.post('/categories', data);
};

/**
 * Update an existing category.
 * @param {number|string} id   - Category primary key.
 * @param {Object}        data - Fields to update.
 */
export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data);
};

/**
 * Delete a category by ID.
 * @param {number|string} id - Category primary key.
 */
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

export const toggleCategoryStatus = (id) => {
  return api.patch(`/categories/${id}/toggle-status`);
};
