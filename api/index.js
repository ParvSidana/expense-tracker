import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./db/index.js";
import { Transaction } from "./models/transaction.model.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const port = 5000;

app.get("/", (req, res) => {
  res.send("hello world");
});

await dbConnect();

app.post("/api/transaction", async (req, res) => {
  try {
    const { amount, date, description } = req.body;
    const transaction = await Transaction.create({
      amount,
      date,
      description,
    });

    if (!transaction) throw new Error("Transaction creation was unsuccessful");

    res.status(200).json(transaction);
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json(error);
  }

  // res.json(req.body);
});

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });
    // console.log(transactions);  array of docs

    if (!transactions) throw new Error("No Transaction found");
    res.status(201).json(transactions);
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json(error);
  }
});

app.delete("/api/transaction/:id", async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const response = await Transaction.findByIdAndDelete(transactionId);
    if (!response) throw new Error("Transaction not found");

    res.status(201).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port} `);
});
