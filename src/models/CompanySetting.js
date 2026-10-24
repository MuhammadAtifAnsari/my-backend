import mongoose from 'mongoose';

const companySettingSchema = new mongoose.Schema({
  companyName: { type: String, required: true, default: 'HCM Lite Company' },
  officeStart: { type: String, default: '09:00' },
  graceTimeMinutes: { type: Number, default: 15 },
  halfDayMinHours: { type: Number, default: 5 },
  weekendDays: { type: [String], default: ['Sat', 'Sun'] },
  officeLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    radiusMeters: { type: Number, default: 150 } // e.g. 150 m
  }
}, { timestamps: true });

// module.exports = mongoose.model('CompanySetting', companySettingSchema);
export default mongoose.model('CompanySetting', companySettingSchema);
