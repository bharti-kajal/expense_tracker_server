import mongoose from 'mongoose';
const { Schema } = mongoose;

const transactionSchema = new mongoose.Schema({
    account:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    amount:{
        type:String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId, ref: 'user'
    },
    type:{
        type:String,
        required:true
    }
}, {timestamps: true});

const TransactionModel = mongoose.model('transaction', transactionSchema);
export default TransactionModel;
