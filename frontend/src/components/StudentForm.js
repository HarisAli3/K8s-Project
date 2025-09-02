import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

const StudentForm = ({ student, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: ''
    }
  });

  // Set form values when editing a student
  useEffect(() => {
    console.log('StudentForm useEffect triggered with student:', student);
    
    if (student) {
      // Format the date properly for the date input
      const formattedDate = student.date_of_birth ? 
        new Date(student.date_of_birth).toISOString().split('T')[0] : '';
      
      console.log('Original date_of_birth:', student.date_of_birth);
      console.log('Formatted date:', formattedDate);
      
      setValue('first_name', student.first_name || '');
      setValue('last_name', student.last_name || '');
      setValue('email', student.email || '');
      setValue('phone', student.phone || '');
      setValue('date_of_birth', formattedDate);
      setValue('address', student.address || '');
    } else {
      // Reset form for new student
      reset();
    }
  }, [student, setValue, reset]);

  const handleFormSubmit = (data) => {
    // Ensure date_of_birth is properly formatted before submission
    if (data.date_of_birth) {
      data.date_of_birth = new Date(data.date_of_birth).toISOString().split('T')[0];
    }
    
    // Debug logging
    console.log('Form data being submitted:', data);
    console.log('Original student data:', student);
    console.log('Form errors:', errors);
    
    onSubmit(data);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 mt-1">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-1"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User size={16} className="inline mr-1" />
                First Name *
              </label>
              <input
                type="text"
                {...register('first_name', { 
                  required: 'First name is required',
                  minLength: { value: 2, message: 'First name must be at least 2 characters' }
                })}
                className={`input ${errors.first_name ? 'border-red-500' : ''}`}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User size={16} className="inline mr-1" />
                Last Name *
              </label>
              <input
                type="text"
                {...register('last_name', { 
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                })}
                className={`input ${errors.last_name ? 'border-red-500' : ''}`}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} className="inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone size={16} className="inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone', {
                pattern: {
                  value: /^[0-9]{10,15}$/, // Basic pattern for 10-15 digits
                  message: 'Phone number must be between 10 and 15 digits'
                }
              })}
              className={`input ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-1" />
              Date of Birth
            </label>
            <input
              type="date"
              {...register('date_of_birth')}
              className="input"
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">{errors.date_of_birth.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin size={16} className="inline mr-1" />
              Address
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className={`input resize-none ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary btn-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-md"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
