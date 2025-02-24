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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file || null });
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryID || !formData.description) {
      setMessage("All fields are required.");
      return;
    }

    const profileData = new FormData();
    profileData.append("name", formData.name);
    profileData.append("categoryID", formData.categoryID);
    profileData.append("description", formData.description);
    profileData.append("image", formData.image);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/profile/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: profileData,
      });

      if (!response.ok) throw new Error("Failed to add profile");

      const data = await response.json();
      setMessage(data.message);
      setProfiles([...profiles, data.profile]);
      toast.success(data.message);
      setFormData({ name: "", categoryID: "", description: "", image: null });
    } catch (error) {
      setMessage(error.message);
      toast.error(error.message);
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
      <h2 className="text-center mb-4" style={{ border: '0px solid green', backgroundColor: 'lightgreen', color: 'green',margonTop:'0cm',padding:'0.2cm' }}>Manage Profiles</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">Add Profile</h4>
              <form onSubmit={handleAddProfile}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Profile Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-control"
                    name="categoryID"
                    value={formData.categoryID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
                <button type="submit" className="btn  w-100" style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'green',margonTop:'0cm' }}>
                  Add Profile
                </button>
              </form>
              {message && <p className="text-success mt-2">{message}</p>}
              {error && <p className="text-danger mt-2">{error}</p>}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
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
                          style={{ maxHeight: "100px", objectFit: "cover" }}
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
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteProfile(profile.id)}
                          >
                            Delete
                          </button>
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
                  className="btn btn-secondary"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm ${currentPage === index + 1 ? "btn-primary" : "btn-light"}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-secondary"
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
