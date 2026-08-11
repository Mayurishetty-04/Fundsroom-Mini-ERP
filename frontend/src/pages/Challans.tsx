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
    <div className="page-container">

      <div className="page-header">

        <div>
          <h1>Sales Challans</h1>
          <p>Create and manage sales challans.</p>
        </div>

        <Link to="/challans/add">
          <button className="primary-button">
            + Create Challan
          </button>
        </Link>

      </div>

      <div className="content-card">

        {loading ? (
          <div className="loading-state">
            Loading challans...
          </div>
        ) : challans.length === 0 ? (
          <div className="empty-state">
            No challans found.
          </div>
        ) : (
          <div className="table-container">

            <table className="data-table">

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

                    <td>
                      <strong>
                        {challan.challanNumber}
                      </strong>
                    </td>

                    <td>
                      {challan.customer?.customerName ||
                        "-"}
                    </td>

                    <td>{challan.totalQuantity}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          challan.status === "CONFIRMED"
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {challan.status}
                      </span>
                    </td>

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
                        <button className="small-button">
                          View
                        </button>
                      </Link>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Challans;