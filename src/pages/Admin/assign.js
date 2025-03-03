import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';

import { useParams } from "react-router-dom";
const TOKEN = localStorage.getItem('token');

const ProfilePage = () => {
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentProfiles, setCurrentProfiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    skillsID: "",
    description: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage, setProfilesPerPage] = useState(3);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    fetchSkills();
    fetchProfiles();
    fetchUsers();
  }, []);

  useEffect(() => {
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    setCurrentProfiles(profiles.slice(indexOfFirstProfile, indexOfLastProfile));
  }, [profiles, currentPage]);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/skills`, {
        method: "GET",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "*/*" },
      });
      if (!response.ok) throw new Error("Failed to fetch skills");

      const data = await response.json();
      setSkills(data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/profile/one/2`, {
        method: "GET",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "*/*" },
      });
      if (!response.ok) throw new Error("Failed to fetch profiles");

      const data = await response.json();
      setProfiles([data.data]);
      setTotalProfiles(profiles.length);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "*/*" },
      });
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      setError(error.message);
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
    if (!formData.name || !formData.skillsID || !formData.description) {
      setMessage("All fields are required.");
      return;
    }

    const profileData = new FormData();
    profileData.append("name", formData.name);
    profileData.append("skillsID", formData.skillsID);
    profileData.append("description", formData.description);
    profileData.append("image", formData.image);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/profile/add/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: profileData,
      });
      if (!response.ok) throw new Error("Failed to add profile");

      const data = await response.json();
      setMessage(data.message);
      setProfiles([...profiles, data.profile]);
      toast.success(data.message);
      setFormData({ name: "", skillsID: "", description: "", image: null });
    } catch (error) {
      setMessage(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Manage Profiles</h2>
      <form onSubmit={handleAddProfile}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <select name="skillsID" value={formData.skillsID} onChange={handleChange} required>
          <option value="">Select Skill</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>{skill.name}</option>
          ))}
        </select>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Add Profile</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ProfilePage;