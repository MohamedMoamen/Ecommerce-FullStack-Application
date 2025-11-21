import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
import axios from "axios";

const AdminCategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: categoryId,
    imageFile: null,
  });

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/category/${categoryId}`);
      setCategoryName(res.data.name);
    } catch (err) {
      console.log("Error fetching category", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/productsOfCategory/${categoryId}`);
      const productsWithImage = res.data.map((p) => ({
        ...p,
        image_url: p.imagepath
          ? `http://127.0.0.1:8000/storage/${p.imagepath}`
          : null,
      }));
      setProducts(productsWithImage);
    } catch (err) {
      setError(err.response?.data || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category_id: product.category_id,
      imageFile: null,
    });
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleNewInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleNewImage = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleEditImage = (e) => {
    setEditData({ ...editData, imageFile: e.target.files[0] });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Add this product?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("quantity", newProduct.quantity);
      formData.append("category_id", categoryId);
      if (newProduct.image) formData.append("image", newProduct.image);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/products",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts([
        ...products,
        {
          ...res.data,
          image_url: res.data.imagepath
            ? `http://127.0.0.1:8000/storage/${res.data.imagepath}`
            : null,
        },
      ]);

      setNewProduct({ name: "", description: "", price: "", quantity: "", image: null });
      setShowAddModal(false);
      alert("Product added!");
    } catch (err) {
      alert(
        "Error adding product: " +
          (err.response?.data?.message || JSON.stringify(err.response?.data))
      );
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure to update this product?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("price", editData.price);
      formData.append("quantity", editData.quantity);
      formData.append("category_id", editData.category_id);
      if (editData.imageFile) formData.append("image", editData.imageFile);

      const res = await axios.post(
        `http://127.0.0.1:8000/api/products/${editProduct.id}?_method=PUT`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data;
      updated.image_url = updated.imagepath
        ? `http://127.0.0.1:8000/storage/${updated.imagepath}`
        : null;

      setProducts(
        products.map((p) => (p.id === editProduct.id ? updated : p))
      );
      setEditProduct(null);
      alert("Product updated successfully!");
    } catch (err) {
      alert(
        "Error updating product: " +
          (err.response?.data?.message || JSON.stringify(err.response?.data))
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted!");
    } catch (err) {
      alert("Error deleting product");
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{JSON.stringify(error)}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <AdminHeader />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Products of {categoryName} Category</h2>
        <button
          className="btn btn-success"
          style={{ height: 50 }}
          onClick={() => setShowAddModal(true)}
        >
          + Add Product
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: "100%", height: 200, objectFit: "cover", cursor: "pointer" }}
                onClick={() => handleEdit(product)}
              />
            ) : (
              <div style={{ width: "100%", height: 200, backgroundColor: "#eee" }} />
            )}

            <div style={{ padding: "15px" }}>
              <h3 style={{ margin: "10px 0", fontSize: "18px" }}>{product.name}</h3>
              <p style={{ fontSize: "16px", fontWeight: "bold" }}>${product.price}</p>
              <p style={{ fontSize: "14px", color: "#555" }}>{product.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التعديل */}
      {editProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, width: 400, borderRadius: 8 }}>
            <h3>Edit Product</h3>
            <form onSubmit={handleUpdateSubmit}>
              <input name="name" value={editData.name} onChange={handleInputChange} placeholder="Name" required />
              <textarea name="description" value={editData.description} onChange={handleInputChange} placeholder="Description" required />
              <input name="price" type="number" value={editData.price} onChange={handleInputChange} placeholder="Price" required />
              <input name="quantity" type="number" value={editData.quantity} onChange={handleInputChange} placeholder="Quantity" required />
              <input type="file" onChange={handleEditImage} />
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* مودال إضافة منتج */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, width: 400, borderRadius: 8 }}>
            <h3>Add Product</h3>
            <form onSubmit={addProduct}>
              <input name="name" value={newProduct.name} onChange={handleNewInputChange} placeholder="Name" required />
              <textarea name="description" value={newProduct.description} onChange={handleNewInputChange} placeholder="Description" />
              <input name="price" type="number" value={newProduct.price} onChange={handleNewInputChange} placeholder="Price" required />
              <input name="quantity" type="number" value={newProduct.quantity} onChange={handleNewInputChange} placeholder="Quantity" required />
              <input type="file" onChange={handleNewImage} />
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <AdminFooter />
    </div>
  );
};

export default AdminCategoryProducts;
