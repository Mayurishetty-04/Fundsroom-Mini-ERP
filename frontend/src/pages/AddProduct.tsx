import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    sku: "",
    category: "",
    unitPrice: "",
    currentStock: "0",
    minimumStockQuantity: "0",
    warehouseLocation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/products", {
        ...form,
        unitPrice: Number(form.unitPrice),
        currentStock: Number(form.currentStock),
        minimumStockQuantity: Number(
          form.minimumStockQuantity
        ),
      });

      navigate("/products");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Add Product</h1>
          <p>Create a new product and define its inventory settings.</p>
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
              <label>Product Name *</label>
              <input
                name="productName"
                placeholder="Enter product name"
                value={form.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>SKU *</label>
              <input
                name="sku"
                placeholder="e.g. KB-001"
                value={form.sku}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                name="category"
                placeholder="Enter category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Unit Price *</label>
              <input
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.unitPrice}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Initial Stock *</label>
              <input
                name="currentStock"
                type="number"
                min="0"
                placeholder="0"
                value={form.currentStock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Minimum Stock Quantity *</label>
              <input
                name="minimumStockQuantity"
                type="number"
                min="0"
                placeholder="0"
                value={form.minimumStockQuantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Warehouse Location *</label>
              <input
                name="warehouseLocation"
                placeholder="e.g. Warehouse A"
                value={form.warehouseLocation}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;