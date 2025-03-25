import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Alert, Card } from 'react-bootstrap';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadSummary, setUploadSummary] = useState(null);

  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Invalid file type. Please select an Excel file (.xls or .xlsx).');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a valid Excel file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', file.name);

    const token = localStorage.getItem("token");
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadSummary(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/users/upload-excel`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setLoading(false);
      setSuccess('File uploaded successfully!');
      setUploadedFiles([...uploadedFiles, file.name]);
      setFile(null);
      document.getElementById('fileUpload').value = '';

      // Save API response in state
      setUploadSummary(response.data);
    } catch (error) {
      setLoading(false);
      setError('Failed to upload file. Please try again.');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h2
            className="text-center mb-4"
            style={{
              backgroundColor: 'lightgreen',
              color: 'green',
              padding: '12px',
              borderRadius: '8px',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            Upload an Excel File
          </h2>

          <Form>
            <Form.Group controlId="fileUpload">
              <Form.Label>Select a file</Form.Label>
              <Form.Control
                type="file"
                accept=".xls, .xlsx"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Button
              variant="success"
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-100 mt-3"
              style={{
                border: '1px solid green',
                backgroundColor: 'lightgreen',
                color: 'green',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Form>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}

          {/* Summary Card */}
          {uploadSummary && (
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <Card.Title className="text-success">Upload Summary</Card.Title>
                <Card.Text>
                  <strong>Total Users Created:</strong> {uploadSummary.createdUsers.length}
                </Card.Text>
                <Card.Text>
                  <strong>Duplicate Users:</strong> {uploadSummary.duplicateUsers || "No duplicates found"}
                </Card.Text>
                
                {uploadSummary.createdUsers.length > 0 && (
                  <>
                    <Card.Subtitle className="mt-3">Created Users:</Card.Subtitle>
                    <ul>
                      {uploadSummary.createdUsers.map((user, index) => (
                        <li key={index}>
                          <strong>{user.firstname} {user.lastname}</strong> - {user.email} ({user.role})
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FileUpload;
  
  