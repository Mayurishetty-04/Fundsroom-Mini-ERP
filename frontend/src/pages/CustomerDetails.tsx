import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Customer } from "../types/customer";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/customers/${id}`);

        const data =
          response.data.data?.customer ||
          response.data.data;

        setCustomer(data);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load customer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  if (error || !customer) {
    return (
      <div className="page-container">
        <p className="error">{error || "Customer not found"}</p>

        <button onClick={() => navigate("/customers")}>
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="details-card">
        <h1>Customer Details</h1>

        <div className="detail-row">
          <strong>Customer Name:</strong>
          <span>{customer.customerName}</span>
        </div>

        <div className="detail-row">
          <strong>Mobile:</strong>
          <span>{customer.mobile}</span>
        </div>

        <div className="detail-row">
          <strong>Email:</strong>
          <span>{customer.email || "-"}</span>
        </div>

        <div className="detail-row">
          <strong>Business Name:</strong>
          <span>{customer.businessName || "-"}</span>
        </div>

        <div className="detail-row">
          <strong>GST Number:</strong>
          <span>{customer.gstNumber || "-"}</span>
        </div>

        <div className="detail-row">
          <strong>Customer Type:</strong>
          <span>{customer.customerType}</span>
        </div>

        <div className="detail-row">
          <strong>Address:</strong>
          <span>{customer.address || "-"}</span>
        </div>

        <div className="details-actions">
          <Link to={`/customers/${customer.id}/edit`}>
            <button>Edit Customer</button>
          </Link>

          <button
            className="secondary-button"
            onClick={() => navigate("/customers")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;