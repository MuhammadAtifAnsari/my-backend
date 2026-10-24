import express from "express";
import cors from "cors";
import authRoutes from './routes/auth.routes.js';
import orgRoutes from './routes/org.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import payrollRoutes from './routes/payroll.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/org', orgRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/analytics', analyticsRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: 'HCM Lite API is running...' });
// });

app.get("/user", (req, res) => {
    res.json({
        message: "users fetched!",
    })
    console.log("users fetched");
});

app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});




export default app;