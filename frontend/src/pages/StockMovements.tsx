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
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Stock Movements</h1>
          <p>Track inventory additions and deductions.</p>
        </div>

        <Link to="/products">
          <button>Back to Products</button>
        </Link>
      </div>

      <div className="movement-form-card">

        <h2>Record Stock Movement</h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="movement-form-grid">

            <div className="form-group">
              <label>Product</label>

              <select
                className="form-control"
                value={form.productId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    productId: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select Product
                </option>

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
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                className="form-control"
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
            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                className="form-control movement-type"
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
            </div>

            <div className="form-group">
              <label>Reason</label>

              <input
                className="form-control"
                type="text"
                placeholder="Reason for movement"
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value,
                  })
                }
                required
              />
            </div>

            <button type="submit">
              Record
            </button>

          </div>

        </form>
      </div>

      <div className="content-card">

        <h2>Movement History</h2>

        {movements.length === 0 ? (
          <div className="empty-state">
            No stock movements found.
          </div>
        ) : (
          <div className="table-container">

            <table className="data-table">

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
                      <strong>
                        {movement.product?.productName || "-"}
                      </strong>
                    </td>

                    <td>
                      {movement.product?.sku || "-"}
                    </td>

                    <td>{movement.quantity}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          movement.movementType === "IN"
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {movement.movementType}
                      </span>
                    </td>

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

          </div>
        )}

      </div>

    </div>
  );
};

export default StockMovements;