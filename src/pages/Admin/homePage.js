
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Offcanvas, Button, Nav } from 'react-bootstrap';
import { BiEnvelope, BiPhone, BiMap } from 'react-icons/bi'; // Importing icons from the 'react-icons' library
import '../../css/main2.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/loading'; // Import the LoadingSpinner component
import { formatDistanceToNow } from "date-fns";
import axios from "axios";


import Menu from "../../components/MenuDeskTop";

import Statistics from "../../components/statistics-component";
import Menu2 from "../../components/MenuMobile";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const handleToggleModal = () => { setShowModal(!showModal); };
  const handleCloseModal = () => { setShowModal(false); };
  const handleShowDetailModal = () => { setShowDetailModal(true); };
  const handleCloseDetailModal = () => { setShowDetailModal(false); };
  const [showModal1, setShowModal1] = useState(false);
  const handleToggleModal1 = () => { setShowModal1(!showModal1); };
  const handleCloseModal1 = () => { setShowModal1(false); };
  const [EmployeesAdmin, setEmployeesAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [selectedUser, setSelectedUser] = useState([]);
  const [ID, setID] = useState();
  const [rest, SetResto] = useState('');
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/department/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data.data);
    } catch (error) {
      toast.error("Error fetching departments");
      console.error(error);
    }
  };
  console.log(departments)


  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const resto = parsedUser.restaurents;
      // setObj(parsedUser)
      SetResto(resto)
    } else {
      console.error('User information not found in local storage');
    }
  }, []);
  useEffect(() => {
    const fetchEmployeesAdmin = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          const usersArray = Array.isArray(data.users) ? data.users : [];
          // const filteredUsers = usersArray.filter(user => (user.role === 'employee' || user.role !== 'EmployeeAdmin'));
          setEmployeesAdmin(usersArray);
          console.log(data.users);
        } else {
          console.error('Failed to fetch EmployeesAdmin:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching EmployeesAdmin:', error);
        setLoading(false);
      }
    };

    fetchEmployeesAdmin();
  }, []);


  const handleView = (userId) => {
    setID(userId);
    const userToView = EmployeesAdmin.find(user => user.id === userId);
    setSelectedUser(userToView);
    // handleShowDetailModal();
  };


  const handleModify = (userId) => {
    const userToUpdate = EmployeesAdmin.find(user => user.id === userId);
    setSelectedUser(userToUpdate);

    console.log(`Modify user with ID: ${userId}`);
  };
  const handleDeactivate = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/deactivate/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay time as needed

        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error(`Failed to activate user with ID ${userId}:`, errorData.message);
      }
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this user?");
      if (!isConfirmed) {
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay time as needed

        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete user with ID ${userId}:`, errorData.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleActivate = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/activate/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay time as needed

        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error(`Failed to activate user with ID ${userId}:`, errorData.message);
      }
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };
  const renderActivationButton = (userId, userStatus) => {
    const buttonStyle = {
      backgroundColor: 'white',
      border: '0px',
      color: 'gray'
    };

    if (userStatus === 'active') {
      return (
        <button onClick={() => handleDeactivate(userId)} style={buttonStyle}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      );
    } else if (userStatus === 'inactive') {
      return (
        <button onClick={() => handleActivate(userId)} style={buttonStyle}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      );
    } else {
      return null;
    }
  };


  {
    Array.isArray(EmployeesAdmin) && EmployeesAdmin.length > 0 ? (
      EmployeesAdmin.map((user, index) => (
        <tr key={user.id}>
          <th scope="row">{index + 1}</th>
          <td>{user.firstname} {user.lastname}</td>
          <td>{user.email}</td>
          <td>{user.phone}</td>
          <td>{user.status}</td>
          <td>
            <button onClick={() => handleView(user.id)} style={{ backgroundColor: 'white', border: '0px' }}>
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button onClick={() => handleModify(user.id)} style={{ backgroundColor: 'white', border: '0px' }}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            {renderActivationButton(user.id, user.status)}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6">No data available</td>
      </tr>
    )
  }
  // ...




  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: 'Male',
    role: 'user',
    address: '',
    password: '',
    confirmPassword: '',
    departmentId: '',
    rank: "",
    armyid: "",
    joindate: ""

  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.departmentId) {
      setError("Department is required.");
      toast.error("Please select a department.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          status: 'active',
        }),
      });

      if (response.ok) {
        const res = await response.json();

        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.reload();
        // navigate('./login');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error creating account', error);
      setError('Failed to create account. Please try again later.');
    }
    finally {
      setLoading(false); // Set loading to false when request is complete
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setError(null);
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    console.log(selectedUser.id)
    console.log(ID)
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/update/${ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...selectedUser }),
      });
      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error creating account', error);
      setError('Failed to create account. Please try again later.');
    }
  };

  // handlefilter
  const [value, setFilterValue] = useState('');
  const handleFilter = (e) => {
    setFilterValue(e.target.value);
    setError(null);
  };
  useEffect(() => {
    const fetchEmployeesAdmin = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          const usersArray = Array.isArray(data.users) ? data.users : [];
          const filteredUsers = usersArray.filter(user =>
            (user.firstname.toLowerCase().includes(value.toLowerCase()) ||
              user.lastname.toLowerCase().includes(value.toLowerCase()) ||
              user.email.toLowerCase().includes(value.toLowerCase()) ||
              user.role.toLowerCase().includes(value.toLowerCase()) ||
              user.gender.toLowerCase().includes(value.toLowerCase()) ||
              user.address.toLowerCase().includes(value.toLowerCase()) ||
              user.phone.toLowerCase().includes(value.toLowerCase())) &&
            user.role !== ''
          );
          setEmployeesAdmin(filteredUsers);
        } else {
          console.error('Failed to fetch EmployeesAdmin:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching EmployeesAdmin:', error);
        setLoading(false);
      }
    };

    fetchEmployeesAdmin();
  }, [value]);

  const handleViewProfile = (id) => { navigate(`../other_user-profile/${id}`); }
  const handleViewUpload = () => { navigate(`../upload`); }

  const handleDepartmentChange = (e) => {
    const newDepartmentId = e.target.value;

    console.log("Department ID changed to:", newDepartmentId); // Log the departmentId change

    setFormData({
      ...formData,
      departmentId: newDepartmentId,
    });
  };


  return (
    <body className='mybody'>
      <div className="dashboard" style={{ backgroundColor: 'whitesmoke' }}>
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar (visible on medium devices and larger) */}
            <div className={`col-md-3 d-none d-md-block ${show ? 'sidebar-shift' : ''}`}>
              <Offcanvas show={show} onHide={() => setShow(false)} placement="start">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                  {/* <center> */}
                  <Menu2 />

                  {/* </center> */}
                </Offcanvas.Body>
              </Offcanvas>
            </div>

            {/* Main Content */}
            <main className="col-md-12 ms-sm-auto col-lg-12 px-md-4 allcontent">
              <div className="row">
                {!show && (
                  <div className="col-md-2 d-none d-md-block d-md-blockx" >
                    <Menu />
                  </div>
                )}       <div className="col-12 d-md-none" style={{ marginTop: '1cm' }}>
                  <Button variant="" onClick={() => setShow(!show)}>
                    ☰
                  </Button>
                </div>

                {loading ? <> <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '3cm', // Use 100% of the viewport height
                }}>
                  <div>
                    <LoadingSpinner />
                  </div>
                </div></> : <>



                  <div className={`col-md-10 ${show ? 'content-shift' : ''}`}>

                    <section id="team" className="team teamb" >
                      <div className="container" data-aos="fade-up" style={{ marginLeft: '-0.2cm' }}>

                        <div className="row">
                          <Statistics />
                        </div>
                      </div>
                    </section>

                    <div className="row" style={{ backgroundColor: 'whitesmoke' }}>
                      <div className="col-xl-3 col-md-3" style={{ padding: '0.4cm' }}>
                        <input
                          placeholder='Filter here...'
                          variant=""
                          onChange={handleFilter}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            fontFamily: 'monospace',
                            textDecoration: 'none',
                            padding: '0.2cm',
                            width: '7cm',
                            marginTop: '0cm',
                            marginLeft: '0.3cm',
                            // marginBottom: '1cm',
                            // color: 'black',
                            height: 'auto',
                            // width: '6cm',
                            border: '1px solid lightgreen',
                            outline: 'none',

                          }}
                        />
                      </div>
       
                      <div className="col-xl-3 col-md-3" style={{ paddingRight: '0.4cm' }}>
                        <h4 style={{ textAlign: 'justify', paddingBottom: '0cm', color: 'gray', paddingLeft: '0.4cm' }}>LIST OF USERS </h4>

                      </div>
                  

                      <div className="col-xl-4 col-md-4" style={{ padding: '0.4cm' }}>
                        <div style={{ textAlign: 'right', marginBottom: '0.4cm' }}>
                          <Button
                            variant=""
                            onClick={() => handleViewUpload()}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '6px',
                              fontFamily: 'monospace',
                              textDecoration: 'none',
                              padding: '0.2cm',
                              width: '4cm',

                              // marginTop: '-2cm',
                              marginRight: '0.3cm',
                              color: 'black',
                              height: 'auto',
                              border: '2px solid lightgreen',


                            }}
                          >
                            Upload Users
                          </Button>
                        </div>
                      </div>

                      <div className="col-xl-2 col-md-2" style={{ padding: '0.4cm' }}>
                        <div style={{ textAlign: 'right', marginBottom: '0.4cm' }}>
                          <Button
                            variant=""
                            onClick={handleToggleModal}
                            style={{
                              backgroundColor: 'white',
                              borderRadius: '6px',
                              fontFamily: 'monospace',
                              textDecoration: 'none',
                              padding: '0.2cm',
                              width: '4cm',

                              // marginTop: '-2cm',
                              marginRight: '0.3cm',
                              color: 'black',
                              height: 'auto',
                              border: '2px solid lightgreen',


                            }}
                          >
                            Add Users
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Modal show={showModal} onHide={handleCloseModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Add Users</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={handleSubmit} className="myform">
                          <div className="row" style={{ paddingTop: '0cm' }}>
                            <div className="col-md-6 form-group">
                              <span>First Name</span>
                              <input type="text" name="firstname" className="form-control" id="firstname" placeholder="Uwase" onChange={handleChange} />
                            </div>
                            <div className="col-md-6 form-group mt-3 mt-md-0">
                              <span>Last Name</span>
                              <input type="text" className="form-control" name="lastname" id="lastname" placeholder="Mutoni" onChange={handleChange} />
                            </div>
                          </div>

                          <div className="form-group mt-3">
                            <span>Email</span>
                            <input type="text" className="form-control" name="email" id="email" placeholder="mutoniwase@gmail.com" onChange={handleChange} />
                          </div>

                          <div className="form-group mt-3">
                            <span>Phone</span>
                            <input type="text" className="form-control" name="phone" id="phone" placeholder="0784366616" onChange={handleChange} />
                          </div>

                          <div className="row" style={{ paddingTop: '0.3cm' }}>
                            <div className="col-md-6 form-group">
                              <span>Gender</span>
                              <select name="gender" className="form-control" id="gender" onChange={handleChange}>
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="col-md-6 form-group mt-3 mt-md-0">
                              <span>Address</span>
                              <input type="text" className="form-control" name="address" id="address" placeholder="Huye/Ngoma" onChange={handleChange} />
                            </div>
                          </div>

                    
                          <div className="form-group mt-3">
                            <span>Rank</span>
                            <input type="text" className="form-control" required name="rank" id="rank" placeholder="General" onChange={handleChange} />
                          </div>

                          <div className="form-group mt-3">
                            <span>Army ID</span>
                            <input type="text" className="form-control" required name="armyid" id="armyid" placeholder="095454" onChange={handleChange} />
                          </div>



                          <div className="form-group mt-3">
                            <span>join date</span>
                            <input type="date" className="form-control" required name="joindate" id="joindate" onChange={handleChange} />
                          </div>















                          <div className="form-group mt-3">
                            <span>Role</span>
                            <select name="role" className="form-control" id="role" onChange={handleChange}>
                              <option value="" disabled>Select Role</option>
                              <option value="admin">Admin</option>
                              <option value="Commander-Officer">Commander Officer</option>
                              <option value="user">persenel</option>

                            </select>
                          </div>

                          <div className="form-group mt-3">
                            <span>Department</span>
                            <select
                              name="departmentId"
                              onChange={handleDepartmentChange}
                              className="form-control"
                              required
                              id=""
                            >
                              <option value="">Select department</option>
                              {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                  {department.name}
                                </option>
                              ))}
                            </select>
                          </div>



                          <div className="text-center">
                            <button type="submit" style={{ border: '1px solid green', backgroundColor: 'white', color: 'green' }} className={`form-control ${loading ? 'loading' : ''}`} disabled={loading}>
                              {loading ? <LoadingSpinner /> : 'Create Account'}
                            </button>
                          </div>
                        </form>
                      </Modal.Body>
                    </Modal>


                    <Modal
                      className="modal fade bd-example-modal-lg"
                      size="lg"
                      role="dialog"
                      aria-labelledby="myLargeModalLabel"
                      aria-hidden="true"
                      show={showDetailModal}
                      onHide={handleCloseDetailModal}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>User Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {selectedUser && (
                          <section id="team" className="team">
                            <div className="container" data-aos="fade-up">
                              <div className="row">
                                <div className="col-xl-6 col-md-6 d-flex justify-content-center">
                                  <img
                                    src={selectedUser.image ? selectedUser.image : "/assets/img/images (3).png"}
                                    className="img-fluid"
                                    alt="User Profile"
                                    style={{
                                      borderRadius: "10px",
                                      marginBottom: "0.5cm",
                                      // objectFit: selectedUser.image ? "cover" : "",
                                      height: selectedUser.image ? "auto" : "10cm",
                                      width: "100%",
                                      // height: "auto",
                                      opacity: selectedUser.image ? "1" : "0.8",
                                    }}
                                  />


                                </div>
                                <div
                                  className="col-xl-6 col-md-6 p-3"
                                  style={{ backgroundColor: "#f9f9f9", borderRadius: "0.5cm" }}
                                >
                                  <h5 className="">USER IDENTIFICATION</h5>
                                  <p><strong>Name:</strong> {selectedUser.firstname} {selectedUser.lastname}</p>
                                  <p><strong>Email:</strong> {selectedUser.email}</p>
                                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                                  <p><strong>Role:</strong> {selectedUser.role === "user" ? "Personnel (User)" : selectedUser.role}</p>
                                  <p><strong>Status:</strong> <span className={selectedUser.status === "active" ? "text-success" : "text-danger"}>{selectedUser.status}</span></p>
                                  <p><strong>Gender:</strong> {selectedUser.gender}</p>
                                  <p><strong>Location:</strong> {selectedUser.address || "N/A"}</p>

                                  <p><strong>rank:</strong> {selectedUser.rank}</p>
                                  <p><strong>Army ID:</strong> {selectedUser.armyid}</p>
                                  <p><strong>join date:</strong> {new Date(selectedUser.joindate).toLocaleDateString()}</p>


                                  {selectedUser.department && (
                                    <>
                                      <h3 className="mt-4">Department Info</h3>
                                      <div className="card p-3">
                                        <p><strong>Department Name:</strong> {selectedUser.department.name}</p>
                                        <p><strong>Description:</strong> {selectedUser.department.description}</p>
                                        <h5>Department Head</h5>
                                        <p><strong>Name:</strong> {selectedUser.department.reader?.firstname} {selectedUser.department.reader?.lastname}</p>
                                        <p><strong>Email:</strong> {selectedUser.department.reader?.email}</p>
                                        <p><strong>Phone:</strong> {selectedUser.department.reader?.phone}</p>
                                        <p><strong>Role:</strong> {selectedUser.department.reader?.role}</p>
                                      </div>
                                    </>
                                  )}

                                  <div className="text-center mt-3">
                                    <Button
                                      style={{ border: "1px solid green", backgroundColor: "white", color: "green" }}
                                      onClick={() => handleViewProfile(selectedUser.id)}
                                      disabled={loading}
                                    >
                                      {selectedUser.gender === "Male" ? "View His Profile" : "View Her Profile"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        )}
                      </Modal.Body>
                    </Modal>



                    <Modal show={showModal1} onHide={handleCloseModal1}>
                      <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={handleSubmit1} className="myform">
                          <div className="row" style={{ paddingTop: '0cm' }}>
                            <div className="col-md-6 form-group">
                              <span>First Name</span>
                              <input
                                type="text"
                                name="firstname"
                                className="form-control"
                                id="firstname"
                                placeholder="Uwase"
                                value={selectedUser.firstname}
                                onChange={(e) => setSelectedUser({ ...selectedUser, firstname: e.target.value })}
                              />
                            </div>
                            <div className="col-md-6 form-group mt-3 mt-md-0">
                              <span>Last Name</span>
                              <input
                                type="text"
                                className="form-control"
                                name="lastname"
                                id="lastname"
                                placeholder="Mutoni"
                                value={selectedUser.lastname}
                                onChange={(e) => setSelectedUser({ ...selectedUser, lastname: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-group mt-3">
                            <span>Email</span>
                            <input
                              type="text"
                              disabled
                              className="form-control"
                              name="email"
                              id="email"
                              placeholder="umutoni@gmail.com"
                              value={selectedUser.email}
                            />
                          </div>

                          <div className="form-group mt-3">
                            <span>Phone</span>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              id="phone"
                              placeholder="0784366616"
                              value={selectedUser.phone}
                              onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                            />
                          </div>


                          <div className="form-group mt-3">
                            <span>rank</span>
                            <input
                              type="text"
                              className="form-control"
                              name="rank"
                              id="rank"
                               value={selectedUser.rank}
                              onChange={(e) => setSelectedUser({ ...selectedUser, rank: e.target.value })}
                            />
                          </div>

                          <div className="form-group mt-3">
                            <span>Army ID</span>
                            <input
                              type="text"
                              className="form-control"
                              name="armyid"
                              id="armyid"
                               value={selectedUser.armyid}
                              onChange={(e) => setSelectedUser({ ...selectedUser, armyid: e.target.value })}
                            />
                          </div>

                          <div className="form-group mt-3">
                            <span>Army ID</span>
                            <input
                              type="date"
                              className="form-control"
                              name="joindate"
                              id="joindate"
                               value={selectedUser.joindate}
                              onChange={(e) => setSelectedUser({ ...selectedUser, joindate: e.target.value })}
                            />
                          </div>

                          <div className="row" style={{ paddingTop: '0.3cm' }}>
                            <div className="col-md-6 form-group">
                              <span>Gender</span>
                              <select
                                name="gender"
                                className="form-control"
                                id="gender"
                                value={selectedUser.gender}
                                onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="col-md-6 form-group mt-3 mt-md-0">
                              <span>Address</span>
                              <input
                                type="text"
                                className="form-control"
                                name="address"
                                id="address"
                                placeholder="Huye/Ngoma"
                                value={selectedUser.address}
                                onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-group mt-3">
                            <span>Role</span>
                            <select
                              name="role"
                              className="form-control"
                              id="role"
                              value={selectedUser.role}
                              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                            >
                              <option value="" disabled>Select Role</option>
                              <option value="admin">Admin</option>
                              <option value="Commander-Officer">Commander Officer</option>
                              <option value="user">persenel</option>
                            </select>
                          </div>

                          <div className="form-group mt-3">
                            <span>Department</span>
                            <select
                              name="departmentId"
                              onChange={(e) => setSelectedUser({ ...selectedUser, departmentId: e.target.value })}
                              className="form-control"
                              required
                              id=""
                              value={selectedUser.departmentId}
                            >
                              <option value="">Select department</option>
                              {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                  {department.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-center">
                            <button type="submit" className="form-control">
                              Save
                            </button>
                          </div>
                        </form>
                      </Modal.Body>
                    </Modal>

                    <section id="team" className="team" style={{ marginTop: '-2cm' }}>
                      <div className="container" data-aos="fade-up">
                        <div className="row gy-4">
                          {EmployeesAdmin.length > 0 ? (
                            EmployeesAdmin.map((Employee) => (
                              <div onClick={() => handleView(Employee.id)} key={Employee.id} className="col-xl-4 col-md-6 " data-aos="fade-up" data-aos-delay={100 * Employee.id} style={{ padding: '' }}>

                                <div className="member col-xl-12" style={{ padding: "0.4cm", border: '2px solid lightgreen' }}> <br />

                                  {Employee.image && Employee.image !== 'null' ? (
                                    <img src={Employee.image} className="img-fluid" alt="" style={{ borderRadius: '100%', height: '3.5cm', width: '3.5cm', border: '3px solid lightgreen' }} />
                                  ) : (
                                    <img src="/assets/img/images (3).png" className="img-fluid" alt="Default Image" style={{ borderRadius: '100%', height: '3.5cm', width: '3.5cm', color: 'lightgreen' }} />
                                  )}

                                  <h4 style={{ textAlign: 'center' }}>{Employee.firstname} &nbsp;{Employee.lastname}</h4>
                                  <p style={{ textAlign: 'center' }}>{Employee.role}</p>
                                  <p style={{ width: '3cm', color: 'white', textAlign: 'center' }} className={`badge ${Employee.status === 'active' ? 'bg-success' : 'bg-warning'}`}>{Employee.status}</p><br />

                                  <small className="text-muted" style={{ backgroundColor: 'white', border: '1px solid green', padding: '4px', borderRadius: '5px' }}>
                                    {formatDistanceToNow(new Date(Employee.createdAt), {
                                      addSuffix: true,
                                    })}
                                  </small>
                                  <p style={{ textAlign: 'center', fontStyle: '', fontPalette: '13px', backgroundColor: 'lightgreen', color: 'black', padding: '0.4cm', marginTop: '20px', borderRadius: '6px' }}>
                                    <BiMap className="" style={{ color: 'black' }} />&nbsp;&nbsp;{Employee.address} <br />
                                    <BiEnvelope className="flex-shrink-0 bi bi-envelope flex-shrink-0" style={{ color: 'black' }} />&nbsp;&nbsp;{Employee.email} <br />
                                    <BiPhone />&nbsp;&nbsp;{Employee.phone}
                                  </p>
                                  <button onClick={() => { handleModify(Employee.id); handleToggleModal1(); }} style={{ backgroundColor: 'white', border: '0px', color: 'green' }}>
                                    <FontAwesomeIcon icon={faEdit} style={{ Color: 'gray' }} />
                                  </button>
                                  <button onClick={() => handleDelete(Employee.id)} style={{ backgroundColor: 'white', color: 'red', border: '0px', }}>
                                    <FontAwesomeIcon icon={faTrash} style={{ Color: 'red' }} />
                                  </button>
                                  <button style={{ backgroundColor: 'white', border: '0px', color: 'orange' }} onClick={() => { handleView(Employee.id); handleShowDetailModal(); }}>
                                    <FontAwesomeIcon icon={faEye} />
                                  </button>
                                  {renderActivationButton(Employee.id, Employee.status)}

                                </div>


                              </div>
                            ))
                          ) : (
                            <div className="col-12 text-center">
                              <h4 style={{ textAlign: 'center', paddingBottom: '0.5cm', color: 'gray', border: '4PX SOLID lightgray', padding: '1cm' }}>{value ? 'NO MATCHING DATA FOUND' : 'NO DATA AVAILABLE'}</h4>
                            </div>
                          )}

                        </div>
                      </div>
                    </section>
                  </div>

                </>}
              </div>
            </main>
          </div>
        </div>
      </div>
      <ToastContainer />
    </body>
  );
};

export default Dashboard;
