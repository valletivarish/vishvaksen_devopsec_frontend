/**
 * ErrorMessage component.
 * Renders a styled error banner with an optional retry callback.
 * Used to display API errors or unexpected failures to the user.
 */

import { FiAlertTriangle } from "react-icons/fi";

const ErrorMessage = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="mx-auto my-8 max-w-lg rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <FiAlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
