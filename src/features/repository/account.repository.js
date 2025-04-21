import AccountModel from "../models/account.model.js";

class AccountRepository {
  
  async get(userId) {
    try {
      return await AccountModel.find({ status: 1, userId: userId });
    } catch (err) {
      console.log("Error", err);
    }
  }

  async add(insertData) {
    try {
      const account = new AccountModel(insertData);
      return await account.save();
    } catch (err) {
      console.log("Error", err);
    }
  }

  async update(userId, updateData) {
    try {
      return await AccountModel.findByIdAndUpdate(userId, updateData);
    } catch (err) {
      console.log("Error", err);
    }
  }

  async findById(id) {
    try {
      return await AccountModel.findOne({ _id: id }).select("amount");
    } catch (err) {
      console.log("Error ", err);
    }
  }
}

export default AccountRepository;
