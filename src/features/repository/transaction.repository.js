import TransactionModel from '../models/transaction.model.js';
import mongoose from 'mongoose';
class TransactionRepository {

  async get(userId, limit=0) {
    try{
        return await TransactionModel.find({"userId": userId}).limit(limit);
    }catch(err){
      console.log("Error", err);
    }
  }

  async add(insertData) {
    try {
      const transaction = new TransactionModel(insertData);
      return await transaction.save();
    } catch (err) {
      console.log("Error", err);
    }
  }

  async update(userId, updateData) {
    try {
      return await TransactionModel.findByIdAndUpdate(userId, updateData);
    } catch (err) {
      console.log("Error", err);
    }
  }

  async findById(id){
    try{
      return await TransactionModel.findOne({"_id": id}).select("amount");
    }catch(err){
      console.log("Error ", err);
    }
  }

  async dashboard(userId) {
    try {
      // Convert userId to ObjectId
      const objectId = new mongoose.Types.ObjectId(userId);
  
      // Aggregation pipeline
      const result = await TransactionModel.aggregate([
        { 
          $match: { userId: objectId } 
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $toDouble: "$amount" } },
            incomeAmount: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "income"] },
                  { $toDouble: "$amount" },
                  0
                ]
              }
            },
            expenseAmount: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "expense"] },
                  { $toDouble: "$amount" },
                  0
                ]
              }
            }
          }
        }
      ]);
  
      // Check if result exists
      if (result.length > 0) {
        // Return the values in an object
        return {
          totalAmount: result[0].totalAmount,
          incomeAmount: result[0].incomeAmount,
          expenseAmount: result[0].expenseAmount
        };
      } else {
        // Return 0s in an object if no data found
        return {
          totalAmount: 0,
          incomeAmount: 0,
          expenseAmount: 0
        };
      }
      
    } catch (error) {
      console.log("Error:", error);
  
      // Return 0s in array format on error
      return {
        totalAmount: 0,
        incomeAmount: 0,
        expenseAmount: 0
      };
    }
  }
  
  
  
  
  
}

export default TransactionRepository;

