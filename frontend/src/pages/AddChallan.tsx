import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Product } from "../types/product";

interface Customer {
  id: string;
  customerName: string;
  businessName?: string;
}

interface ChallanItemForm {
  productId: string;
  quantity: number;
}

const AddChallan = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState<ChallanItemForm[]>([
    {
      productId: "",
      quantity: 1,
    },
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerResponse, productResponse] =
          await Promise.all([
            api.get("/customers"),
            api.get("/products"),
          ]);

        setCustomers(
          customerResponse.data.data?.customers ||
            customerResponse.data.data ||
            []
        );

        setProducts(
          productResponse.data.data?.products ||
            productResponse.data.data ||
            []
        );
      } catch (error) {
        console.error(error);
        setError("Failed to load customers/products");
      }
    };

    loadData();
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        quantity: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;

    setItems(
      items.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  const updateItem = (
    index: number,
    field: keyof ChallanItemForm,
    value: string | number
  ) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]:
        field === "quantity"
          ? Number(value)
          : value,
    };

    setItems(updated);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/challans", {
        customerId,
        items,
      });

      navigate("/challans");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to create challan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Create Sales Challan</h1>
          <p>Select a customer and add products to create a draft challan.</p>
        </div>
      </div>

      <div className="challan-form-card">

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="challan-customer form-group">

            <label>Customer *</label>

            <select
              className="form-control"
              value={customerId}
              onChange={(e) =>
                setCustomerId(e.target.value)
              }
              required
            >
              <option value="">
                Select Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.customerName}
                  {customer.businessName
                    ? ` - ${customer.businessName}`
                    : ""}
                </option>
              ))}
            </select>

          </div>

          <div className="challan-items">

            <div className="page-header">
              <div>
                <h2>Products</h2>
                <p>Add one or more products to this challan.</p>
              </div>

              <button
                type="button"
                onClick={addItem}
              >
                + Add Product
              </button>
            </div>

            <div className="challan-item-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Action</span>
            </div>

            {items.map((item, index) => (
              <div
                className="challan-item"
                key={index}
              >

                <select
                  className="form-control"
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "productId",
                      e.target.value
                    )
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
                      {product.productName} -{" "}
                      {product.sku} (Stock:{" "}
                      {product.currentStock})
                    </option>
                  ))}
                </select>

                <input
                  className="form-control"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    removeItem(index)
                  }
                  disabled={items.length === 1}
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Draft Challan"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/challans")
              }
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddChallan;