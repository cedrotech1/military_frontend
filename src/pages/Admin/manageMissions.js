import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDistanceToNow } from "date-fns";
import { Modal, Button, Form, Card, Badge, ListGroup } from "react-bootstrap";
import LoadingSpinner from '../../components/loading'; // Import the LoadingSpinner component


const TOKEN = localStorage.getItem("token");

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentMissions, setCurrentMissions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    CountryID: ""
  });
  const handleShowModal = (mission) => {
    setSelectedMission(mission);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMission(null);
  };

  const [selectedMission, setSelectedMission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const missionsPerPage = 3;

  const handleShowDetails = (mission) => {
    setSelectedMission(mission);
    setShowModal(true);
  };

  useEffect(() => {

    fetchMissions();
  }, []);

  useEffect(() => {
    const indexOfLastMission = currentPage * missionsPerPage;
    const indexOfFirstMission = indexOfLastMission - missionsPerPage;
    setCurrentMissions(missions.slice(indexOfFirstMission, indexOfLastMission));
  }, [missions, currentPage]);



  const fetchMissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/mission`, {
        method: "GET",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "*/*" },
      });

      if (!response.ok) throw new Error("Failed to fetch missions");

      const data = await response.json();
      setMissions(data.data);
    } catch (error) {
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMission = async (missionId) => {
    if (window.confirm("Are you sure you want to delete this mission?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/mission/delete/${missionId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}`, accept: "*/*" },
          }
        );

        const data = await response.json();
        if (response.ok) {
          toast.success("Mission deleted successfully");
          fetchMissions(); // Refresh the mission list
        } else {
          toast.error(data.message || "Failed to delete mission");
        }
      } catch (error) {
        toast.error("Error deleting mission: " + error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMission = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.location || !formData.start_date || !formData.end_date || !formData.CountryID) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/mission/add/`, {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Mission added successfully.");
        setFormData({
          name: "",
          description: "",
          location: "",
          start_date: "",
          end_date: "",
        });
        fetchMissions(); // Refresh the mission list
      } else {
        toast.error(data.message || "Failed to add mission.");
      }
    } catch (error) {
      toast.error("Error adding mission: " + error.message);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(missions.length / missionsPerPage)) setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(missions.length / missionsPerPage);



  const handleToggleStatus = async (missionId, isActive) => {
    const endpoint = isActive
      ? `${process.env.REACT_APP_BASE_URL}/api/v1/mission/disactivate/${missionId}`
      : `${process.env.REACT_APP_BASE_URL}/api/v1/mission/activate/${missionId}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${TOKEN}`
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMissions((prevMissions) =>
          prevMissions.map((mission) =>
            mission.id === missionId ? { ...mission, active: !mission.active } : mission
          )
        );
        toast.success(data.message || "mission updated successfully");
        // window.location.reload();

        console.log(response);
      } else {
        console.error("Failed to toggle mission status");
        // console.log(response);
        toast.error(data.message || "error__");
      }
    } catch (error) {
      console.error("Error toggling mission status:", error);
    }
  };





  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch( `${process.env.REACT_APP_BASE_URL}/api/v1/mission/countries `, {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setCountries(data.data);
        } else {
          toast.error(data.message || "Failed to fetch countries.");
        }
      } catch (error) {
        toast.error("Error fetching countries: " + error.message);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{ backgroundColor: 'lightgreen', padding: '0.3cm', color: 'black', borderRadius: '6px' }}>Manage Missions</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">Add Mission</h4>
              <form onSubmit={handleAddMission}>
              <label>Name</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Mission Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                 <label>Description</label>
                <textarea
                  className="form-control mb-3"
                  placeholder="Mission Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                 <label>Location specification</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
                <label>Start date</label>
                <input
                  type="date"
                  className="form-control mb-3"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
                   <label>end date</label>
                <input
                  type="date"
                  className="form-control mb-3"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
                <select
                  name="CountryID"
                  className="form-control mb-3"
                  value={formData.CountryID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.common_name}
                    </option>
                  ))}
                </select>

                <button type="submit" style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'black', margonTop: '-1cm' }} className="btn btn-primary w-100">
                  Add Mission
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body" style={{ backgroundColor: 'lightgreen' }}>
              <h4 className="card-title">Existing Missions</h4>
              {loading ? (
                <p><LoadingSpinner/></p>
              ) : currentMissions.length > 0 ? (
                currentMissions.map((mission) => (
                  <div className="card mb-4" key={mission.id} style={{ borderRadius: '10px' }}>
                    <div className="card-body">
                      <h5 className="card-title">{mission.name}</h5>
                      <p><strong>Description:</strong> {mission.description}</p>
                      <p><strong>Location:</strong> {mission.location}</p>
                      <p>Start: {new Date(mission.start_date).toLocaleDateString()} to {new Date(mission.end_date).toLocaleDateString()}</p>

                      {/* <div className="d-flex align-items-center mb-2">
                <span className="badge" style={{ backgroundColor: mission.status === 'active' ? 'green' : 'orange', color: 'white', padding: '5px 10px', borderRadius: '15px' }}>
                  {mission.status}
                </span>
              </div> */}

                      <small className="text-muted" style={{ backgroundColor: 'white', border: '1px solid green', padding: '5px', borderRadius: '5px' }}>
                        Created {formatDistanceToNow(new Date(mission.createdAt), { addSuffix: true })}
                      </small>

                      <div className="country-details mt-3 p-3 rounded" style={{ backgroundColor: 'whitesmoke' }}>
                        <div className="row align-items-center">
                          {/* Flag Image */}
                          <div className="col-12 col-md-4 mb-3 mb-md-0">
                            <img
                              src={mission.country.flag_url}
                              alt={`${mission.country.common_name} Flag`}
                              className="img-fluid"
                            // style={{ maxHeight: '3cm', maxWidth: '5cm' }}
                            />
                          </div>

                          {/* Country Details */}
                          <div className="col-12 col-md-8">
                            <h6><strong>Country:</strong> {mission.country.common_name}</h6>
                            <p><strong>Official Name:</strong> {mission.country.official_name}</p>
                            <p><strong>Capital:</strong> {mission.country.capital}</p>
                            <p>
                              <a href={mission.country.google_map_url} target="_blank" rel="noopener noreferrer">
                                View on Google Maps
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>



                      <div className="d-flex justify-content-between mt-3">
                        <button
                          className={`btn ${mission.active ? "btn-warning" : "btn-success"} me-2`}
                          onClick={() => handleToggleStatus(mission.id, mission.active)}
                          style={{ backgroundColor: 'white', color: 'green', border: '1px solid green' }}
                        >
                          {mission.active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          style={{ backgroundColor: 'white', color: 'skyblue', border: '1px solid skyblue' }}
                          className="btn btn-info me-2"
                          onClick={() => handleShowDetails(mission)}
                        >
                          View Details
                        </button>

                        <button
                          style={{ backgroundColor: 'white', color: 'red', border: '1px solid red' }}
                          className="btn btn-danger"
                          onClick={() => handleDeleteMission(mission.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No missions found.</p>
              )}

              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>

      {selectedMission && (
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>Mission Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {/* Left Column: Mission Details */}
              <div className="col-md-6">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h5 className="text-primary">Mission Info</h5>
                    <p><strong>Name:</strong> {selectedMission.name}</p>
                    <p><strong>Description:</strong> {selectedMission.description}</p>
                    <p><strong>Location:</strong> {selectedMission.location}</p>
                    <p><strong>Status:</strong> <Badge bg={selectedMission.status === "active" ? "success" : "warning"}>{selectedMission.status}</Badge></p>
                  </Card.Body>
                </Card>

                <Card className="shadow-sm border-0 mt-3">
                  <Card.Body>
                    <h5 className="text-primary">Created By</h5>
                    <p><strong>Name:</strong> {selectedMission.creator.firstname} {selectedMission.creator.lastname}</p>
                    <p><strong>Email:</strong> {selectedMission.creator.email}</p>
                    <p><strong>Phone:</strong> {selectedMission.creator.phone}</p>
                  </Card.Body>
                </Card>
              </div>

              {/* Right Column: Dates & Appointments */}
              <div className="col-md-6">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h5 className="text-primary">Mission Duration</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" value={selectedMission.start_date.split("T")[0]} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" value={selectedMission.end_date.split("T")[0]} readOnly />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>



                {/* Country Card */}
                <Card className="shadow-sm border-0 mt-3">
                  <Card.Body>
                    <h5 className="text-primary">Country Info</h5>
                    <p><strong>Country:</strong> {selectedMission.country.common_name}</p>
                    <p><strong>Official Name:</strong> {selectedMission.country.official_name}</p>
                    <p><strong>Capital:</strong> {selectedMission.country.capital}</p>
                    <img src={selectedMission.country.flag_url} alt={`${selectedMission.country.common_name} Flag`} width="100" className="mb-2" />
                    <p>
                      <a href={selectedMission.country.google_map_url} target="_blank" rel="noopener noreferrer">
                        View on Google Maps
                      </a>
                    </p>
                  </Card.Body>
                </Card>

                <Card className="shadow-sm border-0 mt-3">
                  <Card.Body>
                    <h5 className="text-primary">Appointments</h5>
                    <ListGroup variant="flush">
                      {selectedMission.appointments.length > 0 ? (
                        selectedMission.appointments.map((appointment) => (
                          <ListGroup.Item key={appointment.id} className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{appointment.user?.firstname} {appointment.user?.lastname}</strong>
                            </div>
                            <Badge bg={appointment.status === "active" ? "success" : "warning"}>{appointment.status}</Badge>
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item className="text-muted">No Appointments</ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}



      <ToastContainer />
    </div>
  );
};

export default MissionsPage;
