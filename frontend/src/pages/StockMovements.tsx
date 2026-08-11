import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type {
  Product,
  StockMovement,
} from "../types/product";

const StockMovements = () => {
  const [movements, setMovements] = useState<
    StockMovement[]
  >([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    movementType: "IN",
    reason: "",
  });

  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [movementResponse, productResponse] =
        await Promise.all([
          api.get("/stock-movements"),
          api.get("/products"),
        ]);

      setMovements(
        movementResponse.data.data || []
      );

      setProducts(
        productResponse.data.data?.products ||
        productResponse.data.data ||
        []
      );
    } catch (error) {
      console.error(error);
      setError("Failed to load inventory data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/stock-movements", {
        productId: form.productId,
        quantity: Number(form.quantity),
        movementType: form.movementType,
        reason: form.reason,
      });

      setForm({
        productId: "",
        quantity: "",
        movementType: "IN",
        reason: "",
      });

      await fetchData();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to create stock movement"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
        <h1>Stock Movements</h1>

        <Link to="/products">
          <button>Back to Products</button>
        </Link>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Record Stock Movement</h2>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <select
            value={form.productId}
            onChange={(e) =>
              setForm({
                ...form,
                productId: e.target.value,
              })
            }
            required
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.productName} ({product.sku}) -
                Stock: {product.currentStock}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
            required
          />

          <select
            value={form.movementType}
            onChange={(e) =>
              setForm({
                ...form,
                movementType: e.target.value,
              })
            }
          >
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>

          <input
            type="text"
            placeholder="Reason"
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }
            required
          />

          <button type="submit">
            Record Movement
          </button>
        </form>
      </div>

      <h2>Movement History</h2>

      {movements.length === 0 ? (
        <p>No stock movements found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Created By</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td>
                  {movement.product?.productName || "-"}
                </td>

                <td>
                  {movement.product?.sku || "-"}
                </td>

                <td>{movement.quantity}</td>

                <td>{movement.movementType}</td>

                <td>{movement.reason}</td>

                <td>
                  {movement.createdBy?.name || "-"}
                </td>

                <td>
                  {new Date(
                    movement.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockMovements;