import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editCategory, setEditCategory] = useState(null); 
  const [newCategory, setNewCategory] = useState({
  name: "",
  description: "",
  image: null,
});

const [showAddModal, setShowAddModal] = useState(false);
const openAddModal = () => setShowAddModal(true);
const closeAddModal = () => setShowAddModal(false);


  const [editData, setEditData] = useState({
    name: "",
    description: "",
    imageFile: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const res = await axios.get("http://127.0.0.1:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setCategories(res.data);
    } catch (err) {
      setError(err.response ? err.response.data : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: "red" }}>{JSON.stringify(error)}</p>;

  const handleEdit = (category) => {
    setEditCategory(category);
    setEditData({
      name: category.name,
      description: category.description,
      imageFile: null,
    });
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEditData({ ...editData, imageFile: e.target.files[0] });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editCategory || !editCategory.id) {
      alert("No category selected or invalid category ID!");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to update this category?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      formData.append("name", editData.name);
      formData.append("description", editData.description);
      if (editData.imageFile) {
        formData.append("image", editData.imageFile);
      }

      const res = await axios.post(
        `http://127.0.0.1:8000/api/categories/${editCategory.id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const updated = res.data;
      updated.image_url = updated.imagepath
        ? `http://127.0.0.1:8000/storage/${updated.imagepath}`
        : null;

      setCategories(
        categories.map((cat) => (cat.id === editCategory.id ? updated : cat))
      );

      setEditCategory(null);
      alert("Category updated successfully!");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(
        "Error updating category: " +
          (err.response?.data?.message ||
            JSON.stringify(err.response?.data) ||
            err.message)
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(categories.filter((cat) => cat.id !== id));
      alert("Category deleted successfully!");
    } catch (err) {
      alert("Error deleting category");
    }
  };

  const addCategory = async (e) => {
  e.preventDefault();

  const confirmAdd = window.confirm("Are you sure you want to add this category?");
  if (!confirmAdd) return;

  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);

    if (newCategory.image) {
      formData.append("image", newCategory.image);
    }

    const res = await axios.post(
      "http://127.0.0.1:8000/api/categories",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setCategories([
      ...categories,
      {
        ...res.data,
        image_url: res.data.imagepath
          ? `http://127.0.0.1:8000/storage/${res.data.imagepath}`
          : null,
      },
    ]);

    setNewCategory({ name: "", description: "", image: null });
    setShowAddModal(false);

    alert("Category added successfully!");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Error adding category: " + JSON.stringify(err.response?.data));
  }
};


  return (
    <div>
      <AdminHeader />
       <div style={{display:"flex",textAlign:"center",justifyContent:"center"}}>

      <h2 style={{ textAlign: "center" }}>Categories</h2>
      <button style={{marginLeft:"10px",marginTop:"15px",width:"60px",height:"50px"}} className="btn btn-success mb-3" onClick={openAddModal}>
      + Add Category
     </button>

      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} style={{ textAlign: "center" }}>
              <td>{cat.id}</td>
              <td><Link to={`/admin/category/${cat.id}/products`} style={{ textDecoration: "none", color: "blue" }}>
                    {cat.name}
                  </Link>
            </td>
              <td>{cat.description}</td>
              <td>
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    style={{
                      width: "150px",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No Image"
                )}
              </td>

              <td>
                <button
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "5px 10px",
                    marginRight: "5px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>

                <button
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editCategory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>Edit Category</h3>

            <form onSubmit={handleUpdateSubmit}>
              <label>Name:</label>
              <input
                name="name"
                type="text"
                value={editData.name}
                onChange={handleInputChange}
                required
              />

              <label>Description:</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleInputChange}
              />

              <label>Image:</label>
              <input type="file" onChange={handleImageChange} />

              <div style={{ marginTop: "10px" }}>
                <button type="submit">Update</button>
                <button onClick={() => setEditCategory(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

{showAddModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        width: "400px",
      }}
    >
      <h3>Add Category</h3>

      <form onSubmit={addCategory}>
        <label>Name:</label>
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          required
        />

        <label>Description:</label>
        <textarea
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />

        <label>Image:</label>
        <input
          type="file"
          onChange={(e) =>
            setNewCategory({ ...newCategory, image: e.target.files[0] })
          }
        />

        <div style={{ marginTop: "10px" }}>
          <button type="submit">Add</button>
          <button type="button" onClick={closeAddModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      <AdminFooter />
    </div>
  );
};

export default AdminCategories;
