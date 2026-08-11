import {
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>FundsRoom ERP</h2>

        <p className="user-role">
          Role: {role}
        </p>

        <nav>
          <Link to="/dashboard">
            Dashboard
          </Link>

          {(role === "ADMIN" ||
            role === "SALES") && (
            <Link to="/customers">
              Customers
            </Link>
          )}

          {(role === "ADMIN" ||
            role === "SALES" ||
            role === "WAREHOUSE") && (
            <Link to="/products">
              Products
            </Link>
          )}

          {(role === "ADMIN" ||
            role === "WAREHOUSE") && (
            <Link to="/stock-movements">
              Inventory
            </Link>
          )}

          {(role === "ADMIN" ||
            role === "SALES" ||
            role === "ACCOUNTS") && (
            <Link to="/challans">
              Sales Challans
            </Link>
          )}
        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;