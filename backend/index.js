import express from "express";
import { PORT } from "./config.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { mainProducts } from "./models/model.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("<h1>zoro</h1>");
});

app.post("/products", async (req, res) => {
  try {
    if (
      !req.body.category ||
      !req.body.brand ||
      !req.body.price ||
      !req.body.description ||
      !req.body.stock
    ) {
      return res.status(400).send({
        message: "error on post",
      });
    }

    const newProduct = {
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock,
    };

    const product = await mainProducts.create(newProduct);

    return res.status(200).send(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const allProduct = await mainProducts.find({});
    return res.status(200).json(allProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const singleProduct = await mainProducts.findById(id);

    return res.status(200).json(singleProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    if (
      !req.body.category ||
      !req.body.brand ||
      !req.body.price ||
      !req.body.description ||
      !req.body.stock
    ) {
      return res.status(400).send({
        message: "error on post",
      });
    }
    const { id } = req.params;

    const result = await mainProducts.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: "product not found" });
    }

    return res.status(200).send("updated successfully");
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

mongoose
  .connect(process.env.mongoURL)
  .then(() => {
    console.log("app is connected to the database");

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
