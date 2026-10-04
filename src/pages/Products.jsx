import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api";

const emptyForm = { product_name: "", description: "", price: "", quantity: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      const d = res.data;
      const list = d.data ?? d.products ?? d;
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load products"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      product_name: form.product_name,
      description: form.description,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    };
    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload);
      } else {
        await api.post("/api/products", payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save product"));
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      product_name: p.product_name,
      description: p.description || "",
      price: p.price,
      quantity: p.quantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      if (editingId === id) resetForm();
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete product"));
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {
        refresh_token: localStorage.getItem("refresh_token"),
      });
    } catch {
      // ignore: we still clear the local session
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Product Management</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="card" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
        <input
          name="product_name"
          placeholder="Product name"
          value={form.product_name}
          onChange={handleChange}
          maxLength={100}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="quantity"
          type="number"
          min="0"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <div className="row">
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6">Loading...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan="6">No products yet.</td></tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.product_name}</td>
                <td>{p.description}</td>
                <td>{Number(p.price).toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>{" "}
                  <button className="danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}