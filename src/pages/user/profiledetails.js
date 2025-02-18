import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';


const TOKEN = localStorage.getItem('token');

const ProfilePage = () => {
  const [categories, setCategories] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentProfiles, setCurrentProfiles] = useState([]); // Profiles to show on current page
  const [formData, setFormData] = useState({
    name: "",
    categoryID: "",
    description: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage, setProfilesPerPage] = useState(3);
  const [totalProfiles, setTotalProfiles] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchProfiles();
  }, []);

  useEffect(() => {
    // Update the profiles to show based on current page
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    setCurrentProfiles(profiles.slice(indexOfFirstProfile, indexOfLastProfile));
  }, [profiles, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/categories`, {
        method: "GET",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "*/*" },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/profile/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "*/*" },
      });

      if (!response.ok) throw new Error("Failed to fetch profiles");

      const data = await response.json();
      setProfiles(data.data);
      setTotalProfiles(data.totalProfiles || data.data.length); // Set totalProfiles based on response length
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/v1/profile/delete/${profileId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TOKEN}`, accept: "*/*" },
          }
        );

        const data = await response.json();
        if (data.success) {
          setProfiles(profiles.filter((profile) => profile.id !== profileId));
          toast.success("Profile deleted successfully");
        } else {
          toast.error("Failed to delete profile");
        }
      } catch (error) {
        toast.error("Error deleting profile: " + error.message);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalProfiles / profilesPerPage)) setCurrentPage(currentPage + 1);
  };

  const totalPages = Math.ceil(totalProfiles / profilesPerPage);

  return (
    <div className="container mt-4">
      {/* <h2 className="text-center mb-4">Manage Profiles</h2> */}
      <div className="row">
       

        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body" style={{ border: '1px solid lightgreen', backgroundColor: 'lightgreen', color: 'black',margonTop:'0cm' }}>
              <h4 className="card-title">Existing Profiles</h4>
              {loading ? (
                <p>Loading profiles...</p>
              ) : currentProfiles.length > 0 ? (
                currentProfiles.map((profile) => (
                  <div className="card mb-3" key={profile.id}>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={profile.category?.image || profile.image || "/assets/img/images (3).png"}
                          className="img-fluid rounded-start"
                          alt={profile.name}
                          style={{ Height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{profile.name}</h5>
                          <p className="card-text">
                            <strong>Category:</strong> {profile.category?.name || "No category"}
                          </p>
                          <p className="card-text">
                            <strong>Description:</strong> {profile.description}
                          </p>
                          <p className="card-text">
                            <small className="text-muted">Created: {new Date(profile.createdAt).toLocaleDateString()}</small>
                          </p>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No profiles found.</p>
              )}
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-success"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm ${currentPage === index + 1 ? "btn-success" : "btn-light"}`}

                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-success"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
