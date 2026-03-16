/**
 * LoadingSpinner component.
 * Displays a centered animated spinner with an optional message.
 * Used as a loading indicator while async data is being fetched.
 */

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Animated spinning circle */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-teal-600"></div>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
