const employedb = require('../model/Employee_model');
const uuid = require('uuid');

// Get All Employees
exports.getAllEmployee = async (req, res) => {
  try {
    const employees = await employedb.find();
    res.json(employees);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error while retrieving Employee information' });
  }
};

// Create New Employee
exports.createEmployee = async (req, res) => {
  const { EmployeeName, Department, Date_of_Joining, PhotoFileName, PhoneNumber, Gender } = req.body;

  // Validate request content
  if (!EmployeeName || !Department || !Date_of_Joining || !PhotoFileName || !PhoneNumber || !Gender) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const employee = new employedb({
      EmployeeId: uuid.v4().slice(0, 3),
      EmployeeName,
      Department,
      Date_of_Joining,
      PhotoFileName,
      PhoneNumber,
      Gender
    });

    const data = await employee.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error adding Employee to database' });
  }
};

// Update Employee
exports.UpdateEmployee = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Content cannot be empty for update' });
  }

  try {
    const id = req.params.id;
    const data = await employedb.findByIdAndUpdate(id, req.body, { new: true });

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: `Cannot update Employee with id ${id}. Employee not found!` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error updating Employee information' });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await employedb.findByIdAndDelete(id);

    if (!data) {
      res.status(404).json({ message: `Cannot delete Employee with id ${id}. Maybe the id is wrong!` });
    } else {
      res.json({ message: 'Employee was deleted successfully!' });
    }
  } catch (err) {
    res.status(500).json({ message: `Could not delete Employee with id ${id}` });
  }
};
