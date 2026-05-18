// models/Employee.js — Q3: Schema Creation, Validation, CRUD
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,                  // Q3 test: duplicate email → error
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Development',
          'Design',
          'Marketing',
          'Sales',
          'HR',
          'Finance',
          'Operations',
          'Management',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one skill is required',
      },
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'], // Q3 test: missing score → error
      min: [0, 'Performance score cannot be less than 0'],
      max: [100, 'Performance score cannot exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
    },
    // Extra enrichment fields
    designation: {
      type: String,
      trim: true,
      default: 'Employee',
    },
    aiRecommendation: {
      type: String,
      default: null,
    },
    lastRecommendationDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Index for faster searches — Q3: Query Filtering
employeeSchema.index({ department: 1 });
employeeSchema.index({ performanceScore: -1 });

// Virtual: rank category based on performance score
employeeSchema.virtual('performanceCategory').get(function () {
  if (this.performanceScore >= 85) return 'Excellent';
  if (this.performanceScore >= 70) return 'Good';
  if (this.performanceScore >= 50) return 'Average';
  return 'Needs Improvement';
});

// Ensure virtuals appear in JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);
