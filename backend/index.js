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

app.listen(port, () => console.log(`Server is listening on port ${port}`));
