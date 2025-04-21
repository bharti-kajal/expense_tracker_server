import express from "express";
const accountRouter = express.Router();
import AccountController from "../features/controllers/account.controller.js";
import Auth from '../features/middlewares/auth.middleware.js';

const accountController = new AccountController();

accountRouter.get("/", Auth, (req, res) => {
  accountController.get(req, res);
});

accountRouter.post("/add", Auth, (req, res) => {
  accountController.add(req, res);
});

accountRouter.post("/addMoney", Auth, (req, res) => {
  accountController.addMoneyToAccount(req, res);
});

accountRouter.post("/transaferToAccount", Auth, (req, res) => {
  accountController.transferAccount(req, res);
});


accountRouter.post("/update", Auth,  (req, res) => {
  accountController.update(req, res);
});

accountRouter.post("/delete", Auth, (req, res) => {
  accountController.delete(req, res);
});

export default accountRouter;
