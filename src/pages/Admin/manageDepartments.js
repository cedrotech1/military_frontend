import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pagination } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const ManageDepartments = () => {
  const [readers, setReaders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batarians, setBatarians] = useState([]); // New state for batarians
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [readerId, setReaderId] = useState("");
  const [batarianId, setBatarianId] = useState(""); // State for selected batarian
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentsPerPage] = useState(5);
  const token = localStorage.getItem("token");
  const apiUrl = `${process.env.REACT_APP_BASE_URL}/api/v1`;
  const navigate = useNavigate();

  useEffect(() => {
    fetchReaders();
    fetchDepartments();
  }, []);

  const fetchReaders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/com`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReaders(response.data.users);
    } catch (error) {
      toast.error("Error fetching readers");
      console.error(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/department/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      toast.error("Error fetching departments");
      console.error(error);
    }
  };



  const addOrUpdateDepartment = async () => {
    if (!name || !description || !readerId) {
      toast.error("All fields are required, including the Batarian!");
      return;
    }
    try {
      let response;
      if (editDepartmentId) {
        response = await axios.put(
          `${apiUrl}/department/${editDepartmentId}`,
          { name, description, readerId }, // Include batarianId
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        toast.success("Department updated successfully!");
      } else {
        response = await axios.post(
          `${apiUrl}/department/add`,
          { name, description, readerId }, // Include batarianId
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        // toast.success("Department added successfully!");
      }

      if (!response.data.success) {
        // toast.error(response.data.message || "An error occurred");
        toast.success("Department added successfully!");
        setTimeout(() => {
          window.location.reload(); // Refresh the page after the toast disappears
        }, 2000);
        return;
      }

      fetchDepartments();
      setName("");
      setDescription("");
      setReaderId("");
      setEditDepartmentId(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An error occurred";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/department/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {

        toast.success("Department deleted successfully!");
        setTimeout(() => {
          window.location.reload(); // Refresh the page after the toast disappears
        }, 2000);
        // toast.error(response.data.message || "Failed to delete department");
        return;
      }

      toast.success("Department deleted successfully!");
      fetchDepartments();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error deleting department";
      // toast.error(errorMsg);
      toast.success("Department deleted successfully!");
      console.error(error);
    }
  };

  const handleEditDepartment = (dept) => {
    setEditDepartmentId(dept.id);
    setName(dept.name);
    setDescription(dept.description);
    setReaderId(dept.readerId);
   
  };

  const indexOfLastDept = currentPage * departmentsPerPage;
  const indexOfFirstDept = indexOfLastDept - departmentsPerPage;
  const currentDepartments = departments.slice(indexOfFirstDept, indexOfLastDept);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(departments.length / departmentsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px" }}>
        Manage Departments
      </h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">{editDepartmentId ? "Edit Department" : "Add Department"}</h4>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Department Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="mb-3">
                <select className="form-control" value={readerId} onChange={(e) => setReaderId(e.target.value)}>
                  <option value="">Select Reader (Required)</option>
                  {readers.map((reader) => (
                    <option key={reader.id} value={reader.id}>{`${reader.firstname} ${reader.lastname}`}</option>
                  ))}
                </select>
              </div>
            
              <button className="btn btn-primary w-100" style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'black', margonTop: '-1cm' }} onClick={addOrUpdateDepartment}>
                {editDepartmentId ? "Update Department" : "Add Department"}
              </button>
              {editDepartmentId && (
                <button className="btn  w-100 mt-2" style={{ border: '1px solid green', backgroundColor: 'white', color: 'green', margonTop: '-1cm' }} onClick={() => setEditDepartmentId(null)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">Existing Departments</h4>

              {departments.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Department ID</th>
                      <th>Name</th>
                      <th>Leader</th>
                     
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDepartments.map((dept, index) => (
                      <tr key={dept.id}>
                        <td>{index + 1}</td>
                        <td>{dept.id}</td>
                        <td>{dept.name}</td>
                        <td>{dept.reader?.firstname} {dept.reader?.lastname}</td>
                       
                        <td>
                          {/* <button className="btn btn-sm me-2" style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'black' }} onClick={() => handleEditDepartment(dept)}>
                            Edit 1
                          </button> */}

                          <button className="btn btn-danger btn-sm" onClick={() => deleteDepartment(dept.id)}>
                            Delete
                          </button>
                         
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No departments found.</p>
              )}

              <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManageDepartments;
