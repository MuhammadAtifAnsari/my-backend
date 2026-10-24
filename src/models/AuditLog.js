import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., CREATE, UPDATE, APPROVE, FINALIZE
  entity: { type: String, required: true }, // e.g., Employee, Payroll, Leave
  details: { type: String },
  beforeData: { type: Object },
  afterData: { type: Object }
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
