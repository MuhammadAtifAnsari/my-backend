import LeaveRequest from '../models/LeaveRequest.js';
import Employee from '../models/Employee.js';

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
const applyLeave = async (req, res) => {
  try {
    const { leaveTypeId, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const leaveRequest = await LeaveRequest.create({
      employee: employee._id,
      leaveType: leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays,
      reason
    });

    res.status(201).json({ message: 'Leave application submitted successfully', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get leave requests (Employee sees own, HR/Admin sees all)
// @route   GET /api/leaves
const getLeaves = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      query.employee = employee._id;
    }

    const leaves = await LeaveRequest.find(query)
      .populate('leaveType')
      .populate({
        path: 'employee',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Approve or Reject leave (HR / Admin)
// @route   PUT /api/leaves/:id/status
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, hrComment } = req.body; // Approved or Rejected
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status || leave.status;
    leave.hrComment = hrComment || leave.hrComment;
    await leave.save();

    res.json({ message: `Leave request ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Named Export for ES6
export { applyLeave, getLeaves, updateLeaveStatus };
