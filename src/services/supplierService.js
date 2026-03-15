/**
 * Supplier service.
 *
 * CRUD operations and search for supplier entities.  Suppliers
 * represent the external vendors that provide products to the
 * inventory.
 */

import api from './api';

/** Fetch all suppliers. */
export const getAllSuppliers = () => {
  return api.get('/suppliers');
};

/**
 * Fetch a single supplier by ID.
 * @param {number|string} id - Supplier primary key.
 */
export const getSupplierById = (id) => {
  return api.get(`/suppliers/${id}`);
};

/**
 * Create a new supplier.
 * @param {Object} data - Supplier payload (name, contactEmail, phone, address).
 */
export const createSupplier = (data) => {
  return api.post('/suppliers', data);
};

/**
 * Update an existing supplier.
 * @param {number|string} id   - Supplier primary key.
 * @param {Object}        data - Fields to update.
 */
export const updateSupplier = (id, data) => {
  return api.put(`/suppliers/${id}`, data);
};

/**
 * Delete a supplier by ID.
 * @param {number|string} id - Supplier primary key.
 */
export const deleteSupplier = (id) => {
  return api.delete(`/suppliers/${id}`);
};

/**
 * Search suppliers by name (partial, case-insensitive match on the backend).
 * @param {string} name - Search term.
 */
export const searchSuppliers = (name) => {
  return api.get('/suppliers/search', { params: { name } });
};
