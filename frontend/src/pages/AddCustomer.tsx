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
        error.response?.data?.message ||
          "Failed to add customer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Add Customer</h1>
          <p>Create a new customer record.</p>
        </div>
      </div>

      <div className="form-card">

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Customer Name *</label>
              <input
                name="customerName"
                placeholder="Enter customer name"
                value={form.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile *</label>
              <input
                name="mobile"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="customer@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Business Name</label>
              <input
                name="businessName"
                placeholder="Enter business name"
                value={form.businessName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>GST Number</label>
              <input
                name="gstNumber"
                placeholder="Enter GST number"
                value={form.gstNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Customer Type *</label>
              <select
                name="customerType"
                value={form.customerType}
                onChange={handleChange}
              >
                <option value="RETAIL">Retail</option>
                <option value="WHOLESALE">Wholesale</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <input
                name="address"
                placeholder="Enter customer address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/customers")}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddCustomer;