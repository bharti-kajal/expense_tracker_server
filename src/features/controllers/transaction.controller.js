import TransactionRepository from "../repository/transaction.repository.js";

class TransactionController {
  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async get(req, res) {

    // get List of all Transaction
    try {
      const userId = req.userId;
      const transaction = await this.transactionRepository.get(userId);
      return res.status(200).json({ status: true, transaction: transaction });
    } catch (err) {
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
    // End

  }

  async add(req, res) {
    try {
      const userId = req.userId;
      const { account, description, amount, type } = req.body;
      const insertData = { account, description, amount, userId, type };
      const result = this.transactionRepository.add(insertData);
      if (result) {
        res
          .status(201)
          .json({
            status: true,
            message: "Transaction Inserted Successfully!",
          });
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

  async update() {
    try {
    } catch (err) {}
  }

  async delete() {
    try {
    } catch (err) {}
  }
}

export default TransactionController;
