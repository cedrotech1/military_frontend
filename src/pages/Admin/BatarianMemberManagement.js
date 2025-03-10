import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import { FaSearch, FaSort } from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const UsersTable = () => {
  const { batarianId } = useParams();
  const [batarian, setBatarian] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Users Data:", data); // Debugging
        if (data.success) {
          const filtered = data.users.filter(
            (user) => user.batarianId === batarianId && user.role=='user'
          );
          console.log("Filtered Users:", filtered); // Debugging
          setUsers(filtered);
          setFilteredUsers(filtered);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [batarianId]);
  
useEffect(() => {
  if (!batarianId || !token) return; // Ensure valid values

  fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/batarian/one/${batarianId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched Batarian Data:", data); // Debugging
      if (data.success) {
        setBatarian(data.batarian);
      } else {
        console.error("Failed to fetch batarian details:", data.message);
      }
    })
    .catch((error) => console.error("Error fetching batarian:", error));
}, [batarianId, token]);

  // Search Filter
  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(search.toLowerCase()) ||
        user.lastname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.hasappoitment.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [search, users]);

  // Sorting Function
  const handleSort = (field) => {
    setSortBy(field);
    const sortedUsers = [...filteredUsers].sort((a, b) =>
      a[field].toString().localeCompare(b[field].toString())
    );
    setFilteredUsers(sortedUsers);
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container mt-4">
      {/* Batarian Details Card */}
      {batarian ? (
  <Row className="mb-4">
    <Col md={4}> {/* Set column width to col-4 */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title className="text-primary">Batarian Details</Card.Title>
          <Card.Text>
            <strong>ID:</strong> {batarian.id} <br />
            <strong>Name:</strong> {batarian.name} <br />
            <strong>Department:</strong> {batarian.department?.name || "N/A"} <br />
            <strong>Created:</strong> {new Date(batarian.createdAt).toLocaleString()} <br />
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>
) : (
  <p className="text-center text-muted">Loading Batarian details...</p>
)}


      {/* Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary">
          <FaSearch />
        </Button>
      </InputGroup>

      {/* Users Table */}
      <Table striped bordered hover responsive className="shadow">
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => handleSort("firstname")} style={{ cursor: "pointer" }}>
              Name <FaSort />
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
              Role <FaSort />
            </th>
            <th>Has appoitment</th>
            {/* <th>Reson</th> */}

          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>

                <td>
                <td>
  {user.role === 'user' ? (
    <span className="badge bg-info">Soldier</span>
  ) : (
    <span className="badge bg-info">{user.role}</span>
  )}
</td>

                </td>
                <td>
  {user?.hasappoitment === 'yes' && (!user.appointments || user.appointments.length === 0) ? (
    <span className="badge bg-warning">Not yet appointed</span>
  ) : user.appointments && user.appointments.length > 0 ? (
    <span className="badge bg-success">Yes</span>
  ) : (
    <span className="badge bg-danger">{user?.hasappoitment}</span>
  )}
</td>

{/* <td>{user.hasappoitment}</td> */}

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map((num) => (
          <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
            {num + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage)))}
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
        />
      </Pagination>
    </div>
  );
};

export default UsersTable;
