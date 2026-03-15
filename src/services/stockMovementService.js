/**
 * Stock Movement service.
 *
 * Manages the recording and querying of inventory movements (IN, OUT,
 * TRANSFER).  Stock movements form the audit trail that explains how
 * product quantities change over time.
 */

import api from './api';

/** Fetch all stock movements. */
export const getAllMovements = () => {
  return api.get('/stock-movements');
};

/**
 * Fetch a single stock movement by ID.
 * @param {number|string} id - Movement primary key.
 */
export const getMovementById = (id) => {
  return api.get(`/stock-movements/${id}`);
};

/**
 * Record a new stock movement.
 * @param {Object} data - { productId, warehouseId, quantity, type, referenceNumber, notes }
 */
export const createMovement = (data) => {
  return api.post('/stock-movements', data);
};

/**
 * Fetch all movements for a specific product.
 * Useful for viewing the stock history of a single item.
 * @param {number|string} productId - Product primary key.
 */
export const getMovementsByProduct = (productId) => {
  return api.get(`/stock-movements/product/${productId}`);
};

/**
 * Fetch all movements for a specific warehouse.
 * @param {number|string} warehouseId - Warehouse primary key.
 */
export const getMovementsByWarehouse = (warehouseId) => {
  return api.get(`/stock-movements/warehouse/${warehouseId}`);
};

/**
 * Fetch the most recent stock movements (backend decides the limit).
 * Typically displayed on the dashboard for a quick activity overview.
 */
export const getRecentMovements = () => {
  return api.get('/stock-movements/recent');
};
