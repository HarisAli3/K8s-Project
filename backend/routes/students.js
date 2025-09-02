const express = require('express');
const Student = require('../models/Student');
const { validateStudent } = require('../validation/studentValidation');

const router = express.Router();

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.getAll();
    res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
});

// GET /api/students/:id - Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.getById(id);
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    const statusCode = error.message === 'Student not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/students - Create new student
router.post('/', validateStudent, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('Error creating student:', error);
    const statusCode = error.message === 'Email already exists' ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', validateStudent, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating student with ID:', id);
    console.log('Request body:', req.body);
    
    const student = await Student.update(id, req.body);
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    let statusCode = 500;
    if (error.message === 'Student not found') statusCode = 404;
    if (error.message === 'Email already exists') statusCode = 409;
    
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.delete(id);
    res.json({
      success: true,
      message: 'Student deleted successfully',
      data: student
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    const statusCode = error.message === 'Student not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
