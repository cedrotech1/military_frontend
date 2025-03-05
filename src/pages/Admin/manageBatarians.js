import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { Link } from "react-router-dom";
const BatarianManagement = () => {
  const apiUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/batarian`;
  const departmentApiUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/department`; // URL to fetch departments
  const authToken = localStorage.getItem('token');

  const [batarians, setBatarians] = useState([]);
  const [departments, setDepartments] = useState([]);  // Store department data
  const [newBatarian, setNewBatarian] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');  // State for selected department
  const [showModal, setShowModal] = useState(false);
  const [currentBatarian, setCurrentBatarian] = useState(null);

  // Fetch Batarians from the API
  const fetchBatarians = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': '*/*',
        },
      });
      const data = await response.json();
      if (data.success) {
        setBatarians(data.data);
      }
    } catch (error) {
      console.error('Error fetching Batarians:', error);
    }
  };

  // Fetch departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await fetch(departmentApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': '*/*',
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        setDepartments(data); // Set department data
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Add a new Batarian
  const addBatarian = async () => {
    if (!newBatarian.trim() || !selectedDepartment) {
      alert('Please enter a name and select a department for the new Batarian');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newBatarian, departmentId: selectedDepartment }),
      });

      const data = await response.json();
      if (data.success) {
        setNewBatarian('');
        setSelectedDepartment('');  // Clear department selection
        fetchBatarians(); // Refresh the list
      } else {
        alert('Failed to add Batarian');
      }
    } catch (error) {
      console.error('Error adding Batarian:', error);
    }
  };

  // Open modal with Batarian details
  const handleViewClick = (batarian) => {
    setCurrentBatarian(batarian);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBatarian(null);
  };

  // Edit Batarian
  const editBatarian = async (id, newName) => {
    if (!newName.trim()) {
      alert('Please enter a valid name');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, departmentId: selectedDepartment }),
      });

      const data = await response.json();
      if (data.success) {
        fetchBatarians(); // Refresh the list
        handleCloseModal(); // Close modal
      } else {
        alert('Failed to update Batarian');
      }
    } catch (error) {
      console.error('Error editing Batarian:', error);
    }
  };

  // Delete Batarian
  const deleteBatarian = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Batarian?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': '*/*',
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchBatarians(); // Refresh the list
      } else {
        alert('Failed to delete Batarian');
      }
    } catch (error) {
      console.error('Error deleting Batarian:', error);
    }
  };

  useEffect(() => {
    fetchBatarians();
    fetchDepartments();  // Fetch departments when the component mounts
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px", margin: '0.4cm' }}>Batarian Management</h1>

      {/* Add New Batarian Form */}
      <div className="mb-4">
        <Form.Control
          type="text"
          value={newBatarian}
          onChange={(e) => setNewBatarian(e.target.value)}
          placeholder="Enter Batarian Name"
        />
        {/* Department Select Dropdown */}
        <Form.Control
          as="select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="mt-2"
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Form.Control>
        <Button variant="primary" className="mt-2" onClick={addBatarian}>
          Add Batarian
        </Button>
      </div>

      {/* Batarians List Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name (batarian)</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batarians.map((batarian) => (
            <tr key={batarian.id}>
              <td>{batarian.id}</td>
              <td>{batarian.name}</td>
              <td>{batarian.department?.name || 'No Department'}</td> {/* Display department name */}
              <td>
                <Button variant="info" onClick={() => handleViewClick(batarian)}>
                  View/Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => deleteBatarian(batarian.id)}>
                  Delete
                </Button>

                <Link to={`/users/${batarian.id}`}>
            <Button variant="info">View Users</Button>
          </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Viewing and Editing Batarian */}
      {currentBatarian && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Batarian</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formBatarianName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={currentBatarian.name}
                  onChange={(e) => setCurrentBatarian({ ...currentBatarian, name: e.target.value })}
                />
              </Form.Group>
              {/* Department Select for Editing */}
              <Form.Group controlId="formDepartmentSelect">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => editBatarian(currentBatarian.id, currentBatarian.name)}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default BatarianManagement;
