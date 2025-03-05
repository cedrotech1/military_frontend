import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Alert, Pagination, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        role: "user",
        gender: "",
        address: "",
        departmentId: "",
        rank: "",
        armyid: "",
        joindate: "",
        batarianId: "",
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [batarians, setBatarians] = useState([]);
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
                    (user) => user.role === "user" || user.role === "Commander-Officer"
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

    useEffect(() => {
        fetchBatarians();
      }, []);
    
      const fetchBatarians = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/batarian/`, {
            method: "GET",
            headers: {
              "Accept": "*/*",
              "Authorization": `Bearer ${token}`
            },
          });
          const data = await response.json();
          if (data.success) {
            setBatarians(data.data);
          } else {
            console.error("Failed to fetch batarians:", data.message);
          }
        } catch (error) {
          console.error("Error fetching batarians:", error);
        }
      };
    
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Check if all required fields are filled
        // if (!formData.firstname || !formData.lastname || !formData.email || !formData.gender || !formData.departmentId || !formData.role) {
        //     setError("Please fill in all required fields!");
        //     return;
        // }

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
               
                toast.success('User saved successfully!');
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
                
                setFormData({
                    firstname: "",
                    lastname: "",
                    email: "",
                    phone: "",
                    role: "",
                    gender: "",
                    address: "",
                    departmentId: "",
                    rank: "",
                    armyid: "",
                    joindate: "",
                    status: "",
                });
                setEditingUserId(null);
            })
            .catch((err) =>  toast.error(err.response?.data?.message || err.message)); 
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
                    toast.success("User deleted successfully!");
                })
                .catch((err) =>  toast.error(err.response?.data?.message || err.message));
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
                {editingUserId ? "Edit Soldiers" : "Add Soldiers"}
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
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Role</option>
                              
                                <option value="user">Soldier</option>
                                <option value="Commander-Officer">Commander-Officer</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

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


                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Department</Form.Label>
                            <Form.Select
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Rank</Form.Label>
                            <Form.Control
                                type="text"
                                name="rank"
                                value={formData.rank}
                                onChange={handleChange}
                                placeholder="Rank"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Army ID </Form.Label>
                            <Form.Control
                                type="text"
                                name="armyid"
                                value={formData.armyid}
                                onChange={handleChange}
                                placeholder="Army ID"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>{formData?.joindate ? (
                            <span>Join Date was: {new Date(formData.joindate).toLocaleDateString()}</span>
                            ) : (
                            <p>Join date</p> // You can adjust this to show whatever you need when no date is available
                            )}
                            </Form.Label>
                            <Form.Control
                                type="date"
                                name="joindate"
                                value={formData.joindate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="On Leave">On Leave</option>
                            <option value="On sick">sick</option>
                        </Form.Select>
                    </Form.Group>
                   
                </Col>
                <Col md={6}>
                        <Form.Group>
                            <Form.Label>Batarian</Form.Label>
                            <Form.Select
                                name="batarianId"
                                value={formData.batarianId}
                                onChange={handleChange}
                                required
                            >
                               {batarians.map((batarian) => (
                                    <option key={batarian.id} value={batarian.id}>
                                    {batarian.name} - {batarian.department.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" className="mt-2">
                    {editingUserId ? "Update Soldier" : "Add Soldier"}
                </Button>
                 <div className="d-flex justify-content-end" style={{ marginBottom: '0.5cm' }}>
                            <Button    onClick={handleClick} style={{ border: '1px solid green', backgroundColor: 'white', color: 'green', margin: '0.1cm' }}>upload file</Button> 
                           
                            </div>
            </Form>

            <h2 className="text-center mb-4" style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px", margin: '0.4cm' }}>
                List of Soldiers
            </h2>
            <Table striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.firstname} {user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role ='user'? 'soldier':'Officer'}</td>
                            <td>{user.status}</td>
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
                {[...Array(Math.ceil(users.length / usersPerPage))].map((_, i) => (
                    <Pagination.Item key={i} onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
                   <ToastContainer />
        </div>
    );
};

export default UsersPage;
