import React from 'react';
import { Loader } from 'lucide-react';

export const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <Loader className={`${sizes[size]} animate-spin text-primary-600`} />
    </div>
  );
};

export const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export const Toast = ({ toast, onClose }) => {
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className={`${colors[toast.type] || colors.info} text-white px-6 py-3 rounded-lg shadow-lg`}>
      {toast.message}
    </div>
  );
};

export default { Spinner, LoadingCard, Toast };
