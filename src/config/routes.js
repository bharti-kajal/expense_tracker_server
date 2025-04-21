import express from "express";
const router = express.Router();
import UserController from "../features/controllers/user.controller.js";
import Auth from "../features/middlewares/auth.middleware.js";
import accountRouter from "./account.routes.js";
import transactionRouter from "./transaction.routes.js";
import { upload } from "../features/middlewares/file-upload.middleware.js";

const userController = new UserController();

router.use("/account", accountRouter);
router.use("/transaction", transactionRouter);
router.post("/sign-up", (req, res) => {
  userController.signUp(req, res);
});

router.post("/sign-in", (req, res) => {
  userController.signIn(req, res);
});

router.get("/logout", (req, res) => {
  userController.logout(req, res);
});

router.post("/forgot-password", (req, res) => {
  userController.forgotPassword(req, res);
});

router.post("/reset-password", (req, res) => {
  userController.changePassword(req, res);
});

router.post("/check-email", (req, res) => {
  userController.cheakEmail(req, res);
});

router.get("/dashboard", Auth, (req, res) => {
  userController.dashboard(req, res);
});

router.post("/profile", Auth, upload.single("profileImage"), (req, res) => {
  userController.userProfile(req, res);
});

export default router;
