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
    <div style={{ padding: "30px", maxWidth: "600px" }}>
      <h1>Add Product</h1>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
          required
        />

        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          name="unitPrice"
          type="number"
          placeholder="Unit Price"
          value={form.unitPrice}
          onChange={handleChange}
          required
        />

        <input
          name="currentStock"
          type="number"
          placeholder="Initial Stock"
          value={form.currentStock}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          name="minimumStockQuantity"
          type="number"
          placeholder="Minimum Stock Quantity"
          value={form.minimumStockQuantity}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          name="warehouseLocation"
          placeholder="Warehouse Location"
          value={form.warehouseLocation}
          onChange={handleChange}
          required
        />

        <div style={{ marginTop: "20px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/products")}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;