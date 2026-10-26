import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import CompanySetting from '../models/CompanySetting.js';

// @desc    Check In
// @route   POST /api/attendance/check-in
const checkIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (existingAttendance) {
      return res.status(409).json({ message: 'Already checked in today' });
    }

    const now = new Date();
    
    // Safe fallback if CompanySetting fails or doesn't exist yet
    let officeStart = '09:00';
    let graceTimeMinutes = 15;
    try {
      const settings = await CompanySetting.findOne();
      if (settings) {
        officeStart = settings.officeStart || officeStart;
        graceTimeMinutes = settings.graceTimeMinutes ?? graceTimeMinutes;
      }
    } catch (e) {
      // Use defaults if collection doesn't exist
    }

    // Calculate if late
    const [officeHours, officeMins] = officeStart.split(':').map(Number);
    const limitMinutes = officeHours * 60 + officeMins + graceTimeMinutes;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let status = 'Present';
    if (currentMinutes > limitMinutes) {
      status = 'Late';
    }

    const attendance = await Attendance.create({
      employee: employee._id,
      date: today,
      checkInTime: now,
      status
    });

    res.status(201).json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Check Out
// @route   PUT /api/attendance/check-out
const checkOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ employee: employee._id, date: today });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'No check-in record found for today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const now = new Date();
    attendance.checkOutTime = now;

    // Calculate work hours
    const diffMs = now - new Date(attendance.checkInTime);
    const workHours = diffMs / (1000 * 60 * 60);
    attendance.workHours = parseFloat(workHours.toFixed(2));

    let halfDayMinHours = 5;
    try {
      const settings = await CompanySetting.findOne();
      if (settings && settings.halfDayMinHours) {
        halfDayMinHours = settings.halfDayMinHours;
      }
    } catch (e) {}

    if (attendance.workHours < halfDayMinHours) {
      attendance.status = 'Half-Day';
    }

    await attendance.save();
    res.json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Attendance records
// @route   GET /api/attendance
const getAttendance = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      query.employee = employee._id;
    }

    const records = await Attendance.find(query).populate({
      path: 'employee',
      populate: { path: 'user', select: 'name email' }
    }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { checkIn, checkOut, getAttendance };