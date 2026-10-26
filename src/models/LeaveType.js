import mongoose from 'mongoose';

const leaveTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., Annual, Sick, Casual, Unpaid
  defaultQuota: { type: Number, required: true }, // e.g., 14, 8, 10, or 999 for unpaid
  isPaid: { type: Boolean, default: true }
}, { timestamps: true });

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);

export default LeaveType;