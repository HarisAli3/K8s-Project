const pool = require('../database/connection');

class Student {
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        throw new Error('Student not found');
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching student: ${error.message}`);
    }
  }

  static async create(studentData) {
    const { first_name, last_name, email, phone, date_of_birth, address } = studentData;
    try {
      const result = await pool.query(
        'INSERT INTO students (first_name, last_name, email, phone, date_of_birth, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, phone, date_of_birth, address]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Email already exists');
      }
      throw new Error(`Error creating student: ${error.message}`);
    }
  }

  static async update(id, studentData) {
    const { first_name, last_name, email, phone, date_of_birth, address } = studentData;
    
    console.log('Updating student with data:', studentData);
    console.log('Date of birth value:', date_of_birth);
    console.log('Date of birth type:', typeof date_of_birth);
    
    try {
      const result = await pool.query(
        'UPDATE students SET first_name = $1, last_name = $2, email = $3, phone = $4, date_of_birth = $5, address = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [first_name, last_name, email, phone, date_of_birth, address, id]
      );
      if (result.rows.length === 0) {
        throw new Error('Student not found');
      }
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Email already exists');
      }
      throw new Error(`Error updating student: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        throw new Error('Student not found');
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }
}

module.exports = Student;
