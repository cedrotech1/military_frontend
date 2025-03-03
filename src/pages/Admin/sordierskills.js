import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';

const SoldierSkillsList = ({ userId }) => {
  const [soldierSkills, setSoldierSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const TOKEN = localStorage.getItem('token');

  // Fetch Soldier Skills for a Specific User
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/v1/sordierskills/one/${userId}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'accept': '*/*',
        },
      })
      .then((response) => {
        setLoading(false);
        if (response.data && response.data.length > 0) {
          setSoldierSkills(response.data);
        } else {
          setMessage('No soldier skills found for this user.');
        }
      })
      .catch((error) => {
        setLoading(false);
        setMessage('Error fetching soldier skills: ' + error.message);
      });
  }, [userId, TOKEN]);

  return (
    <div>
      <h2>Soldier Skills</h2>
      {message && <Alert variant="info">{message}</Alert>}
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Row>
          {soldierSkills.map((skill) => (
            <Col key={skill.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{skill.name}</Card.Title>
                  <Card.Text>{skill.description}</Card.Text>
                  <Card.Text>
                    <strong>Skill:</strong> {skill.skill.name}
                  </Card.Text>
                  <Card.Text>
                    <strong>Rank:</strong> {skill.user.rank}
                  </Card.Text>
                  <Card.Text>
                    <strong>User:</strong> {skill.user.firstname} {skill.user.lastname}
                  </Card.Text>
                  <Card.Img
                    variant="top"
                    src={skill.user.image || 'default-image-url'}
                    alt="User Image"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SoldierSkillsList;
