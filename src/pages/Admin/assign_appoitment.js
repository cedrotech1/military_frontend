import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const AssignMissionPage = () => {
  const [missions, setMissions] = useState([]);
  const [batarians, setBatarians] = useState([]);
  const [selectedMissionId, setSelectedMissionId] = useState('');
  const [selectedBatarianId, setSelectedBatarianId] = useState('');
  const [message, setMessage] = useState('');
  const [assignedUsers, setAssignedUsers] = useState(0);
  const TOKEN = localStorage.getItem('token');

  // Fetch missions from the API
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/mission`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      }
    })
      .then(response => {
        if (response.data.success) {
          setMissions(response.data.data);
        } else {
          setMessage('Failed to load missions.');
        }
      })
      .catch(error => {
        setMessage('Error fetching missions: ' + error.message);
      });
  }, []);

  // Fetch Batarians from the API
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/batarian/`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    })
      .then(response => {
        if (response.data.success) {
          setBatarians(response.data.data);
        } else {
          setMessage('Failed to load Batarians.');
        }
      })
      .catch(error => {
        setMessage('Error fetching Batarians: ' + error.message);
      });
  }, []);

  // Handle mission assignment
  const handleAssignMission = () => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/appoitment/assign`, {
      missionId: selectedMissionId,
      batarianId: selectedBatarianId,
    }, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (response.status === 200) {
          if (response.data.message === "No eligible users found for assignment.") {
            setMessage('No eligible users found for assignment.');
          } else if (response.data.message === "No departments found for this Batarian.") {
            setMessage('No departments found for this Batarian.');
          } else {
            setMessage(`Appointments assigned successfully! Assigned Users: ${response.data.assignedUsers}`);
          }
        } else if (response.status === 201) {
          setMessage(`Appointments assigned successfully! Assigned Users: ${response.data.assignedUsers}`);
        } else {
          setMessage('An error occurred during assignment.');
        }
      })
      .catch(error => {
        setMessage('Error assigning mission: ' + error.message);
      });
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header as="h5" className="text-center">Assign Mission to Batarian</Card.Header>
            <Card.Body>
              {message && (
                <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                  <div className="d-flex align-items-center">
                    {message.includes('successfully') ? <FaCheckCircle size={20} className="me-2" /> : <FaExclamationCircle size={20} className="me-2" />}
                    <span>{message}</span>
                  </div>
                </Alert>
              )}

              <Form>
                <Form.Group controlId="missionSelect">
                  <Form.Label>Select Mission</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedMissionId}
                    onChange={(e) => setSelectedMissionId(e.target.value)}
                  >
                    <option value="">Select a Mission</option>
                    {missions.map(mission => (
                      <option key={mission.id} value={mission.id}>
                        {mission.name} - {mission.location}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="batarianSelect" className="mt-3">
                  <Form.Label>Select Batarian</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedBatarianId}
                    onChange={(e) => setSelectedBatarianId(e.target.value)}
                  >
                    <option value="">Select a Batarian</option>
                    {batarians.map(batarian => (
                      <option key={batarian.id} value={batarian.id}>
                        {batarian.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Button 
                  variant="primary" 
                  className="mt-4" 
                  onClick={handleAssignMission} 
                  disabled={!selectedMissionId || !selectedBatarianId}
                >
                  Assign Mission
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AssignMissionPage;
