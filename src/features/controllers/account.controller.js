import AccountRepository from "../repository/account.repository.js";

class AccountController {

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async get(req, res) {

    // get List of all account
    try {
      const userId = req.userId;
      const accounts = await this.accountRepository.get(userId);
      return res.status(200).json({ status: true, accounts: accounts });
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
    // End

  }

  // Insert Account Details
  async add(req, res) {
    try {
      const userId = req.userId;
      const { account_name, account_number, amount } = req.body;
      const insertData = { account_name, account_number, amount, userId };
      const result = this.accountRepository.add(insertData);
      if (result) {
        res
          .status(201)
          .json({ status: true, message: "Account Inserted Successfully!" });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Something Went Wrong" });
      }
    } catch (err) {
      console.log("Error:", err);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  }
  // End Account Details

  // Start Add Money to Account
  async addMoneyToAccount(req, res) {
    try {
      const userId = req.userId;
      const { accountId, amount } = req.body;
      //get Account data
      const account = await this.accountRepository.findById(accountId);
      const newAmount = parseFloat(account.amount) + parseFloat(amount);
      const result = this.accountRepository.update(accountId, {
        amount: newAmount,
      });
      if (result) {
        return res
          .status(200)
          .json({ status: true, message: "Amount Updated Successfully!" });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Something went wrong!" });
      }
    } catch (err) {
      console.log("Error", err);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  }
  // End Add Money To Account

  // Start Transfer Account
  async transferAccount(req, res) {
    try {
      const { toAccountId, fromAccountId, amount } = req.body;

      // Validate input
      if (!toAccountId || !fromAccountId || !amount) {
        return res
          .status(400)
          .json({ status: false, message: "Missing required fields" });
      }

      if (toAccountId === fromAccountId) {
        return res.status(400).json({
          status: false,
          message: "To and From Account must not be the same",
        });
      }

      const transferAmount = Number(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid transfer amount" });
      }

      // Get From Account
      const fromAccount = await this.accountRepository.findById(fromAccountId);
      if (!fromAccount) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid From Account" });
      }

      // Check balance
      if (Number(fromAccount.amount) < transferAmount) {
        return res.status(400).json({
          status: false,
          message: "Insufficient balance in From Account",
        });
      }

      // Get To Account
      const toAccount = await this.accountRepository.findById(toAccountId);
      if (!toAccount) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid To Account" });
      }

      // Update From Account (decrease amount)
      const updatedFromAmount = Number(fromAccount.amount) + transferAmount;
      await this.accountRepository.update(fromAccount, {
        amount: updatedFromAmount,
      });

      // Update To Account (increase amount)
      const updatedToAmount = Number(toAccount.amount) - transferAmount;
      await this.accountRepository.update(toAccount, {
        amount: updatedToAmount,
      });

      return res
        .status(200)
        .json({ status: true, message: "Transfer successful" });
    } catch (err) {
      console.error("Transfer Error:", err);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  }

  // End Transfer Account

  update(req, res) {
    try {
      console.log("req.body", req.body);
    } catch (err) {
      console.log("Error", error);
    }
  }

  async delete(req, res) {
    try {
      const { accountId } = req.body;

      // Find Account and Soft delete
      const account = await this.accountRepository.findById(accountId);
      if (!account) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid Account" });
      }

      const result = await this.accountRepository.update(accountId, {
        status: 0,
      });
      if (result) {
        return res
          .status(200)
          .json({ status: true, message: "Account Deleted Successfully!" });
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Something Went Wrong" });
      }
      // End
    } catch (err) {
      console.log("Error", err);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  }
}

export default AccountController;
