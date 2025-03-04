import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Alert, Pagination, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        role: "admin",
        gender: "",
        address: "",
        armyid: Math.random().toString(36).substring(2, 8),  // Generate a string armyid
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                // Filter users based on role
                const filteredUsers = res.data.users.filter(
                    (user) => user.role === "admin" 
                );
                setUsers(filteredUsers);
            })
            .catch((err) => setError("Error fetching users: " + err.response?.data?.message || err.message));
    
        axios
            .get(`${process.env.REACT_APP_BASE_URL}/api/v1/department/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setDepartments(res.data))
            .catch((err) => setError("Error fetching departments: " + err.response?.data?.message || err.message));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateArmyId = () => {
        const randomId = Math.random().toString(36).substring(2, 8);  // Generate string armyid
        setFormData(prevState => ({
            ...prevState,
            armyid: randomId
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Check if all required fields are filled
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.gender || !formData.role) {
            setError("Please fill in all required fields!");
            return;
        }

        const url = editingUserId
            ? `${process.env.REACT_APP_BASE_URL}/api/v1/users/update/${editingUserId}`
            : `${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`;

        const method = editingUserId ? "put" : "post";

        axios({
            method,
            url,
            data: formData,
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setUsers((prevUsers) =>
                    editingUserId
                        ? prevUsers.map((user) => (user.id === editingUserId ? res.data.user : user))
                        : [...prevUsers, res.data.user]
                );
                setSuccess("User saved successfully!");
                setFormData({
                    firstname: "",
                    lastname: "",
                    email: "",
                    phone: "",
                    role: "admin",
                    gender: "",
                    address: "",
                    armyid: Math.random().toString(36).substring(2, 8),  // Generate new string armyid
                });
                setEditingUserId(null);
            })
            .catch((err) => setError("Error saving user: " + err.response?.data?.message || err.message));
    };

    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setFormData({ ...user });
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axios
                .delete(`${process.env.REACT_APP_BASE_URL}/api/v1/users/delete/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    setUsers(users.filter((user) => user.id !== userId));
                    setSuccess("User deleted successfully!");
                })
                .catch((err) => setError("Error deleting user: " + err.response?.data?.message || err.message));
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handleViewProfile = (id) => { navigate(`../other_user-profile/${id}`); }

    const handleClick = () => {
        navigate('/upload');
    };

    return (
        <div className="member" style={{ marginTop: '1cm' }}>

            <h2 style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px", margin: '0.4cm' }}>
                {editingUserId ? "Edit User" : "Add User"}
            </h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" className="mt-2">
                    {editingUserId ? "Update User" : "Add User"}
                </Button>
                <div className="d-flex justify-content-end" style={{ marginBottom: '0.5cm' }}>
                    <Button onClick={handleClick} style={{ border: '1px solid green', backgroundColor: 'white', color: 'green', margin: '0.1cm' }}>Upload File</Button>
                </div>
            </Form>

            <h2 className="text-center mb-4" style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px", margin: '0.4cm' }}>
                List of users
            </h2>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        {/* <th>Role</th> */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.firstname} {user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            {/* <td>{user.role}</td> */}
                            <td>
                                <Button
                                    style={{ border: "1px solid orange", backgroundColor: "white", color: "orange", margin: '2px' }}
                                    onClick={() => handleEdit(user)} variant="warning" className="mr-2"
                                >
                                    Edit
                                </Button>
                                <Button
                                    style={{ border: "1px solid red", backgroundColor: "white", color: "green", margin: '2px' }}
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </Button>
                                <Button
                                    style={{ border: "1px solid green", backgroundColor: "white", color: "green", margin: '2px' }}
                                    onClick={() => handleViewProfile(user.id)}
                                >
                                    View Skills
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {[...Array(Math.ceil(users.length / usersPerPage))].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};


export default UsersPage;
