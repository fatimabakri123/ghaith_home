import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminDashboard() {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();

    navigate("/admin/login");
  }

  return (
    <main className="admin-dashboard">

      <div className="admin-header">

        <div>
          <p>Bridal Home</p>
          <h1>Business Dashboard</h1>
        </div>

        <button onClick={logout}>
          Logout
        </button>

      </div>


      <div className="admin-dashboard-grid">

        <button
          onClick={() => navigate("/admin/products")}
        >
          🛍️
          <span>Products</span>
        </button>


        <button
          onClick={() => navigate("/admin/products/add")}
        >
          ➕
          <span>Add Product</span>
        </button>


        <button
          onClick={() => navigate("/admin/orders")}
        >
          📦
          <span>Orders</span>
        </button>


        <button
          onClick={() => navigate("/admin/categories")}
        >
          🗂️
          <span>Categories</span>
        </button>

      </div>

    </main>
  );
}

export default AdminDashboard;