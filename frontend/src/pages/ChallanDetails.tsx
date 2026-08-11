import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import type { Challan } from "../types/challan";

const ChallanDetails = () => {
  const { id } = useParams();

  const [challan, setChallan] =
    useState<Challan | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchChallan = async () => {
    try {
      const response = await api.get(
        `/challans/${id}`
      );

      setChallan(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load challan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallan();
  }, [id]);

  const handleConfirm = async () => {
    try {
      setError("");

      await api.put(
        `/challans/${id}/confirm`
      );

      await fetchChallan();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to confirm challan"
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading challan...
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="page-container">
        <div className="content-card">
          <div className="empty-state">
            {error || "Challan not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="details-card">

        <div className="details-header">

          <div>
            <h1>Challan Details</h1>
            <p>
              View challan information and products.
            </p>
          </div>

          <Link to="/challans">
            <button>
              Back
            </button>
          </Link>

        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="details-grid">

          <div className="detail-item">
            <span className="detail-label">
              Challan Number
            </span>

            <span className="detail-value">
              {challan.challanNumber}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Customer
            </span>

            <span className="detail-value">
              {challan.customer?.customerName || "-"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Business
            </span>

            <span className="detail-value">
              {challan.customer?.businessName || "-"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Status
            </span>

            <span
              className={`status-badge ${
                challan.status === "CONFIRMED"
                  ? "success"
                  : "warning"
              }`}
            >
              {challan.status}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Total Quantity
            </span>

            <span className="detail-value">
              {challan.totalQuantity}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Created By
            </span>

            <span className="detail-value">
              {challan.createdBy?.name || "-"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              Created
            </span>

            <span className="detail-value">
              {new Date(
                challan.createdAt
              ).toLocaleString()}
            </span>
          </div>

        </div>

        <h2>Products</h2>

        <div className="table-container">

          <table className="data-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>

            <tbody>

              {challan.items.map((item) => (
                <tr key={item.id}>

                  <td>
                    <strong>
                      {item.productName}
                    </strong>
                  </td>

                  <td>
                    {item.sku}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    ₹{Number(
                      item.unitPrice
                    ).toFixed(2)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {challan.status === "DRAFT" && (
          <div className="form-actions">
            <button
              className="primary-button"
              onClick={handleConfirm}
            >
              ✓ Confirm Challan
            </button>
          </div>
        )}

        {challan.status === "CONFIRMED" && (
          <div className="confirmed-message">
            ✓ Challan confirmed and stock deducted.
          </div>
        )}

      </div>

    </div>
  );
};

export default ChallanDetails;