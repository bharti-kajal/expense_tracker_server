import "dotenv/config";
import UserRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../../helper/email.js";
import ejs from "ejs";
import path from "path";
import TransactionRepository from "../repository/transaction.repository.js";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async signUp(req, res) {
    try {
      console.log("Request body:", req.body);
      const { name, email, password, confirm_password } = req.body;

      // Basic validation
      if (!name || !email || !password || !confirm_password) {
        return res
          .status(400)
          .json({ status: false, message: "All fields are required!" });
      }
      if (password !== confirm_password) {
        return res
          .status(400)
          .json({ status: false, message: "Passwords do not match!" });
      }

      // Check if the user already exists
      const existingUser = await this.userRepository.findbyEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ status: false, message: "Email already in use!" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user
      const userData = { name, email, password: hashedPassword };
      const result = await this.userRepository.create(userData);

      // Send Email
      const emailTemplatePath = path.join(
        path.resolve("src", "features", "templates", "welcome.ejs")
      );

      const link = `${process.env.WEB_URL}`;
      const htmlContent = await ejs.renderFile(emailTemplatePath, {
        name: name,
        email,
        link,
        password,
      });

      await sendResetEmail(
        email,
        "Welcome to Our Community – Your Account is Ready!",
        htmlContent
      );
      // End Send Email

      return res.status(201).json({
        status: true,
        message: "User signed up successfully!",
        user: userData,
      });
    } catch (err) {
      console.error("Signup Error:", err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }

  async signIn(req, res) {
    try {
      console.log("req.body", req.body);
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: false, message: "All fields are required!" });
      }

      // 1. check if email found or not
      const emailExist = await this.userRepository.findbyEmail(email);
      if (emailExist) {
        // Match the password
        const match = await bcrypt.compare(password, emailExist.password);
        if (match) {
          const token = jwt.sign(
            {
              userId: emailExist._id,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );
          console.log("token", token);
          return res.status(200).json({ status: true, token: token });
        } else {
          return res
            .status(400)
            .json({ status: false, message: "Invalid Credentials" });
        }
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Credentials" });
      }
    } catch (err) {
      throw err;
      console.log("Error", err);

      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      console.log("Api Body", req.body);
      const user = await this.userRepository.findbyEmail(email);
      console.log("user", user);
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Email does not exist in our database",
        });
      }

      console.log("name", user);
      const name = user.name;

      // 1. create Reset Token
      const resetToken = jwt.sign(
        { email: email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const emailTemplatePath = path.join(
        path.resolve("src", "features", "templates", "reset_email.ejs")
      );

      const resetLink = `${process.env.WEB_URL}/reset-password/${resetToken}`;

      const htmlContent = await ejs.renderFile(emailTemplatePath, {
        name: user.name,
        email,
        resetLink,
      });

      // Send Email
      await sendResetEmail(email, "Password Reset Request", htmlContent);
      return res
        .status(200)
        .json({ status: true, message: "Reset email sent successfully!" });
    } catch (err) {
      console.log("Err", err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }

  async changePassword(req, res) {
    try {
      const { password, confirm_password } = req.body;
      const token = req.headers.authorization?.split(" ")[1];
      console.log("Token", token);
      if (!token) {
        return res
          .status(401)
          .json({ status: false, message: "Authorization token is required" });
      }

      if (password !== confirm_password) {
        return res
          .status(400)
          .json({ status: false, message: "Passwords do not match" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const emailExist = await this.userRepository.findbyEmail(decoded.email);

      if (!emailExist) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid or expired token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update Password in DB
      await this.userRepository.update(emailExist._id, {
        password: hashedPassword,
      });

      // Send Email
      const emailTemplatePath = path.join(
        path.resolve("src", "features", "templates", "change_password.ejs")
      );

      const htmlContent = await ejs.renderFile(emailTemplatePath, {
        name: emailExist.name,
      });

      await sendResetEmail(
        emailExist.email,
        "Your Password Has Been Successfully Changed",
        htmlContent
      );
      // End Send Email

      return res
        .status(200)
        .json({ status: true, message: "Password changed successfully" });
    } catch (err) {
      console.error("Error:", err);
      return res
        .status(400)
        .json({ status: false, message: "Invalid or expired token" });
    }
  }

  async cheakEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const existingUser = await this.userRepository.findbyEmail(email);
      if (existingUser) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async logout(req, res) {
    try {
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  }

  // Dashboard
  async dashboard(req, res) {
    try {

      // Last 10 Transactions 
      const transactions = await this.transactionRepository.get(req.userId, 10);
      
      // Total Balance
      const totalIncome = await this.transactionRepository.dashboard(req.userId); 
      
      console.log("totalIncome", totalIncome);

      res.status(200).json({ status: true, transactions, totalIncome  }); 
    } catch (err) {
      console.log("error", err);
    }
  }
  // End

  // Profile Update
  async userProfile(req, res) {
    try {

      const userId = req.userId;
      console.log(userId, "userId");
     
      // 1.Start User Exists in DB
      const user = await this.userRepository.findById(req.userId);
      if(!user){
        return res.status(400).json({status: false, message: "user Not Found in our DB"});
      } 
      // End 
      
      const { name, email, contact, country } = req.body;
      const profileImage = req.file?.filename;
      const result = await this.userRepository.update(userId, {name, email, contact, country, profileImage});
     
      if(result)
      {
        return res.status(200).json({status: true, message: "User Profile Updated Successfully!", data: { name, email, contact, country, profileImage }});
      }else{
        return res.status(400).json({status: false, message: "Something when wrong!"});
      }
    } catch (err) {
      console.log("error", err);
    }
  }
  // End


}

export default UserController;
