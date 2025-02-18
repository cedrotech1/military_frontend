import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
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
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const fetchMissions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/mission`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await response.json();
            setMissions(data.data || []);
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
        <div className="container mt-4">
            <h2>Manage Appointments</h2>
            <Button onClick={() => setShowAssignModal(true)} className="mb-3">Assign</Button>
            <Form.Control type="text" placeholder="Search..." onChange={handleSearch} className="mb-3" />

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
                                <td><Button onClick={() => { setSelectedAppointment(appointment); setShowModal(true); }}>View</Button></td>
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
                            <Form.Control as="select" value={selectedMission} onChange={e => setSelectedMission(e.target.value)}>
                                <option value="">Select Mission</option>
                                {missions.map(mission => (
                                    <option key={mission.id} value={mission.id}>{mission.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button onClick={handleAssign} className="mt-3">Assign</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && (<>
                        <div>
                            <p><strong>User:</strong> {selectedAppointment.user?.firstname} {selectedAppointment.user?.lastname}</p>
                            <p><strong>Email:</strong> {selectedAppointment.user?.email}</p>
                            <p><strong>Phone:</strong> {selectedAppointment.user?.phone}</p>
                            <p><strong>Mission:</strong> {selectedAppointment.mission?.name}</p>
                            <p><strong>Mission Description:</strong> {selectedAppointment.mission?.description}</p>
                            <p><strong>Status:</strong> {selectedAppointment.status}</p>
                            <p><strong>Assigned By:</strong> {selectedAppointment.assigner?.firstname} {selectedAppointment.assigner?.lastname}</p>
                            <p><strong>Assigner Email:</strong> {selectedAppointment.assigner?.email}</p>
                            <p><strong>Assigner Phone:</strong> {selectedAppointment.assigner?.phone}</p>
                            <p><strong>Date Assigned:</strong> {new Date(selectedAppointment.createdAt).toLocaleDateString()}</p>

                        </div>
                        <Form>
                            <Form.Group>
                                <Form.Label>Update Appointment Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="inactive">Disactivate</option>
                                    <option value="active">Active</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="closed">closed(completed)</option>
                                </Form.Control>
                            </Form.Group>
                            <Button onClick={() => handleUpdateStatus(selectedAppointment.id)} className="mt-3" disabled={loading}>
                                {loading ? "Updating..." : "Update Status"}
                            </Button>
                            <Button onClick={() => handleDelete(selectedAppointment.id)} className="mt-3 btn btn-danger" disabled={loading}>
                                {loading1 ? "deleting ..." : "Delete"}
                            </Button>

                        </Form>
                    </>)}
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default AppointmentsPage; 