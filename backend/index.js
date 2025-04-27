import express from "express";

const port = 3000;
const app = express();
app.use(express.json());

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

// Define your routes
app.put("/sales-data/:id", (req, res) => {
 try {
    // Example logic for updating sales data
    const { id } = req.params;
    const { isPaid } = req.body;

    // Replace this with actual database/service logic
    const updatedData = {
      id,
      isPaid,
      isClaimed: false, // Ensure all required fields are included
    };

    res.status(200).send(updatedData);
  } catch (error) {
    console.error(`Error in PUT /sales-data/${req.params.id}:`, error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.put("/admin/sales-data/:id", (req, res) => {
  // Example admin route logic
  res.status(200).send({ id: req.params.id, ...req.body });
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

app.listen(port, () => console.log(`Server is listening on port ${port}`));

export default app;