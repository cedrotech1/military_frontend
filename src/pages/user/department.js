import { useState, useEffect } from "react";
import { Card, Spinner, Alert, Container, Row, Col, Image, Button, Modal } from "react-bootstrap";

const DepartmentCard = () => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const TOKEN = localStorage.getItem("token");

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/department/user`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch department details");
        }

        const data = await response.json();
        setDepartment(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" variant="primary" size="sm" />
      </div>
    );

  if (error) return <Alert variant="danger" className="p-2 text-center">{error}</Alert>;

  const handleShowMembers = () => setShowMembers(true);
  const handleCloseMembers = () => setShowMembers(false);

  const renderMemberList = () => {
    return department.members.map((member) => (
      <Row key={member.id} className="mb-2">
        <Col xs={6}>
          <strong>{member.firstname} {member.lastname}</strong>
        </Col>
        <Col xs={6}>
          <p className="small text-muted">{member.role}</p>
        </Col>
      </Row>
    ));
  };

  return (
    <Container className="mt-2 mb-5">
      <Card className="shadow-sm p-2" style={{ maxWidth: "500px", marginLeft: "0", fontSize: "14px" }}>
        <Card.Body className="text-start">
          <h5 className="mb-1">Department Information</h5>
          <h5 className="text-primary mb-1">{department.name}</h5>
          <p className="text-muted small">{department.description}</p>
          <hr />

          <Row className="align-items-center">
            <Col xs={4}>
              <Image
                src={department.reader.image || "/assets/img/images (3).png"}
                roundedCircle
                fluid
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </Col>
            <Col xs={8} className="text-start">
              <h5 className="mb-1">Department Leader Information</h5>
              <p><strong>Name:</strong> {department.reader.firstname} {department.reader.lastname}</p>
              <p><strong>Email:</strong> {department.reader.email}</p>
              <p><strong>Phone:</strong> {department.reader.phone}</p>
              <p><strong>Gender:</strong> {department.reader.gender}</p>
              <p><strong>Role:</strong> {department.reader.role}</p>
            </Col>
          </Row>

          <hr />

          <h5 className="mb-1">Department Members</h5>
          <p><strong>Total Members:</strong> {department.members.length}</p>
          <Button variant="primary" onClick={handleShowMembers}>View All Members</Button>

        </Card.Body>
      </Card>

      {/* Modal for Member List */}
      <Modal show={showMembers} onHide={handleCloseMembers}>
        <Modal.Header closeButton>
          <Modal.Title>Department Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderMemberList()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMembers}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DepartmentCard;
