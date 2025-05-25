import express from "express";
import cors from "cors";

import jobOrderRoutes from "./routes/jobOrder.js";
import salesRoutes from "./routes/salesRoutes.js";
import userRoutes from "./routes/user.js";
import branchRoutes from "./routes/branch.js";
import productRoutes from "./routes/product.js";
import authRoutes from "./routes/authentication.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", salesRoutes);
app.use("/user", userRoutes);
app.use("/job-order", jobOrderRoutes);
app.use("/branch", branchRoutes);
app.use("/product", productRoutes);
app.use("/auth", authRoutes);

export default app;
