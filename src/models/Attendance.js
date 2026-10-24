import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { 
    type: String, 
    enum: ['Present', 'Late', 'Half-Day', 'Absent', 'On Leave'], 
    default: 'Present' 
  },
  workHours: { type: Number, default: 0 },
  correctionRequested: { type: Boolean, default: false },
  correctionReason: { type: String }
}, { timestamps: true });

// Ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
