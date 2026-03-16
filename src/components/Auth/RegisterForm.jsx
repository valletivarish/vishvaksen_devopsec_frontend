/**
 * RegisterForm component.
 *
 * Renders a registration card with username, email, password, and
 * full name fields.  Uses react-hook-form + yup for validation.
 *
 * On successful registration the AuthContext stores the JWT and the
 * user is redirected to /dashboard.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUserPlus, FiUser, FiMail, FiLock, FiEdit } from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';
import { registerSchema } from '../../utils/validators';

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', fullName: '' },
  });

  /**
   * Submit handler -- called after yup validation passes.
   * Delegates to AuthContext.register() which persists the JWT.
   */
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await registerUser(data);
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
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
          <h1 className="text-3xl font-bold text-teal-700">Create Account</h1>
          <p className="text-gray-500 mt-2">Join the Inventory Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name field */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiEdit />
              </span>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

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
                placeholder="Choose a username"
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

          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiMail />
              </span>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
                placeholder="Create a password"
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
            <FiUserPlus />
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Link to login page */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:text-teal-800 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
