/**
 * Product service.
 *
 * Provides CRUD operations and specialised queries for the Product
 * entity.  Every function delegates to the shared axios instance
 * which automatically handles auth headers and token expiry.
 */

import api from './api';

/**
 * Fetch the full list of products.
 * @returns {Promise} Array of product objects.
 */
export const getAllProducts = () => {
  return api.get('/products');
};

/**
 * Fetch a single product by its ID.
 * @param {number|string} id - Product primary key.
 */
export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

/**
 * Create a new product.
 * @param {Object} data - Product payload matching the backend DTO.
 */
export const createProduct = (data) => {
  return api.post('/products', data);
};

/**
 * Update an existing product.
 * @param {number|string} id   - Product primary key.
 * @param {Object}        data - Fields to update.
 */
export const updateProduct = (id, data) => {
  return api.put(`/products/${id}`, data);
};

/**
 * Delete a product by ID.
 * @param {number|string} id - Product primary key.
 */
export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

/**
 * Fetch products whose current stock is at or below their reorder level.
 * Useful for inventory alerts on the dashboard.
 */
export const getLowStockProducts = () => {
  return api.get('/products/low-stock');
};

/**
 * Search products by name (case-insensitive partial match on the backend).
 * @param {string} name - Search term.
 */
export const searchProducts = (name) => {
  return api.get('/products/search', { params: { name } });
};

/**
 * Fetch all products belonging to a specific category.
 * @param {number|string} categoryId - Category primary key.
 */
export const getProductsByCategory = (categoryId) => {
  return api.get(`/products/category/${categoryId}`);
};

/**
 * Fetch all products supplied by a given supplier.
 * @param {number|string} supplierId - Supplier primary key.
 */
export const getProductsBySupplierId = (supplierId) => {
  return api.get(`/products/supplier/${supplierId}`);
};
