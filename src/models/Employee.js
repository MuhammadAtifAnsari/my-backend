import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  employeeCode: { type: String, required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  designation: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  dateOfJoining: { type: Date, default: Date.now },
  // Salary structure for Payroll module later
  salaryStructure: {
    basic: { type: Number, required: true, default: 0 },
    allowances: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
