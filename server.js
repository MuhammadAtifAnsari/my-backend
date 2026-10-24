import app from "./src/app.js";
import mongoDB_Connect from './src/db/db.js';
import dotenv from 'dotenv';
import User from "./src/models/UserModel.js";
dotenv.config();


const port = 3000;

mongoDB_Connect().then(async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });
    if (!adminExists && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      await User.create({
        name: 'System Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'Admin'
      });
      console.log('First-run setup: Default Admin account created from environment variables.');
    }
  } catch (err) {
    console.error('Seeding error during startup:', err.message);
    }  
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})