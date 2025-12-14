import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Admin dashboard features coming soon! This will include:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>• User management</li>
          <li>• Analytics and reports</li>
          <li>• Content management</li>
          <li>• System configuration</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;