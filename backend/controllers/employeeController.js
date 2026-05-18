// controllers/employeeController.js — Q2: Controller & Route Structure, Q3: CRUD, Q4: Integration
const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

// @desc    Add a new employee
// @route   POST /api/employees
// @access  Private (HR/Admin)
const addEmployee = async (req, res, next) => {
  try {
    // Q2: Validation Logic
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, department, skills, performanceScore, experience, designation } = req.body;

    // Q3 test: Insert valid employee → stored successfully
    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
      designation,
    });

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: employee,
    });
  } catch (error) {
    next(error); // Pass to error handler (catches duplicate email, validation errors)
  }
};

// @desc    Get all employees (with optional sorting/pagination)
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res, next) => {
  try {
    // Build query filters
    const query = {};

    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Filter by min score
    if (req.query.minScore) {
      query.performanceScore = { $gte: Number(req.query.minScore) };
    }

    // Sorting (default: highest performance score first)
    const sortBy = req.query.sortBy || 'performanceScore';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
      Employee.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search employees by department or name
// @route   GET /api/employees/search?department=Development&name=Aman
// @access  Private
const searchEmployees = async (req, res, next) => {
  try {
    const { department, name, skill } = req.query;
    const query = {};

    // Q3 test: Search by department → filtered employee list
    if (department) query.department = department;
    if (name) query.name = { $regex: name, $options: 'i' }; // case-insensitive
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };

    const employees = await Employee.find(query).sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    // Q4 test: Update performance score → updated data shown
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
const deleteEmployee = async (req, res, next) => {
  try {
    // Q4 test: Delete employee → employee removed successfully
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee analytics & rankings
// @route   GET /api/employees/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalEmployees,
      departmentStats,
      topPerformers,
      avgScore,
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
            avgScore: { $avg: '$performanceScore' },
            avgExperience: { $avg: '$experience' },
          },
        },
        { $sort: { avgScore: -1 } },
      ]),
      Employee.find().sort({ performanceScore: -1 }).limit(5).select('name department performanceScore experience'),
      Employee.aggregate([{ $group: { _id: null, avg: { $avg: '$performanceScore' } } }]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        averagePerformanceScore: avgScore[0]?.avg?.toFixed(2) || 0,
        departmentStats,
        topPerformers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics,
};
