import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const BatarianManagement = () => {
  const apiUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/batarian`;
  const authToken =  localStorage.getItem('token');

  const [batarians, setBatarians] = useState([]);
  const [newBatarian, setNewBatarian] = useState('');
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

  // Add a new Batarian
  const addBatarian = async () => {
    if (!newBatarian.trim()) {
      alert('Please enter a name for the new Batarian');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newBatarian }),
      });

      const data = await response.json();
      if (data.success) {
        setNewBatarian('');
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
        body: JSON.stringify({ name: newName }),
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
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px",margin:'0.4cm' }}>Batarian Management</h1>

      {/* Add New Batarian Form */}
      <div className="mb-4">
        <Form.Control
          type="text"
          value={newBatarian}
          onChange={(e) => setNewBatarian(e.target.value)}
          placeholder="Enter Batarian Name"
        />
        <Button variant="primary" className="mt-2" onClick={addBatarian}>
          Add Batarian
        </Button>
      </div>

      {/* Batarians List Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batarians.map((batarian) => (
            <tr key={batarian.id}>
              <td>{batarian.id}</td>
              <td>{batarian.name}</td>
              <td>
                <Button variant="info" onClick={() => handleViewClick(batarian)}>
                  View/Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => deleteBatarian(batarian.id)}>
                  Delete
                </Button>
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
