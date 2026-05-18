// controllers/aiController.js — Q5: AI Integration with OpenRouter
const axios = require('axios');
const Employee = require('../models/Employee');

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const MODEL = 'openai/gpt-3.5-turbo'; // or 'mistralai/mistral-7b-instruct'

// Helper: call AI API
const callAI = async (prompt) => {
  const response = await axios.post(
    `${OPENROUTER_BASE_URL}/chat/completions`,
    {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert HR performance analyst. Analyze employee data and provide:
1. Promotion recommendation (Yes/No with reason)
2. Training suggestions (specific courses/skills)
3. Performance feedback (constructive)
4. Career growth path
Keep responses concise, structured, and actionable.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173', // Required by OpenRouter
        'X-Title': 'Employee Analytics System',
      },
    }
  );

  return response.data.choices[0].message.content;
};

// Build prompt from employee data
const buildEmployeePrompt = (employee) => {
  return `Analyze this employee and provide detailed HR recommendations:

Employee Profile:
- Name: ${employee.name}
- Department: ${employee.department}
- Designation: ${employee.designation || 'Employee'}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.experience}
- Skills: ${employee.skills.join(', ')}
- Performance Category: ${employee.performanceCategory}

Please provide:
1. **Promotion Recommendation**: Should this employee be promoted? (Yes/No + reason)
2. **Training Suggestions**: What specific skills or courses should they pursue?
3. **Performance Feedback**: Constructive feedback based on their score (${employee.performanceScore}/100)
4. **Career Path**: Suggested next role/career direction

Be specific and actionable.`;
};

// @desc    Get AI recommendation for a single employee
// @route   POST /api/ai/recommend
// @access  Private
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'employeeId is required' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const prompt = buildEmployeePrompt(employee);

    // Q5: Call AI API
    const recommendation = await callAI(prompt);

    // Save recommendation back to employee document
    employee.aiRecommendation = recommendation;
    employee.lastRecommendationDate = new Date();
    await employee.save();

    res.status(200).json({
      success: true,
      data: {
        employee: {
          id: employee._id,
          name: employee.name,
          department: employee.department,
          performanceScore: employee.performanceScore,
          performanceCategory: employee.performanceCategory,
        },
        recommendation,
        generatedAt: employee.lastRecommendationDate,
      },
    });
  } catch (error) {
    if (error.response) {
      // AI API error
      return res.status(502).json({
        success: false,
        message: 'AI API error: ' + (error.response.data?.error?.message || 'Unknown AI error'),
      });
    }
    next(error);
  }
};

// @desc    Rank and recommend for multiple employees
// @route   POST /api/ai/rank
// @access  Private
const rankEmployees = async (req, res, next) => {
  try {
    const { department, limit = 5 } = req.body;

    const query = department ? { department } : {};
    const employees = await Employee.find(query)
      .sort({ performanceScore: -1 })
      .limit(parseInt(limit));

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees found' });
    }

    // Build a combined prompt for ranking
    const employeeList = employees
      .map(
        (e, i) =>
          `${i + 1}. ${e.name} | Dept: ${e.department} | Score: ${e.performanceScore} | Exp: ${e.experience}yrs | Skills: ${e.skills.join(', ')}`
      )
      .join('\n');

    const rankPrompt = `Rank these employees and provide brief individual recommendations:

${employeeList}

For each employee provide:
- Overall rank and why
- Promotion candidacy (Yes/No)
- One key strength
- One area to improve

Format as a numbered list matching the employee numbers above.`;

    const ranking = await callAI(rankPrompt);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: {
        employees: employees.map((e) => ({
          id: e._id,
          name: e.name,
          department: e.department,
          performanceScore: e.performanceScore,
          performanceCategory: e.performanceCategory,
          experience: e.experience,
          skills: e.skills,
        })),
        aiRanking: ranking,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation, rankEmployees };
