import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination, Card } from 'react-bootstrap';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentsPage = () => {
    const [users, setUsers] = useState([]);
    const [missions, setMissions] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedMission, setSelectedMission] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const itemsPerPage = 4;
    const token = localStorage.getItem("token");


    useEffect(() => {
        fetchUsers();
        fetchMissions();
        fetchAppointments();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/formission`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await response.json();
            setUsers(data.users || []);

        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const fetchMissions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/mission`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();

            // Ensure data.data exists and filter out inactive missions
            const activeMissions = (data.data || []).filter(mission => mission.status !== "inactive");

            setMissions(activeMissions);
        } catch (error) {
            console.error('Error fetching missions:', error);
            setMissions([]);
        }
    };


    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/appoitment/`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await response.json();
            setAppointments(data.data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments([]);
        }
    };

    const handleAssign = async () => {
        if (!selectedUser || !selectedMission) return;
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/appoitment/add`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ userID: selectedUser, missionID: selectedMission })
            });
            const newAppointment = await response.json();
            if (response.ok) {
                setAppointments([...appointments, newAppointment]);
                setShowAssignModal(false);
                toast.success(newAppointment.message);
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // Reload after 2 seconds   
            } else {
                toast.error(newAppointment.message);
            }
        } catch (error) {
            console.error('Error assigning mission:', error);
            // toast.error(error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.user?.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.mission?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [selectedStatus, setSelectedStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);

    const handleUpdateStatus = async (appointmentId) => {
        if (!selectedStatus) {
            alert("Please select a status.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/appoitment/change/${appointmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: selectedStatus }),
            });
            const data = await response.json();
            if (response.ok) {
                // alert("Appointment status updated successfully!");
                setShowAssignModal(false);
                toast.success(data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating appointment:", error);
            toast.error(error);
            alert("An error occurred. Please try again.");
        }

        setLoading(false);
    };

    const handleDelete = async (appointmentId) => {


        setLoading1(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/appoitment/delete/${appointmentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                const errorData = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("An error occurred. Please try again.");
        }

        setLoading1(false);
    };

    return (
        <div className="container member mt-4">
            <h2 className="text-center mb-4" style={{ backgroundColor: 'lightgreen', padding: '0.3cm', color: 'black', borderRadius: '6px' }}>Manage Appoitments</h2>

            <div className="d-flex justify-content-end" style={{ marginBottom: '0.5cm' }}>
                <Button onClick={() => setShowAssignModal(true)} style={{ border: '1px solid green', backgroundColor: 'white', color: 'green', margonTop: '-1cm' }}>Assign mission to user</Button>
            </div>

            <Form.Control style={{ backgroundColor: 'whitesmoke', padding: '0.3cm', color: 'black', borderRadius: '6px' }} type="text" placeholder="Search..." onChange={handleSearch} className="mb-3" />

            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Mission</th>
                        <th>Status</th>
                        {/* <th>Assigned By</th> */}
                        {/* <th>Date</th> */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment, index) => (
                            <tr key={appointment.id}>
                                <td>{index + 1}</td>
                                <td>{appointment.user?.firstname} {appointment.user?.lastname}</td>
                                <td>{appointment.mission?.name}</td>
                                <td>{appointment.status}</td>
                                {/* <td>{appointment.assigner?.firstname} {appointment.assigner?.lastname}</td> */}
                                {/* <td>{new Date(appointment.createdAt).toLocaleDateString()}</td> */}
                                <td><Button style={{ border: '1px solid green', backgroundColor: 'white', color: 'green', margonTop: '-1cm' }} onClick={() => { setSelectedAppointment(appointment); setShowModal(true); }}>View</Button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No appointments assigned yet.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination>
                {[...Array(Math.ceil(filteredAppointments.length / itemsPerPage)).keys()].map(number => (
                    <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select User</Form.Label>
                            <Form.Control as="select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.firstname} {user.lastname}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select Mission</Form.Label>
                            <Form.Control as="select" value={selectedMission} required onChange={e => setSelectedMission(e.target.value)}>
                                <option disabled value="">Select Mission</option>
                                {missions.map(mission => (
                                    <option key={mission.id} value={mission.id}>{mission.name} ({mission.status})</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button onClick={handleAssign} className="mt-3">Assign</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && (
                        <>
                            {/* User Info Card */}
                            <Card className="mb-3 shadow-sm">
                                <Card.Body>
                                    <Card.Title>User Information</Card.Title>
                                    <Card.Text><strong>Name:</strong> {selectedAppointment.user?.firstname} {selectedAppointment.user?.lastname}</Card.Text>
                                    <Card.Text><strong>Email:</strong> {selectedAppointment.user?.email}</Card.Text>
                                    <Card.Text><strong>Phone:</strong> {selectedAppointment.user?.phone}</Card.Text>
                                </Card.Body>
                            </Card>

                            {/* Mission Info Card */}
                            <Card className="mb-3 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Mission Details</Card.Title>
                                    <Card.Text><strong>Mission:</strong> {selectedAppointment.mission?.name}</Card.Text>
                                    <Card.Text><strong>Description:</strong> {selectedAppointment.mission?.description}</Card.Text>
                                    <Card.Text><strong>Start from:</strong> {new Date(selectedAppointment.mission.start_date).toLocaleDateString()} <strong>to</strong>{new Date(selectedAppointment.mission.end_date).toLocaleDateString()}</Card.Text>

                                    <Card.Text><strong>Status:</strong>
                                        <span className={`badge ${selectedAppointment.status === 'active' ? 'bg-success' :
                                            selectedAppointment.status === 'inactive' ? 'bg-danger' :
                                                selectedAppointment.status === 'ongoing' ? 'bg-warning' : 'bg-secondary'}`}>
                                            {selectedAppointment.status}
                                        </span>
                                    </Card.Text>


                                </Card.Body>
                            </Card>

                            {/* Assigner Info Card */}
                            <Card className="mb-3 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Assigned By</Card.Title>
                                    <Card.Text><strong>Name:</strong> {selectedAppointment.assigner?.firstname} {selectedAppointment.assigner?.lastname}</Card.Text>
                                    <Card.Text><strong>Email:</strong> {selectedAppointment.assigner?.email}</Card.Text>
                                    <Card.Text><strong>Phone:</strong> {selectedAppointment.assigner?.phone}</Card.Text>
                                    <Card.Text><strong>Date Assigned:</strong> {new Date(selectedAppointment.createdAt).toLocaleDateString()}</Card.Text>
                                </Card.Body>
                            </Card>

                            {/* Status Update Form */}
                            <Card className="mb-3 shadow-sm">
                                <Card.Body>
                                    <Card.Title>Update Appointment Status</Card.Title>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control as="select" value={selectedStatus} style={{ backgroundColor: 'whitesmoke' }} onChange={(e) => setSelectedStatus(e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value="inactive">Disactivate</option>
                                                <option value="active">Active</option>
                                                <option value="ongoing">Ongoing</option>
                                                <option value="closed">Closed (Completed)</option>
                                            </Form.Control>
                                        </Form.Group>

                                        <div className="d-flex justify-content-between mt-3">
                                            <Button style={{ border: '1px solid green', backgroundColor: 'white', color: 'green', margonTop: '-1cm' }} onClick={() => handleUpdateStatus(selectedAppointment.id)} className="btn" disabled={loading}>
                                                {loading ? "Updating..." : "Update Status"}
                                            </Button>
                                            <Button style={{ border: '1px solid red', backgroundColor: 'white', color: 'red', margonTop: '-1cm' }} onClick={() => handleDelete(selectedAppointment.id)} className="btn btn-danger" disabled={loading1}>
                                                {loading1 ? "Deleting..." : "Delete"}
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default AppointmentsPage; 