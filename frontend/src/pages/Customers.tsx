import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Customer } from "../types/customer";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/customers", {
        params: {
          search,
          page,
          limit,
        },
      });

      setCustomers(
        response.data.data?.customers ||
          response.data.data ||
          []
      );
    } catch (error) {
      console.error("Failed to fetch customers", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, page]);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage customer relationships and information.</p>
        </div>

        <Link to="/customers/add">
          <button className="primary-button">
            + Add Customer
          </button>
        </Link>
      </div>

      <div className="content-card">

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search by customer, business or mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            No customers found.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Business</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.customerName}</strong>
                    </td>

                    <td>{customer.mobile}</td>

                    <td>{customer.email || "-"}</td>

                    <td>{customer.businessName || "-"}</td>

                    <td>
                      <span className="status-badge info">
                        {customer.customerType}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          customer.status === "ACTIVE"
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {customer.status || "-"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/customers/${customer.id}`}
                        >
                          <button className="small-button">
                            View
                          </button>
                        </Link>

                        <Link
                          to={`/customers/${customer.id}/edit`}
                        >
                          <button className="small-button">
                            Edit
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span className="page-number">
            Page {page}
          </span>

          <button
            disabled={customers.length < limit}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default Customers;