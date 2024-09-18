import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { API_URL } from "../API_URL/api_url";
import { NavBar } from "../Navigation Bar/header";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_MODAL_TITLE":
      return {
        ...state,
        modalTitle: action.payload.modalTitle,
        EmployeeId: action.payload.EmployeeId || 0,
      };
    default:
      return state;
  }
};

export const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [state, dispatch] = useReducer(reducer, {
    modalTitle: "",
    EmployeeId: 0,
    EmployeeName: "",
    Department: "",
    Date_of_Joining: "",
    PhotoFileName: "",
    PhoneNumber: "",
    Gender: "",
    photoPath: API_URL.photosPath,
  });
  const [phoneError, setPhoneError] = useState("");
  const [formErrors, setFormErrors] = useState({
    EmployeeName: "",
    Department: "",
    Date_of_Joining: "",
    PhoneNumber: "",
    Gender: "",
    PhotoFileName: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL.EMPLOYEE, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_URL.DEPARTMENT, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!state.EmployeeName) errors.EmployeeName = "Employee Name is required.";
    if (!state.Department) errors.Department = "Department is required.";
    if (!state.Date_of_Joining) errors.Date_of_Joining = "Date of Joining is required.";
    if (!state.PhoneNumber || phoneError) errors.PhoneNumber = phoneError;
    if (!state.Gender) errors.Gender = "Gender is required.";
    if (!state.PhotoFileName) errors.PhotoFileName = "Profile Photo is required.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      alert("Please fix the errors before submitting.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("EmployeeName", state.EmployeeName);
      formData.append("Department", state.Department);
      formData.append("Date_of_Joining", state.Date_of_Joining);
      formData.append("PhotoFileName", state.PhotoFileName);
      formData.append("PhoneNumber", state.PhoneNumber);
      formData.append("Gender", state.Gender);

      await axios.post(API_URL.EMPLOYEE, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      alert("Employee successfully added!");
      fetchEmployees();
    } catch (err) {
      console.error("Error creating employee:", err);
      alert(`Error while Creating Employee: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleUpdate = async (id) => {
    if (!validateForm()) {
      alert("Please fix the errors before submitting.");
      return;
    }
    try {
      await axios.put(`${API_URL.EMPLOYEE}${id}`, {
        EmployeeName: state.EmployeeName,
        Department: state.Department,
        Date_of_Joining: state.Date_of_Joining,
        PhotoFileName: state.PhotoFileName,
        PhoneNumber: state.PhoneNumber,
        Gender: state.Gender,
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      alert("Employee successfully updated!");
      fetchEmployees();
    } catch (err) {
      alert(`Error while Updating Employee: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${API_URL.EMPLOYEE}${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        alert("Employee successfully deleted!");
        fetchEmployees();
      } catch (err) {
        alert(`Error while Deleting Employee: ${err.response?.data?.message || 'Unknown error'}`);
      }
    }
  };

  const imageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await axios.post(API_URL.PROFILEPHOTO, formData);
      dispatch({
        type: "UPDATE_STATE",
        payload: { PhotoFileName: response.data.fileName },
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error while uploading image");
    }
  };

  const filteredEmployees = employees.filter((emp) => (
    emp.EmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.PhoneNumber.includes(searchQuery) ||
    emp.Department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.Gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.Date_of_Joining.includes(searchQuery)
  ));

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\D/g, '');

    if (cleanedValue.length <= 10) {
      dispatch({ type: "UPDATE_STATE", payload: { PhoneNumber: cleanedValue } });
      setPhoneError(cleanedValue.length === 10 ? "" : "Phone number must be 10 digits long.");
    }
  };

  return (
    <div className="table-responsive navbarCustom">
      <NavBar />
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Employee Details"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() => dispatch({ type: "SET_MODAL_TITLE", payload: { modalTitle: "Add Employee" } })}
      >
        Add Employee
      </button>
      <table className="table table-hover table-sm text-center">
        <thead className="bg-info">
          <tr>
            <th>EmployeeId</th>
            <th>EmployeeName</th>
            <th>PhoneNumber</th>
            <th>Profile Photo</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.EmployeeId}</td>
              <td>{emp.EmployeeName}</td>
              <td>{emp.PhoneNumber}</td>
              <td><img className="rounded-circle profileImage" src={`${state.photoPath}${emp.PhotoFileName}`} alt="" /></td>
              <td>{emp.Department}</td>
              <td>{emp.Gender}</td>
              <td>{emp.Date_of_Joining}</td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => dispatch({
                    type: "SET_MODAL_TITLE",
                    payload: {
                      modalTitle: "Update Employee",
                      EmployeeId: emp._id,
                      EmployeeName: emp.EmployeeName,
                      Department: emp.Department,
                      Date_of_Joining: emp.Date_of_Joining,
                      PhotoFileName: emp.PhotoFileName,
                      PhoneNumber: emp.PhoneNumber,
                      Gender: emp.Gender,
                    }
                  })}
                  className="btn btn-sm shadow-lg rounded-pill"
                >
                  <i className="fa-sharp fa-solid fa-pen-to-square" style={{ fontSize: "10px" }}></i>
                </button>
                <button
                  className="btn btn-sm shadow-lg rounded-pill ms-2"
                  onClick={() => handleDelete(emp._id)}
                >
                  <i className="fa-sharp fa-solid fa-trash" style={{ fontSize: "10px" }}></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{state.modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="EmployeeName" className="form-label">Employee Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="EmployeeName"
                  value={state.EmployeeName}
                  onChange={(e) => dispatch({ type: "UPDATE_STATE", payload: { EmployeeName: e.target.value } })}
                />
                {formErrors.EmployeeName && <div className="text-danger">{formErrors.EmployeeName}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="Department" className="form-label">Department</label>
                <select
                  className="form-control"
                  id="Department"
                  value={state.Department}
                  onChange={(e) => dispatch({ type: "UPDATE_STATE", payload: { Department: e.target.value } })}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept.DepartmentName}>{dept.DepartmentName}</option>
                  ))}
                </select>
                {formErrors.Department && <div className="text-danger">{formErrors.Department}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="Date_of_Joining" className="form-label">Date of Joining</label>
                <input
                  type="date"
                  className="form-control"
                  id="Date_of_Joining"
                  value={state.Date_of_Joining}
                  onChange={(e) => dispatch({ type: "UPDATE_STATE", payload: { Date_of_Joining: e.target.value } })}
                />
                {formErrors.Date_of_Joining && <div className="text-danger">{formErrors.Date_of_Joining}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="PhoneNumber" className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="PhoneNumber"
                  value={state.PhoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                {formErrors.PhoneNumber && <div className="text-danger">{formErrors.PhoneNumber}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="Gender" className="form-label">Gender</label>
                <select
                  className="form-control"
                  id="Gender"
                  value={state.Gender}
                  onChange={(e) => dispatch({ type: "UPDATE_STATE", payload: { Gender: e.target.value } })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.Gender && <div className="text-danger">{formErrors.Gender}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="PhotoFileName" className="form-label">Profile Photo</label>
                <input
                  type="file"
                  className="form-control"
                  id="PhotoFileName"
                  onChange={imageUpload}
                />
                {formErrors.PhotoFileName && <div className="text-danger">{formErrors.PhotoFileName}</div>}
                <img
                  className="mt-2 rounded-circle profileImage"
                  src={state.PhotoFileName ? `${state.photoPath}${state.PhotoFileName}` : "default-image-path"}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={state.EmployeeId === 0 ? handleCreate : () => handleUpdate(state.EmployeeId)}
              >
                {state.EmployeeId === 0 ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
