import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ product_name: '', description: '', price: '', quantity: '' });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            const res = await api.get('/api/products');
            setProducts(res.data.data);
        } catch (err) {
            navigate('/');
        }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await api.put(`/api/products/${editingId}`, form);
        } else {
            await api.post('/api/products', form);
        }
        setForm({ product_name: '', description: '', price: '', quantity: '' });
        setEditingId(null);
        loadProducts();
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditingId(product.id);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this product?')) {
            await api.delete(`/api/products/${id}`);
            loadProducts();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    return (
        <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Product Management</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input name="product_name" placeholder="Product Name" value={form.product_name} onChange={handleChange} required />
                <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
                <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
                <button type="submit">{editingId ? 'Update' : 'Add'}</button>
            </form>

            <table border="1" cellPadding="8" style={{ width: '100%' }}>
                <thead>
                    <tr><th>Name</th><th>Description</th><th>Price</th><th>Qty</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.product_name}</td>
                            <td>{p.description}</td>
                            <td>{p.price}</td>
                            <td>{p.quantity}</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}