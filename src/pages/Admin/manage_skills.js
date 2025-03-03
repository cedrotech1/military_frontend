import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal, Container, ToastContainer, Toast } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/skills`;

const TOKEN = `Bearer ${localStorage.getItem('token')}`;

const SkillsCRUD = () => {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: TOKEN },
      });
      setSkills(response.data.data);
    } catch (error) {
      showToast("Failed to fetch skills.");
    }
  };

  const handleAddOrEdit = async () => {
    try {
      if (editId) {
        await axios.put(`${API_URL}/update/${editId}`, { name: skillName }, { headers: { Authorization: TOKEN } });
        showToast("Skill updated successfully.");
      } else {
        await axios.post(`${API_URL}/add`, { name: skillName }, { headers: { Authorization: TOKEN } });
        showToast("Skill added successfully.");
      }
      fetchSkills();
      setShow(false);
      setSkillName("");
      setEditId(null);
    } catch (error) {
      showToast("Error saving skill.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, { headers: { Authorization: TOKEN } });
      showToast("Skill deleted successfully.");
      fetchSkills();
    } catch (error) {
      showToast("Error deleting skill.");
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center" style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px",margin:'0.4cm' }}>Skills Management</h2>
      <Button variant="primary" onClick={() => setShow(true)} className="mb-3">
        <FaPlus /> Add Skill
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Skill Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill, index) => (
            <tr key={skill.id}>
              <td>{index + 1}</td>
              <td>{skill.name}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => { setSkillName(skill.name); setEditId(skill.id); setShow(true); }}>
                  <FaEdit />
                </Button>
                <Button variant="danger" onClick={() => handleDelete(skill.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Skill" : "Add Skill"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Skill Name</Form.Label>
              <Form.Control type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        {toastMessage && (
          <Toast show={true} bg="success" onClose={() => setToastMessage("")}> 
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </Container>
  );
};

export default SkillsCRUD;