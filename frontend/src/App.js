import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import studentAPI from './services/api';
import toast from 'react-hot-toast';

function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentAPI.getAll();
      // Defensive: support different response shapes and failures returning HTML/text
      const apiData = response?.data;
      const studentsArray = Array.isArray(apiData?.data)
        ? apiData.data
        : Array.isArray(apiData)
          ? apiData
          : [];
      setStudents(studentsArray);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle add student
  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  // Handle edit student
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  // Handle form submission
  const handleFormSubmit = async (studentData) => {
    try {
      setFormLoading(true);
      
      if (editingStudent) {
        // Update existing student
        const response = await studentAPI.update(editingStudent.id, studentData);
        setStudents(students.map(student => 
          student.id === editingStudent.id ? response.data.data : student
        ));
        toast.success('Student updated successfully!');
      } else {
        // Create new student
        const response = await studentAPI.create(studentData);
        setStudents([response.data.data, ...students]);
        toast.success('Student added successfully!');
      }
      
      setShowForm(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
      
      // Handle validation errors specifically
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        validationErrors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to save student. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      await studentAPI.delete(studentId);
      setStudents(students.filter(student => student.id !== studentId));
      toast.success('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete student. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAddStudent={handleAddStudent}
        studentCount={Array.isArray(students) ? students.length : 0}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentList
          students={Array.isArray(students) ? students : []}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          isLoading={isLoading}
        />
      </main>

      {showForm && (
        <StudentForm
          student={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
