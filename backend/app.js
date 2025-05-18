import express from "express";
import jobOrderRoutes from "./routes/jobOrder.js";
import salesRoutes from "./routes/salesRoutes.js";
import userRoutes from "./routes/user.js";
import branchRoutes from "./routes/branch.js";
import productRoutes from "./routes/product.js";
import authRoutes from "./routes/authentication.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", salesRoutes);
app.use("/user", userRoutes);
app.use("/job-order", jobOrderRoutes);
app.use("/branch", branchRoutes);
app.use("/product", productRoutes);
app.use("/auth", authRoutes);

app.get("/", async (req, res) => {
    try {
        res.status(200).send({
            type: "GET",
            message: "Successfully received GET request.",
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

app.post("/", async (req, res) => {
    try {
        res.status(200).send({
            type: "POST",
            message: "Successfully received POST request.",
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

app.put("/", async (req, res) => {
    try {
        res.status(200).send({
            type: "PUT",
            message: "Successfully received PUT request.",
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

app.delete("/", async (req, res) => {
    try {
        res.status(200).send({
            type: "DELETE",
            message: "Successfully received DELETE request.",
        });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

export default app;
