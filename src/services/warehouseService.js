/**
 * Warehouse service.
 *
 * CRUD operations for warehouse locations.  Each warehouse has a
 * name, physical location, and storage capacity that governs how
 * much stock it can hold.
 */

import api from './api';

/** Fetch all warehouses. */
export const getAllWarehouses = () => {
  return api.get('/warehouses');
};

/**
 * Fetch a single warehouse by ID.
 * @param {number|string} id - Warehouse primary key.
 */
export const getWarehouseById = (id) => {
  return api.get(`/warehouses/${id}`);
};

/**
 * Create a new warehouse.
 * @param {Object} data - { name, location, capacity }
 */
export const createWarehouse = (data) => {
  return api.post('/warehouses', data);
};

/**
 * Update an existing warehouse.
 * @param {number|string} id   - Warehouse primary key.
 * @param {Object}        data - Fields to update.
 */
export const updateWarehouse = (id, data) => {
  return api.put(`/warehouses/${id}`, data);
};

/**
 * Delete a warehouse by ID.
 * @param {number|string} id - Warehouse primary key.
 */
export const deleteWarehouse = (id) => {
  return api.delete(`/warehouses/${id}`);
};

export const toggleWarehouseStatus = (id) => {
  return api.patch(`/warehouses/${id}/toggle-status`);
};
