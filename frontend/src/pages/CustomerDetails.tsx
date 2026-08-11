import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import type { Customer } from "../types/customer";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] =
    useState("");

  const [savingFollowUp, setSavingFollowUp] =
    useState(false);

  const fetchCustomer = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/customers/${id}`
      );

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

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleAddFollowUp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!note.trim()) {
      return;
    }

    try {
      setSavingFollowUp(true);
      setError("");

      await api.post(
        `/customers/${id}/followups`,
        {
          note,
          followUpDate: followUpDate
            ? new Date(followUpDate).toISOString()
            : undefined,
        }
      );

      setNote("");
      setFollowUpDate("");

      await fetchCustomer();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to add follow-up"
      );
    } finally {
      setSavingFollowUp(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        Loading...
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="page-container">
        <p className="error">
          {error || "Customer not found"}
        </p>

        <button
          onClick={() =>
            navigate("/customers")
          }
        >
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
          <span>
            {customer.businessName || "-"}
          </span>
        </div>

        <div className="detail-row">
          <strong>GST Number:</strong>
          <span>
            {customer.gstNumber || "-"}
          </span>
        </div>

        <div className="detail-row">
          <strong>Customer Type:</strong>
          <span>{customer.customerType}</span>
        </div>

        <div className="detail-row">
          <strong>Status:</strong>
          <span>{customer.status}</span>
        </div>

        <div className="detail-row">
          <strong>Address:</strong>
          <span>{customer.address || "-"}</span>
        </div>

        <div className="detail-row">
          <strong>Next Follow-up:</strong>
          <span>
            {customer.followUpDate
              ? new Date(
                  customer.followUpDate
                ).toLocaleDateString()
              : "-"}
          </span>
        </div>

        <div className="details-actions">
          <Link
            to={`/customers/${customer.id}/edit`}
          >
            <button>Edit Customer</button>
          </Link>

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/customers")
            }
          >
            Back
          </button>
        </div>
      </div>

      {/* Follow-up section */}

      <div
        className="details-card"
        style={{ marginTop: "20px" }}
      >
        <h2>Add Follow-up</h2>

        {error && (
          <p className="error">{error}</p>
        )}

        <form onSubmit={handleAddFollowUp}>
          <textarea
            placeholder="Enter follow-up notes..."
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            required
            rows={4}
            style={{
              width: "100%",
              marginBottom: "12px",
            }}
          />

          <input
            type="datetime-local"
            value={followUpDate}
            onChange={(e) =>
              setFollowUpDate(e.target.value)
            }
            style={{
              marginBottom: "12px",
            }}
          />

          <br />

          <button
            type="submit"
            disabled={savingFollowUp}
          >
            {savingFollowUp
              ? "Saving..."
              : "Add Follow-up"}
          </button>
        </form>
      </div>

      {/* Follow-up history */}

      <div
        className="details-card"
        style={{ marginTop: "20px" }}
      >
        <h2>Follow-up History</h2>

        {!customer.followUps ||
        customer.followUps.length === 0 ? (
          <p>No follow-ups yet.</p>
        ) : (
          customer.followUps.map((followUp) => (
            <div
              key={followUp.id}
              style={{
                borderBottom:
                  "1px solid #ddd",
                padding: "12px 0",
              }}
            >
              <p>
                <strong>Note:</strong>{" "}
                {followUp.note}
              </p>

              <p>
                <strong>Follow-up Date:</strong>{" "}
                {followUp.followUpDate
                  ? new Date(
                      followUp.followUpDate
                    ).toLocaleString()
                  : "-"}
              </p>

              <p>
                <strong>Added By:</strong>{" "}
                {followUp.createdBy?.name ||
                  "-"}
              </p>

              <small>
                Added on{" "}
                {new Date(
                  followUp.createdAt
                ).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default CustomerDetails;