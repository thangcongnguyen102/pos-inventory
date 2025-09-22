import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ username: "", password: "" });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "admin") fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employees", newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Employee added successfully!");
      setNewEmployee({ username: "", password: "" });
      fetchEmployees();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to add employee", err);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${editingEmployee.id}`, editingEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Employee updated successfully!");
      setEditingEmployee(null);
      fetchEmployees();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update employee", err);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Employee deleted successfully!");
      fetchEmployees();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete employee", err);
    }
  };

  if (role !== "admin") {
    return <div className="p-6 text-red-500">Unauthorized access.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">👥 Employee Management</h2>

      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-500 rounded">
          {successMessage}
        </div>
      )}

      {/* Add New Employee Form */}
      <form onSubmit={handleAddEmployee} className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Username"
          value={newEmployee.username}
          onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
          className="p-2 border rounded"
          required
          autoComplete="username" // ✅ added
        />
        <input
          type="password"
          placeholder="Password"
          value={newEmployee.password}
          onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
          className="p-2 border rounded"
          required
          autoComplete="new-password" // ✅ added
          
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </form>

      {/* Employee Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className="border p-2">{emp.username}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded mr-2"
                  onClick={() => setEditingEmployee(emp)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => setDeleteId(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingEmployee && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Edit Employee</h3>
          <input
            type="text"
            placeholder="Username"
            value={editingEmployee.username}
            onChange={(e) => setEditingEmployee({ ...editingEmployee, username: e.target.value })}
            className="p-2 border rounded mr-2"
            autoComplete="username" // ✅ edit
          />
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setEditingEmployee({ ...editingEmployee, password: e.target.value })}
            className="p-2 border rounded mr-2"
            autoComplete="new-password"
          />
          <button
            onClick={handleUpdateEmployee}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this employee?</h3>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={() => { handleDeleteEmployee(deleteId); setDeleteId(null); }} className="bg-red-600 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
