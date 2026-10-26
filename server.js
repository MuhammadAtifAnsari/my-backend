import app from "./src/app.js";
import mongoDB_Connect from './src/db/db.js';
import dotenv from 'dotenv';
import User from "./src/models/UserModel.js";
import LeaveType from "./src/models/LeaveType.js"; // 1. Import LeaveType model
dotenv.config();

const port = 3000;

mongoDB_Connect();

// Seed Admin User
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@hcm.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@hcm.com',
        password: 'adminpassword123',
        role: 'Admin'
      });
      console.log('✅ Default Admin created: admin@hcm.com / adminpassword123');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
};

// Seed Default Leave Types
const seedLeaveTypes = async () => {
  try {
    const count = await LeaveType.countDocuments();
    if (count === 0) {
      await LeaveType.insertMany([
        { name: 'Annual', defaultQuota: 14, isPaid: true },
        { name: 'Sick', defaultQuota: 10, isPaid: true },
        { name: 'Casual', defaultQuota: 10, isPaid: true },
        { name: 'Unpaid', defaultQuota: 999, isPaid: false }
      ]);
      console.log('✅ Default Leave Types created successfully!');
    }
  } catch (err) {
    console.error('Error seeding leave types:', err.message);
  }
};

seedAdmin();
seedLeaveTypes(); // 2. Call the function

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});