import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
import axios from "axios";

const AdminDeliveryMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMember, setEditMember] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    notes: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    notes: "",
    password: "",
  });

  // Fetch all delivery members
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await axios.get(
        "http://127.0.0.1:8000/api/delivery-members",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setMembers(res.data);
    } catch (err) {
      setError(err.response ? err.response.data : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (member) => {
    setEditMember(member);
    setEditData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      vehicle: member.vehicle,
      notes: member.notes,
    });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this delivery member?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://127.0.0.1:8000/api/delivery-members/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(members.filter((m) => m.id !== id));
      alert("Delivery member deleted!");
    } catch (err) {
      alert("Error deleting member");
    }
  };

  // Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Update this member?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.put(
        `http://127.0.0.1:8000/api/delivery-members/${editMember.id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setMembers(
        members.map((m) =>
          m.id === editMember.id ? res.data.member : m
        )
      );
      setEditMember(null);
      alert("Updated successfully!");
    } catch (err) {
      alert(
        "Error updating member: " +
          (err.response?.data?.message || JSON.stringify(err.response?.data))
      );
    }
  };

  // Add
  const addMember = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Add this delivery member?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/delivery-members",
        newMember,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // store() backend بيرجع العضو مباشرة
      setMembers([...members, res.data]);

      setShowAddModal(false);
      setNewMember({
        name: "",
        email: "",
        phone: "",
        vehicle: "",
        notes: "",
        password: "",
      });
      alert("Delivery Member Added!");
    } catch (err) {
      alert(
        "Error adding member: " +
          (err.response?.data?.message || JSON.stringify(err.response?.data))
      );
    }
  };

  if (loading) return <p>Loading delivery members...</p>;
  if (error) return <p style={{ color: "red" }}>{JSON.stringify(error)}</p>;

  return (
    <div>
      <AdminHeader />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <h2>Delivery Members</h2>
        <button
          style={{
            marginLeft: "10px",
            marginTop: "10px",
            width: "80px",
            height: "40px",
          }}
          className="btn btn-success"
          onClick={() => setShowAddModal(true)}
        >
          + Add
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Vehicle</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={{ textAlign: "center" }}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.vehicle}</td>
              <td>{m.notes}</td>
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
                  onClick={() => handleEdit(m)}
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
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editMember && (
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
            <h3>Edit Member</h3>
            <form onSubmit={handleUpdateSubmit}>
              <label>Name:</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                required
              />
              <label>Email:</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                required
              />
              <label>Phone:</label>
              <input
                type="text"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
              <label>Vehicle:</label>
              <input
                type="text"
                value={editData.vehicle}
                onChange={(e) =>
                  setEditData({ ...editData, vehicle: e.target.value })
                }
              />
              <label>Notes:</label>
              <input
                type="text"
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
              />
              <div style={{ marginTop: "10px" }}>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditMember(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
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
            <h3>Add Delivery Member</h3>
            <form onSubmit={addMember}>
              <label>Name:</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                required
              />
              <label>Email:</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                required
              />
              <label>Phone:</label>
              <input
                type="text"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
              />
              <label>Vehicle:</label>
              <input
                type="text"
                value={newMember.vehicle}
                onChange={(e) =>
                  setNewMember({ ...newMember, vehicle: e.target.value })
                }
              />
              <label>Notes:</label>
              <input
                type="text"
                value={newMember.notes}
                onChange={(e) =>
                  setNewMember({ ...newMember, notes: e.target.value })
                }
              />
              <label>Password:</label>
              <input
                type="password"
                value={newMember.password}
                onChange={(e) =>
                  setNewMember({ ...newMember, password: e.target.value })
                }
                required
              />
              <div style={{ marginTop: "10px" }}>
                <button type="submit">Add</button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
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

export default AdminDeliveryMembers;
