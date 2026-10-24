import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true }, // Format: YYYY-MM
  basicSalary: { type: Number, required: true },
  grossSalary: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Finalized'], default: 'Draft' }
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);

export default Payroll;
