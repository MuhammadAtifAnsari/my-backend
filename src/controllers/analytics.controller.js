import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';
import LeaveRequest from '../models/LeaveRequest.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get Dashboard KPIs & Analytics
// @route   GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === 'Admin') {
      const headcount = await Employee.countDocuments();
      const payrolls = await Payroll.find({ status: 'Finalized' });
      const totalPayrollCost = payrolls.reduce((acc, curr) => acc + curr.netPay, 0);
      const avgSalary = headcount > 0 ? totalPayrollCost / headcount : 0;
      const auditLogs = await AuditLog.find().populate('actor', 'name role').sort({ createdAt: -1 }).limit(10);

      return res.json({
        role: 'Admin',
        headcount,
        totalPayrollCost: parseFloat(totalPayrollCost.toFixed(2)),
        avgSalary: parseFloat(avgSalary.toFixed(2)),
        auditLogs
      });
    } 
    
    if (role === 'HR') {
      const headcount = await Employee.countDocuments();
      const today = new Date().toISOString().split('T')[0];
      const presentToday = await Attendance.countDocuments({ date: today, status: { $in: ['Present', 'Late'] } });
      const lateToday = await Attendance.countDocuments({ date: today, status: 'Late' });
      const onLeaveToday = await LeaveRequest.countDocuments({ 
        status: 'Approved', 
        startDate: { $lte: new Date() }, 
        endDate: { $gte: new Date() } 
      });
      const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });

      return res.json({
        role: 'HR',
        headcount,
        presentToday,
        lateToday,
        onLeaveToday,
        pendingLeaves
      });
    }

    if (role === 'Employee') {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });

      const attendanceRecords = await Attendance.find({ employee: employee._id }).sort({ date: -1 }).limit(7);
      const lateCount = await Attendance.countDocuments({ employee: employee._id, status: 'Late' });
      const lastPayslip = await Payroll.findOne({ employee: employee._id }).sort({ createdAt: -1 });

      return res.json({
        role: 'Employee',
        attendanceRecords,
        lateCount,
        lastPayslip
      });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Named Export for ES6
export { getDashboardStats };
