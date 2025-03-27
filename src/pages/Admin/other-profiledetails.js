import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Alert, Spinner, ListGroup } from 'react-bootstrap';

const AddOrGetSoldierSkills = () => {
  const { id } = useParams();  // Get the 'id' param from URL
  const [skills, setSkills] = useState([]);
  const [soldierSkills, setSoldierSkills] = useState([]);
  const [name, setName] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const TOKEN = localStorage.getItem('token');

  // Fetch Available Skills from API when the page loads
  useEffect(() => {
    // Fetch available skills
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/skills/`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        },
      })
      .then((response) => {
        if (response.data.success && response.data.data.length > 0) {
          setSkills(response.data.data);
        } else {
          setMessage('No skills found.');
        }
      })
      .catch((error) => {
        setMessage('Error fetching skills: ' + error.message);
      });

    // Fetch Soldier Skills if the 'id' exists in the URL
    if (id) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/api/v1/sordierskills/`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            // Filter soldier skills where userID matches the 'id' param
            const filteredSkills = response.data.filter(skill => skill.userID === parseInt(id));
            setSoldierSkills(filteredSkills);
          } else {
            setMessage('No soldier skills found for this user.');
          }
        })
        .catch((error) => {
          setMessage('Error fetching soldier skills: ' + error.message);
        });
    }
  }, [id, TOKEN]);

  // Handle Form Submit (Add Soldier Skills)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSkillId || !name || !description) {
      setMessage('Please fill all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('skillsID', selectedSkillId);
    formData.append('description', description);
    formData.append('image', image);

    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/v1/sordierskills/add/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setLoading(false);
        setMessage('Skills added successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        setMessage('Error adding skills: ' + error.message);
      });
  };

  return (
    <div>
    
      <h2 style={{ backgroundColor: 'lightgreen', padding: '0.3cm', color: 'black', borderRadius: '6px' }}>{id ? 'Soldier Skills ': 'Add Soldier Skills'}</h2>



      
      {message && <Alert variant="info">{message}</Alert>}

      <div className="mb-4">
        <Card>
          <Card.Body>
            <h4>Add Soldier Skills</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formSkills">
                <Form.Label>Select Skill</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                >
                  <option value="">Select a Skill</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <div>
        <h4>Existing Soldier Skills</h4>
        <ListGroup>
          {soldierSkills.length > 0 ? (
            soldierSkills.map((skill) => (
              <ListGroup.Item key={skill.id} style={{
                margin: '0.3cm',
                padding: '10px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '5px', 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h5 style={{ marginBottom: '5px', fontSize: '1.1em', color: '#333' }}>
                  Skills Title: {skill.name}
                </h5>
                <p style={{ marginBottom: '5px', color: '#666' }}>
                  Description: {skill.description}
                </p>
                <p style={{ color: '#555', fontSize: '0.95em' }}>
                  Skills Type: {skill.skill.name}
                </p>
              </ListGroup.Item>
              
            ))
          ) : (
            <p>No skills available.</p>
          )}
        </ListGroup>
      </div>
    </div>
  );
};

export default AddOrGetSoldierSkills;
