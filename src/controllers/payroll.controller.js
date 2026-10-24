import Payroll from '../models/Payroll.js';
import Employee from '../models/Employee.js';

// @desc    Create/Run Monthly Payroll Draft (HR/Admin)
// @route   POST /api/payroll/run
const runPayroll = async (req, res) => {
  try {
    const { month } = req.body; // YYYY-MM
    const employees = await Employee.find();
    const payrollRecords = [];

    for (let emp of employees) {
      const basic = emp.salaryStructure.basic || 0;
      const gross = basic * 1.5; // Brief rule: Gross = 1.5 x basic
      
      // Annualized tax calculation based on brief slabs
      const annualGross = gross * 12;
      let taxAnnual = 0;
      if (annualGross > 600000 && annualGross <= 1200000) {
        taxAnnual = (annualGross - 600000) * 0.05;
      } else if (annualGross > 1200000 && annualGross <= 2400000) {
        taxAnnual = 30000 + (annualGross - 1200000) * 0.15;
      } else if (annualGross > 2400000) {
        taxAnnual = 210000 + (annualGross - 2400000) * 0.25;
      }
      const monthlyTax = taxAnnual / 12;
      const netPay = gross - monthlyTax;

      let record = await Payroll.findOne({ employee: emp._id, month });
      if (record) {
        if (record.status === 'Finalized') continue; // Locked if finalized
        record.basicSalary = basic;
        record.grossSalary = gross;
        record.tax = parseFloat(monthlyTax.toFixed(2));
        record.netPay = parseFloat(netPay.toFixed(2));
        await record.save();
      } else {
        record = await Payroll.create({
          employee: emp._id,
          month,
          basicSalary: basic,
          grossSalary: gross,
          tax: parseFloat(monthlyTax.toFixed(2)),
          netPay: parseFloat(netPay.toFixed(2)),
          status: 'Draft'
        });
      }
      payrollRecords.push(record);
    }

    res.status(201).json({ message: 'Payroll draft generated successfully', payrollRecords });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Payroll Records (Admin/HR sees all, Employee sees own)
// @route   GET /api/payroll
const getPayroll = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      query.employee = employee._id;
    }

    const payrolls = await Payroll.find(query).populate({
      path: 'employee',
      populate: { path: 'user', select: 'name email' }
    });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Finalize Payroll (Admin only - locks the month)
// @route   PUT /api/payroll/:id/finalize
const finalizePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll record not found' });

    payroll.status = 'Finalized';
    await payroll.save();

    res.json({ message: 'Payroll finalized and locked successfully', payroll });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Named Export for ES6
export { runPayroll, getPayroll, finalizePayroll };
