import React from 'react';
import { Plus, Users, Bug } from 'lucide-react';
import { getApiConfig } from '../services/api';

function Header({ onAddStudent, studentCount }) {
  const handleDebug = () => {
    const config = getApiConfig();
    console.log('=== Debug Information ===');
    console.log('API Configuration:', config);
    console.log('Current URL:', window.location.href);
    console.log('Current Origin:', window.location.origin);
    console.log('User Agent:', navigator.userAgent);
    console.log('========================');
    
    // Test API connection
    fetch('/api/health')
      .then(response => {
        console.log('Health check response:', response);
        if (response.ok) {
          return response.json();
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      })
      .then(data => {
        console.log('Health check data:', data);
        alert('✅ Backend connection successful!\n\nHealth check response:\n' + JSON.stringify(data, null, 2));
      })
      .catch(error => {
        console.error('Health check failed:', error);
        alert('❌ Backend connection failed!\n\nError: ' + error.message + '\n\nCheck console for details.');
      });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Student Management</h1>
              <p className="text-sm text-gray-500">{studentCount} student{studentCount !== 1 ? 's' : ''} enrolled</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDebug}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Debug API connection"
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug
            </button>
            
            <button
              onClick={onAddStudent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
