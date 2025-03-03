import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button, Image, Table, Pagination } from 'react-bootstrap';

const DepartmentDetails = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(5); // Adjust the number of members per page
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/department/one/${id}`, {
          method: "GET",
          headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.success) {
          setDepartment(result.data);
        } else {
          console.error("Failed to fetch department:", result.message);
        }
      } catch (error) {
        console.error("Error fetching department:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = department ? department.members.slice(indexOfFirstMember, indexOfLastMember) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!department) return <p className="text-center text-danger">Department not found!</p>;

  return (
    <Container className="mt-2 mb-5">
      <Card className="shadow-sm p-2" style={{ maxWidth: "500px", marginLeft: "0", fontSize: "14px" }}>
        <Card.Body className="text-start">
          <h5 className="mb-1"> <u>Department Information</u></h5>
          <br />
          <h5 className="mb-1">Department Code ({department.id})</h5>
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
          <Button variant="primary" onClick={() => navigate("/department")}>Back</Button>
        </Card.Body>
      </Card>

      <Card className="mt-4 shadow-sm p-3">
        <Card.Body>
          <h5 className="mb-3">Members List</h5>
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.firstname} {member.lastname}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>{member.phone}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <Pagination>
            {Array.from({ length: Math.ceil(department.members.length / membersPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DepartmentDetails;
