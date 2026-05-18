// routes/employeeRoutes.js — Q2: REST APIs, Validation Logic
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics,
} = require('../controllers/employeeController');

// Validation rules for adding/updating an employee
const employeeValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
    .isIn(['Development', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Management'])
    .withMessage('Invalid department'),
  body('skills')
    .isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('performanceScore')
    .notEmpty().withMessage('Performance score is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('experience')
    .notEmpty().withMessage('Years of experience is required')
    .isFloat({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50'),
];

// ─── Routes ────────────────────────────────────────────────────────────────

// GET  /api/employees/analytics   → must be before /:id to avoid conflict
router.get('/analytics', protect, getAnalytics);

// GET  /api/employees/search?department=Development
router.get('/search', protect, searchEmployees);

// GET  /api/employees             → all employees (with filters/pagination)
// POST /api/employees             → add employee
router.route('/')
  .get(protect, getAllEmployees)
  .post(protect, authorize('admin', 'hr'), employeeValidation, addEmployee);

// GET  /api/employees/:id         → single employee
// PUT  /api/employees/:id         → update employee
// DELETE /api/employees/:id       → delete (admin only)
router.route('/:id')
  .get(protect, getEmployee)
  .put(protect, authorize('admin', 'hr'), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;
