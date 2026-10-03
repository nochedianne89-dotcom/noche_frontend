import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import Register from './pages/Register'; // <-- import Register page

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/products" element={<Products />} />
                <Route path="/register" element={<Register />} /> {/* <-- add register route */}
            </Routes>
        </BrowserRouter>
    );
}
