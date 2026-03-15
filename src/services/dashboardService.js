/**
 * Dashboard service.
 *
 * Fetches the aggregated summary data displayed on the main dashboard,
 * such as total products, low-stock alerts, recent movements, etc.
 */

import api from './api';

/**
 * Retrieve the dashboard summary from the backend.
 * The exact shape of the response depends on the DashboardController,
 * but typically includes counts, totals, and recent activity.
 */
export const getDashboardSummary = () => {
  return api.get('/dashboard');
};
