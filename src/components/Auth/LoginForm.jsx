/**
 * LoginForm component.
 *
 * Renders a centered card with username/password fields for authentication.
 * Uses react-hook-form for controlled inputs and yup for schema validation.
 *
 * Auth flow:
 *   1. User fills in credentials (or clicks "Use Demo Credentials").
 *   2. On submit, the loginSchema validates inputs client-side.
 *   3. If valid, useAuth().login() sends credentials to the backend.
 *   4. On success the JWT is stored (via AuthContext) and the user is
 *      redirected to /dashboard.
 *   5. On failure a toast notification explains the error.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialise react-hook-form with yup validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  /**
   * Auto-fill the form with demo credentials so reviewers and
   * assessors can quickly log in without typing.
   */
  const fillDemoCredentials = () => {
    setValue('username', 'admin', { shouldValidate: true });
    setValue('password', 'admin123', { shouldValidate: true });
  };

  /**
   * Submit handler -- called only after yup validation passes.
   * Delegates to AuthContext.login() which persists the JWT.
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await login(data);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      // Display a user-friendly message from the backend when available
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">Inventory Management</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiUser />
              </span>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('username')}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiLock />
              </span>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogIn />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Demo credentials button -- fills admin/admin123 for quick testing */}
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
          >
            Use Demo Credentials
          </button>
        </form>

        {/* Link to register page */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-teal-600 hover:text-teal-800 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
