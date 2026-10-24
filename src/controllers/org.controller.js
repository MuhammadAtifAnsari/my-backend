import CompanySetting from '../models/CompanySetting.js';
import Department from '../models/Department.js';
import LeaveType from '../models/LeaveType.js';
import Holiday from '../models/Holiday.js';

// @desc    Get Company Settings
// @route   GET /api/org/settings
const getSettings = async (req, res) => {
  try {
    let settings = await CompanySetting.findOne();
    if (!settings) {
      settings = await CompanySetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update Company Settings (Admin only)
// @route   PUT /api/org/settings
const updateSettings = async (req, res) => {
  try {
    let settings = await CompanySetting.findOne();
    if (!settings) {
      settings = new CompanySetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ message: 'Company settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Departments ---
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const department = await Department.create({ name, description });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Leave Types ---
const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find();
    res.json(leaveTypes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createLeaveType = async (req, res) => {
  try {
    const { name, defaultQuota, isPaid } = req.body;
    const leaveType = await LeaveType.create({ name, defaultQuota, isPaid });
    res.status(201).json(leaveType);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Holidays ---
const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const createHoliday = async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const holiday = await Holiday.create({ title, date, description });
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Named Export for ES6
export {
  getSettings,
  updateSettings,
  getDepartments,
  createDepartment,
  getLeaveTypes,
  createLeaveType,
  getHolidays,
  createHoliday,
};
