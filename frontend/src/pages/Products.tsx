import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Product } from "../types/product";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products", {
        params: { search },
      });

      setProducts(
        response.data.data?.products ||
        response.data.data ||
        []
      );
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

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
        <h1>Products & Inventory</h1>

        <div>
          <Link to="/products/add">
            <button>Add Product</button>
          </Link>

          <Link to="/stock-movements">
            <button style={{ marginLeft: "10px" }}>
              Stock Movements
            </button>
          </Link>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search product, SKU or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "350px",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
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
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Warehouse</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const lowStock =
                product.currentStock <=
                product.minimumStockQuantity;

              return (
                <tr key={product.id}>
                  <td>{product.productName}</td>

                  <td>{product.sku}</td>

                  <td>{product.category}</td>

                  <td>₹{Number(product.unitPrice).toFixed(2)}</td>

                  <td>{product.currentStock}</td>

                  <td>{product.warehouseLocation}</td>

                  <td>
                    {lowStock ? (
                      <span>⚠ Low Stock</span>
                    ) : (
                      <span>In Stock</span>
                    )}
                  </td>

                  <td>
                    <Link to={`/products/${product.id}/edit`}>
                      <button>Edit</button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;