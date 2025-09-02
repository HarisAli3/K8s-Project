import React from 'react';
import { Edit, Trash2, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

const StudentList = ({ students, onEdit, onDelete, isLoading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading students...</span>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
        <p className="text-gray-500">Get started by adding your first student.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <div key={student.id} className="card hover:shadow-md transition-shadow">
          <div className="card-content">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {student.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span>{student.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{formatPhone(student.phone)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{formatDate(student.date_of_birth)}</span>
                  </div>
                  
                  {student.address && (
                    <div className="flex items-start space-x-2 text-gray-600 md:col-span-2">
                      <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{student.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  Created: {new Date(student.created_at).toLocaleString()}
                  {student.updated_at !== student.created_at && (
                    <span> • Updated: {new Date(student.updated_at).toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(student)}
                  className="btn btn-secondary btn-sm"
                  title="Edit student"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(student.id)}
                  className="btn btn-danger btn-sm"
                  title="Delete student"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
