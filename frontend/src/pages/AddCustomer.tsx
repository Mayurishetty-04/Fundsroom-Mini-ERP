import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddCustomer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "RETAIL",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/customers", form);

      navigate("/customers");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to add customer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Add Customer</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="customerName"
            placeholder="Customer Name"
            value={form.customerName}
            onChange={handleChange}
            required
          />

          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="businessName"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
          />

          <input
            name="gstNumber"
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={handleChange}
          />

          <select
            name="customerType"
            value={form.customerType}
            onChange={handleChange}
          >
            <option value="RETAIL">Retail</option>
            <option value="WHOLESALE">Wholesale</option>
          </select>

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Customer"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;