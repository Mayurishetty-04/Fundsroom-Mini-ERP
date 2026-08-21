
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import customerRoutes from "./routes/customer.routes";
import productRoutes from "./routes/product.routes";
import stockMovementRoutes from "./routes/stockMovement.routes";
import challanRoutes from "./routes/challan.routes";
import locationRoutes from "./routes/location.routes";
import batchRoutes from "./routes/batch.routes";
import inventoryStockRoutes from "./routes/inventoryStock.routes";
import workOrderRoutes from "./routes/workOrder.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fundsroom ERP API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use(
  "/api/stock-movements",
  stockMovementRoutes
);
app.use("/api/challans", challanRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/inventory-stock", inventoryStockRoutes);
app.use("/api/work-orders", workOrderRoutes);

export default app;