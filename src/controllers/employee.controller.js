import User from '../models/UserModel.js';
import Employee from '../models/Employee.js';
import bcrypt from 'bcryptjs';

// @desc    Register a new employee (HR / Admin only)
// @route   POST /api/employees
const registerEmployee = async (req, res) => {
  try {
    const { 
      name, email, employeeCode, department, designation, 
      phone, address, dateOfJoining, basicSalary, allowances 
    } = req.body;

    // Check if user email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate temporary password
    const tempPassword = 'TempPassword123!';

    // 1. Create User login account
    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role: 'Employee',
      department,
      isTemporaryPassword: true,
      employeeId: employeeCode
    });

    // 2. Create Employee profile
    const employee = await Employee.create({
      user: user._id,
      employeeCode,
      department,
      designation,
      phone,
      address,
      dateOfJoining: dateOfJoining || Date.now(),
      salaryStructure: {
        basic: basicSalary || 0,
        allowances: allowances || 0
      }
    });

    res.status(201).json({
      message: 'Employee registered successfully. Temporary password is: TempPassword123!',
      employee,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all employees (Directory with search, filters, paging)
// @route   GET /api/employees
const getEmployees = async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;
    
    let query = {};

    if (department) {
      query.department = department;
    }

    // Fetch employees with pagination
    const employees = await Employee.find(query)
      .populate('user', 'name email role isTemporaryPassword')
      .populate('department', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Filter by search query (name or employeeCode) if provided
    let filteredEmployees = employees;
    if (search) {
      filteredEmployees = employees.filter(emp => 
        emp.user.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(search.toLowerCase())
      );
    }

    const count = await Employee.countDocuments(query);

    res.json({
      employees: filteredEmployees,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEmployees: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Employee 360 Profile by ID
// @route   GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('user', '-password')
      .populate('department');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check scope: Employee can only view their own profile unless Admin/HR
    if (req.user.role === 'Employee' && employee.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update employee profile (Employee can update phone/address, HR can update details)
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Scope check: Employee can only edit own phone & address
    if (req.user.role === 'Employee') {
      if (employee.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      const { phone, address } = req.body;
      employee.phone = phone || employee.phone;
      employee.address = address || employee.address;
      await employee.save();
      return res.json({ message: 'Profile updated successfully', employee });
    }

    // HR / Admin can update full details
    Object.assign(employee, req.body);
    await employee.save();

    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Named Export for ES6
export {
  registerEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
};
