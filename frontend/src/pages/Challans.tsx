import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Challan } from "../types/challan";

const Challans = () => {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChallans = async () => {
    try {
      setLoading(true);

      const response = await api.get("/challans");

      setChallans(
        response.data.data?.challans ||
          response.data.data ||
          []
      );
    } catch (error) {
      console.error("Failed to fetch challans", error);
      setChallans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1>Sales Challans</h1>

        <Link to="/challans/add">
          <button>Create Challan</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading challans...</p>
      ) : challans.length === 0 ? (
        <p>No challans found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Challan No.</th>
              <th>Customer</th>
              <th>Total Quantity</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {challans.map((challan) => (
              <tr key={challan.id}>
                <td>{challan.challanNumber}</td>

                <td>
                  {challan.customer?.customerName ||
                    "-"}
                </td>

                <td>{challan.totalQuantity}</td>

                <td>{challan.status}</td>

                <td>
                  {challan.createdBy?.name || "-"}
                </td>

                <td>
                  {new Date(
                    challan.createdAt
                  ).toLocaleString()}
                </td>

                <td>
                  <Link
                    to={`/challans/${challan.id}`}
                  >
                    <button>View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Challans;