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

      setCustomers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, page]);

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
        <h1>Customers</h1>

        <Link to="/customers/add">
          <button>Add Customer</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          width: "300px",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
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
                <td>{customer.customerName}</td>
                <td>{customer.mobile}</td>
                <td>{customer.email}</td>
                <td>{customer.businessName}</td>
                <td>{customer.customerType}</td>
                <td>{customer.status}</td>

                <td>
                  <Link to={`/customers/${customer.id}`}>
                    <button>View</button>
                  </Link>

                  <Link to={`/customers/edit/${customer.id}`}>
                    <button style={{ marginLeft: "5px" }}>
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 15px" }}>
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
  );
};

export default Customers;