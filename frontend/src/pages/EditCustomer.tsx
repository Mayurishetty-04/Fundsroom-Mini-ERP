import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditCustomer() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/customers/${id}`);

        const customer =
          response.data.data?.customer ||
          response.data.data;

        setForm({
          customerName: customer.customerName || "",
          mobile: customer.mobile || "",
          email: customer.email || "",
          businessName: customer.businessName || "",
          gstNumber: customer.gstNumber || "",
          customerType: customer.customerType || "RETAIL",
          address: customer.address || "",
        });
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

    setSaving(true);
    setError("");

    try {
      await api.put(`/customers/${id}`, form);

      navigate(`/customers/${id}`);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to update customer"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Edit Customer</h1>

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

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Customer"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate(`/customers/${id}`)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCustomer;