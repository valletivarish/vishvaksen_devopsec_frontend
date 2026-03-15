/**
 * Yup validation schemas.
 *
 * Each schema mirrors the constraints enforced by the Spring Boot
 * backend so the user gets immediate client-side feedback before a
 * request is even sent.  Keep these in sync with the corresponding
 * Jakarta Validation annotations on the Java DTOs.
 */

import * as yup from 'yup';

// ------------------------------------------------------------------
// Auth schemas
// ------------------------------------------------------------------

/** Login form validation. */
export const loginSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

/** Registration form validation. */
export const registerSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email address'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
  fullName: yup.string()
    .required('Full name is required')
    .max(100, 'Full name must not exceed 100 characters'),
});

// ------------------------------------------------------------------
// Entity schemas
// ------------------------------------------------------------------

/** Product create / edit form validation. */
export const productSchema = yup.object().shape({
  name: yup.string()
    .required('Product name is required')
    .max(200, 'Product name must not exceed 200 characters'),
  sku: yup.string()
    .required('SKU is required')
    .max(50, 'SKU must not exceed 50 characters')
    .matches(
      /^[A-Za-z0-9-]+$/,
      'SKU may only contain letters, numbers, and hyphens'
    ),
  description: yup.string()
    .max(1000, 'Description must not exceed 1000 characters'),
  unitPrice: yup.number()
    .required('Unit price is required')
    .min(0.01, 'Unit price must be at least 0.01')
    .max(999999.99, 'Unit price must not exceed 999,999.99'),
  reorderLevel: yup.number()
    .required('Reorder level is required')
    .min(0, 'Reorder level cannot be negative')
    .max(100000, 'Reorder level must not exceed 100,000'),
  categoryId: yup.number()
    .required('Category is required'),
  supplierId: yup.number()
    .required('Supplier is required'),
});

/** Category create / edit form validation. */
export const categorySchema = yup.object().shape({
  name: yup.string()
    .required('Category name is required')
    .max(100, 'Category name must not exceed 100 characters'),
  description: yup.string()
    .max(500, 'Description must not exceed 500 characters'),
});

/** Supplier create / edit form validation. */
export const supplierSchema = yup.object().shape({
  name: yup.string()
    .required('Supplier name is required')
    .max(200, 'Supplier name must not exceed 200 characters'),
  contactEmail: yup.string()
    .required('Contact email is required')
    .email('Must be a valid email address'),
  phone: yup.string()
    .max(20, 'Phone number must not exceed 20 characters')
    .matches(
      /^[+]?[0-9\s-]{7,20}$/,
      'Phone number format is invalid'
    ),
  address: yup.string()
    .max(500, 'Address must not exceed 500 characters'),
});

/** Warehouse create / edit form validation. */
export const warehouseSchema = yup.object().shape({
  name: yup.string()
    .required('Warehouse name is required')
    .max(200, 'Warehouse name must not exceed 200 characters'),
  location: yup.string()
    .required('Location is required')
    .max(500, 'Location must not exceed 500 characters'),
  capacity: yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .max(1000000, 'Capacity must not exceed 1,000,000'),
});

/** Stock movement form validation. */
export const stockMovementSchema = yup.object().shape({
  productId: yup.number()
    .required('Product is required'),
  warehouseId: yup.number()
    .required('Warehouse is required'),
  quantity: yup.number()
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1')
    .max(100000, 'Quantity must not exceed 100,000'),
  type: yup.string()
    .required('Movement type is required')
    .oneOf(['IN', 'OUT', 'TRANSFER'], 'Type must be IN, OUT, or TRANSFER'),
  referenceNumber: yup.string()
    .max(100, 'Reference number must not exceed 100 characters'),
  notes: yup.string()
    .max(500, 'Notes must not exceed 500 characters'),
});
