import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    sku: "",
    category: "",
    unitPrice: "",
    minimumStockQuantity: "",
    warehouseLocation: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        const product = response.data.data;

        setForm({
          productName: product.productName,
          sku: product.sku,
          category: product.category,
          unitPrice: String(product.unitPrice),
          minimumStockQuantity: String(
            product.minimumStockQuantity
          ),
          warehouseLocation:
            product.warehouseLocation,
        });
      } catch (error) {
        console.error(error);
        setError("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

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
      await api.put(`/products/${id}`, {
        productName: form.productName,
        sku: form.sku,
        category: form.category,
        unitPrice: Number(form.unitPrice),
        minimumStockQuantity: Number(
          form.minimumStockQuantity
        ),
        warehouseLocation: form.warehouseLocation,
      });

      navigate("/products");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px" }}>
      <h1>Edit Product</h1>

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
          value={form.unitPrice}
          onChange={handleChange}
          required
        />

        <input
          name="minimumStockQuantity"
          type="number"
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
          <button type="submit">
            Update Product
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

export default EditProduct;