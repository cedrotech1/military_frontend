import React, { useEffect, useState } from "react";
import "../../css/main2.css";
import LoadingSpinner from "../../components/loading";
import Menu from "../../components/customerM";
import Footer from "../../components/footer";
import { BiMap, BiEnvelope, BiPhone } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 3; // Limit per page

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/appoitment/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setAppointments(data.data);
          setFilteredAppointments(data.data); // Initialize filter
        } else {
          console.error("Failed to fetch appointments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // Filter Appointments by Status
  useEffect(() => {
    if (statusFilter) {
      setFilteredAppointments(
        appointments.filter((appointment) => appointment.status === statusFilter)
      );
    } else {
      setFilteredAppointments(appointments);
    }
    setCurrentPage(1); // Reset pagination on filter change
  }, [statusFilter, appointments]);

  // Pagination Logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Menu />
      <section id="hero" className="hero" style={{ marginTop: "2cm" }}>
        <div className="container position-relative">
          <div className="row gy-5" data-aos="fade-in">
            <div className="col-lg-6 d-flex flex-column justify-content-center text-center text-lg-start">
              <h5 style={{ fontSize: "35px", fontWeight: "bold" }}>
                <b>
                  LIST OF <span style={{ color: "lightgreen" }}>MY APPOINTMENTS</span>
                </b>
              </h5>
              <p style={{ fontFamily: "monospace" }}>
                View details of your assigned missions and tasks.
              </p>
              <div>
                <select
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                  className="form-select"
                  style={{ maxWidth: "300px", marginTop: "10px",border:'1px solid lightgreen  ' }}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="ongoint">ongoing</option>
                  <option value="inactive">Disactivated</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="appointments" className="team">
        <div className="container" data-aos="fade-up">
          <div className="row gy-4">
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "3cm" }}>
                <LoadingSpinner />
              </div>
            ) : (
              currentAppointments.map((appointment) => (
                <div
                  onClick={() => navigate(`../appointment/${appointment.id}`)}
                  key={appointment.id}
                  className="col-xl-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-delay={100 * appointment.id}
                  style={{ padding: "0.4cm" }}
                >
                  <div className="member col-xl-12" style={{ padding: "0.4cm",border:'1px solid lightgreen' }}>
                    <div>
                      <strong>Mission:</strong> {appointment.mission.name} <br />
                      <strong>Location:</strong> {appointment.mission.location} <br />
                      <strong>Status:</strong> {appointment.status} <br />
                      <strong>Assigned By:</strong> {appointment.assigner.firstname} {appointment.assigner.lastname} <br />
                      <strong>Date:</strong> {new Date(appointment.createdAt).toLocaleDateString()}
                    </div>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
                        backgroundColor: "lightgreen",
                        color:'black',
                        padding: "0.4cm",
                        marginTop: "20px",
                        borderRadius: "6px",
                      }}
                    >
                      <u>Appointment assigner contact</u> <br />
                      <BiMap style={{ color: "black" }} /> {appointment.assigner.address} <br />
                      <BiEnvelope style={{ color: "black" }} /> {appointment.assigner.email} <br />
                      <BiPhone /> {appointment.assigner.phone}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="pagination" style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn"  
             style={{
              textAlign: "center",
              fontSize: "13px",
              backgroundColor: "lightgreen",
              padding: "0.2cm",
              marginTop: "1px",
              borderRadius: "6px",
            }}>
              Previous
            </button>
            <span style={{ margin: "0 15px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn"
            style={{
              textAlign: "center",
              fontSize: "13px",
              backgroundColor: "lightgreen",
              padding: "0.2cm",
              marginTop: "1px",
              borderRadius: "6px",
            }}>
              Next
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LandingPage;
