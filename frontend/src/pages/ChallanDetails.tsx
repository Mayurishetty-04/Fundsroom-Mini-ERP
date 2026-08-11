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
      <div style={{ padding: "30px" }}>
        Loading...
      </div>
    );
  }

  if (!challan) {
    return (
      <div style={{ padding: "30px" }}>
        <p>{error || "Challan not found"}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Challan Details</h1>

        <Link to="/challans">
          <button>Back</button>
        </Link>
      </div>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <div style={{ marginBottom: "25px" }}>
        <p>
          <strong>Challan Number:</strong>{" "}
          {challan.challanNumber}
        </p>

        <p>
          <strong>Customer:</strong>{" "}
          {challan.customer?.customerName}
        </p>

        <p>
          <strong>Business:</strong>{" "}
          {challan.customer?.businessName || "-"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {challan.status}
        </p>

        <p>
          <strong>Total Quantity:</strong>{" "}
          {challan.totalQuantity}
        </p>

        <p>
          <strong>Created By:</strong>{" "}
          {challan.createdBy?.name || "-"}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {new Date(
            challan.createdAt
          ).toLocaleString()}
        </p>
      </div>

      <h2>Products</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
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
              <td>{item.productName}</td>
              <td>{item.sku}</td>
              <td>{item.quantity}</td>
              <td>
                ₹{Number(item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {challan.status === "DRAFT" && (
        <button
          onClick={handleConfirm}
          style={{ marginTop: "25px" }}
        >
          Confirm Challan
        </button>
      )}

      {challan.status === "CONFIRMED" && (
        <p style={{ marginTop: "25px" }}>
          ✅ Challan confirmed and stock deducted.
        </p>
      )}
    </div>
  );
};

export default ChallanDetails;