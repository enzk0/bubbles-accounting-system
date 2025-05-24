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

const apiRouter = express.Router();

apiRouter.use("/api", salesRoutes);
apiRouter.use("/user", userRoutes);
apiRouter.use("/job-order", jobOrderRoutes);
apiRouter.use("/branch", branchRoutes);
apiRouter.use("/product", productRoutes);
apiRouter.use("/auth", authRoutes);

app.use("/api", apiRouter);

export default app;
