/**
 * Utility functions for consistent formatting of currency values,
 * dates, and other display strings throughout the application.
 */

/**
 * Format a numeric value as a USD currency string.
 * Falls back to "$0.00" when the input is null or undefined.
 *
 * @param {number|string} value - the monetary amount to format
 * @returns {string} formatted currency string, e.g. "$1,234.56"
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
};

/**
 * Format an ISO date-time string into a human-readable local format.
 * Returns "N/A" when the input is falsy.
 *
 * @param {string} dateString - ISO 8601 date-time string from the backend
 * @returns {string} formatted date-time, e.g. "Jan 15, 2026, 3:30 PM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) {
    return "N/A";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateString));
};
