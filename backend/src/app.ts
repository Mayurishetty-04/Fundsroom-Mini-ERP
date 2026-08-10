
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import customerRoutes from "./routes/customer.routes";


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

export default app;