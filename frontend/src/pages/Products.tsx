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
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Products & Inventory</h1>
          <p>Manage products, pricing and inventory levels.</p>
        </div>

        <div className="page-actions">
          <Link to="/products/add">
            <button className="primary-button">
              + Add Product
            </button>
          </Link>

          <Link to="/stock-movements">
            <button>
              Stock Movements
            </button>
          </Link>
        </div>
      </div>

      <div className="content-card">

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search product, SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            No products found.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">

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

                      <td>
                        <strong>
                          {product.productName}
                        </strong>
                      </td>

                      <td>{product.sku}</td>

                      <td>{product.category}</td>

                      <td>
                        ₹{Number(product.unitPrice).toFixed(2)}
                      </td>

                      <td>
                        <strong>
                          {product.currentStock}
                        </strong>
                      </td>

                      <td>{product.warehouseLocation}</td>

                      <td>
                        {lowStock ? (
                          <span className="status-badge warning">
                            ⚠ Low Stock
                          </span>
                        ) : (
                          <span className="status-badge success">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td>
                        <Link
                          to={`/products/${product.id}/edit`}
                        >
                          <button className="small-button">
                            Edit
                          </button>
                        </Link>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;