import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:5000/api/v1/categories";
const TOKEN =localStorage.getItem('token');
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "*/*",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    if (!name) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/categories/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const data = await response.json();
      setMessage(data.message);
      setCategories([...categories, data.Category]); // Update list immediately
      setName("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/categories/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{backgroundColor:'lightgreen',border:'2px solid white',padding:'0.3cm',color:'black',borderRadius:'6px',textShadow:'1px 1px white'}}>Manage Categories</h2>
      
      <div className="row">
        {/* Add Category Form Card */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">Add Category</h4>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button className="btn btn-primary w-100" style={{border: '1px solid lightgreen', backgroundColor: 'lightgreen', color: 'black',margonTop:'1cm',width:'80%' }}onClick={handleAddCategory}>
                Add Category
              </button>
              {message && <p className="text-success mt-2">{message}</p>}
              {error && <p className="text-danger mt-2">{error}</p>}
            </div>
          </div>
        </div>

        {/* Categories Table Card */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">Existing Categories</h4>
              {categories.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Created at</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td>{new Date(category.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No categories found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
