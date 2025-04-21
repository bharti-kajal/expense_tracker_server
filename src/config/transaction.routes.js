import express from "express";
const transactionRouter = express.Router();
import TransactionController from "../features/controllers/transaction.controller.js";
import Auth from '../features/middlewares/auth.middleware.js';

const transactionController = new TransactionController();

transactionRouter.get("/", Auth, (req, res) => {
  transactionController.get(req, res);
});

transactionRouter.post("/add", Auth, (req, res) => {
  transactionController.add(req, res);
});

transactionRouter.post("/update", Auth, (req, res) => {
  transactionController.update(req, res);
});

transactionRouter.post("/delete", Auth, (req, res) => {
  transactionController.delete(req, res);
});

export default transactionRouter;
