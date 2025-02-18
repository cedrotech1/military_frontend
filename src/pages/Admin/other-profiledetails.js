import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Image, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/v1";
const TOKEN = localStorage.getItem("token");
// `${process.env.REACT_APP_BASE_URL}
const ProfilePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfiles, setCurrentProfiles] = useState([]); // Profiles to show on current page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(3);
  const [totalProfiles, setTotalProfiles] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    // Update profiles to show based on pagination
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    setCurrentProfiles(profiles.slice(indexOfFirstProfile, indexOfLastProfile));
  }, [profiles, currentPage]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/profile/one/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "*/*" },
      });

      if (!response.ok) throw new Error("no profile yet....");

      const data = await response.json();
      setProfiles([data.data]); // Ensure it's an array
      setTotalProfiles(1);
    } catch (error) {
      setError(error.message);
      toast.error("Error fetching profiles!");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < Math.ceil(totalProfiles / profilesPerPage) && setCurrentPage(currentPage + 1);

  const totalPages = Math.ceil(totalProfiles / profilesPerPage);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Manage Profiles</h2>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Existing Profiles</Card.Title>

              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" />
                  <p>Loading profiles...</p>
                </div>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : currentProfiles.length > 0 ? (
                currentProfiles.map((profile) => (
                  <Card className="mb-3" key={profile.id}>
                    <Row className="g-0">
                      <Col md={4}>
                        <Image
                          src={profile.category?.image || profile.image || "/assets/img/images (3).png"}
                          className="img-fluid rounded-start"
                          alt={profile.name}
                          style={{ maxHeight: "100px", objectFit: "cover" }}
                        />
                      </Col>
                      <Col md={8}>
                        <Card.Body>
                          <Card.Title>{profile.name}</Card.Title>
                          <Card.Text>
                            <strong>Category:</strong> {profile.category?.name || "No category"}
                          </Card.Text>
                          <Card.Text>
                            <strong>Description:</strong> {profile.description}
                          </Card.Text>
                          <Card.Text>
                            <small className="text-muted">
                              Created: {new Date(profile.createdAt).toLocaleDateString()}
                            </small>
                          </Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p className="text-muted">No profiles found.</p>
              )}

              <div className="d-flex justify-content-between mt-3">
                <Button variant="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <div>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={currentPage === index + 1 ? "primary" : "light"}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button variant="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
