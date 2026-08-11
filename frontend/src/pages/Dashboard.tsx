import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const role = localStorage.getItem("userRole");

  const [customerCount, setCustomerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [draftChallanCount, setDraftChallanCount] =
    useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Customers
        if (role === "ADMIN" || role === "SALES") {
          const response = await api.get("/customers");

          const customers =
            response.data.data?.customers ||
            response.data.data ||
            [];

          setCustomerCount(customers.length);
        }

        // Products + Low Stock
        if (
          role === "ADMIN" ||
          role === "SALES" ||
          role === "WAREHOUSE"
        ) {
          const response = await api.get("/products");

          const products =
            response.data.data?.products ||
            response.data.data ||
            [];

          setProductCount(products.length);

          setLowStockCount(
            products.filter(
              (product: any) =>
                product.currentStock <=
                product.minimumStockQuantity
            ).length
          );
        }

        // Challans
        if (
          role === "ADMIN" ||
          role === "SALES" ||
          role === "ACCOUNTS"
        ) {
          const response = await api.get("/challans");

          const challans =
            response.data.data?.challans ||
            response.data.data ||
            [];

          setDraftChallanCount(
            challans.filter(
              (challan: any) =>
                challan.status === "DRAFT"
            ).length
          );
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard",
          error
        );
      }
    };

    loadDashboard();
  }, [role]);

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        Welcome to FundsRoom ERP Operations Portal.
      </p>

      <div className="dashboard-grid">

        {(role === "ADMIN" ||
          role === "SALES") && (
          <Link
            to="/customers"
            className="dashboard-card"
          >
            <h3>Customers</h3>
            <strong>{customerCount}</strong>
            <span>View customers</span>
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "SALES" ||
          role === "WAREHOUSE") && (
          <Link
            to="/products"
            className="dashboard-card"
          >
            <h3>Products</h3>
            <strong>{productCount}</strong>
            <span>View products</span>
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "WAREHOUSE") && (
          <Link
            to="/stock-movements"
            className="dashboard-card"
          >
            <h3>Low Stock</h3>
            <strong>{lowStockCount}</strong>
            <span>Check inventory</span>
          </Link>
        )}

        {(role === "ADMIN" ||
          role === "SALES" ||
          role === "ACCOUNTS") && (
          <Link
            to="/challans"
            className="dashboard-card"
          >
            <h3>Draft Challans</h3>
            <strong>{draftChallanCount}</strong>
            <span>Review challans</span>
          </Link>
        )}

      </div>
    </div>
  );
};

export default Dashboard;