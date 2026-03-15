# Inventory Management System - Frontend

Student: Vishvaksen Machana (25173421)
Module: Cloud DevOpsSec (H9CDOS)

## Overview

This is the frontend for the Inventory Management System, built with React 18 and Vite. It provides a complete user interface for managing products, categories, suppliers, warehouses, and stock movements with real-time validation and responsive design.

## Tech Stack

- React 18 with Vite
- Tailwind CSS for styling
- React Router DOM for routing
- Axios for API communication
- React Hook Form with Yup for form validation
- Recharts for data visualization
- React Toastify for notifications
- React Icons for UI icons

## Prerequisites

- Node.js 18 or higher
- npm 9+

## Local Development

1. Install dependencies:
   npm install

2. Start development server:
   npm run dev

3. Access at http://localhost:5173

The development server proxies API requests to http://localhost:8080 (backend).

## Demo Credentials

The login page provides a "Use Demo Credentials" button that auto-fills:
- Username: admin
- Password: admin123

## Available Scripts

- npm run dev - Start development server
- npm run build - Build for production
- npm run lint - Run ESLint
- npm run preview - Preview production build

## Pages

- /login - Login page with demo credentials auto-fill
- /register - User registration
- /dashboard - Overview with summary cards, low stock alerts, recent movements
- /products - Product management (CRUD)
- /categories - Category management (CRUD)
- /suppliers - Supplier management (CRUD)
- /warehouses - Warehouse management (CRUD)
- /stock-movements - Stock movement tracking

## CI/CD

The GitHub Actions pipeline (.github/workflows/ci-cd.yml) runs ESLint, builds the production bundle, runs npm audit, and deploys to S3 for static hosting.
