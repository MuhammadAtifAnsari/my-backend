import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';

// @desc    Process Natural Language Query for HCM Assistant
// @route   POST /api/ai/query
export const processAIQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const lowerQuery = query.toLowerCase();

    // Intent 1: Check Employee Count / Headcount
    if (lowerQuery.includes('how many employees') || lowerQuery.includes('headcount') || lowerQuery.includes('total staff')) {
      const count = await Employee.countDocuments();
      return res.json({
        reply: `Currently, there are ${count} active employees registered in the organization system.`
      });
    }

    // Intent 2: Today's Attendance Overview
    if (lowerQuery.includes('present today') || lowerQuery.includes('attendance summary') || lowerQuery.includes('who is late')) {
      const today = new Date().toISOString().split('T')[0];
      const presentCount = await Attendance.countDocuments({ 
        date: { $regex: today }, 
        status: { $in: ['Present', 'Late'] } 
      });
      const lateCount = await Attendance.countDocuments({ 
        date: { $regex: today }, 
        status: 'Late' 
      });

      return res.json({
        reply: `Today's Summary (${today}): ${presentCount} staff checked in (${lateCount} marked as Late).`
      });
    }

    // Intent 3: Pending Leaves
    if (lowerQuery.includes('pending leave') || lowerQuery.includes('leave requests') || lowerQuery.includes('leaves to approve')) {
      const pendingCount = await LeaveRequest.countDocuments({ status: 'Pending' });
      return res.json({
        reply: `There are currently ${pendingCount} pending leave applications requiring approval.`
      });
    }

    // Fallback response
    res.json({
      reply: `I am your HCM Lite AI Assistant. You can ask me about "total headcount", "present staff today", or "pending leave applications".`
    });

  } catch (error) {
    res.status(500).json({ message: 'AI Processing Error', error: error.message });
  }
};