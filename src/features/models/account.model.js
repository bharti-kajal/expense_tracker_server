import mongoose, { Schema } from "mongoose";

const accountSchema = new mongoose.Schema({
    account_name:{
        type: String,
        required: true
    },
    account_number:{
        type: String,
        required: true
    },
    amount:{
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: 1
    },
    userId:{
        type: Schema.Types.ObjectId, ref: 'user'
    }
}, {timestamps: true});

const AccountModel = mongoose.model('account', accountSchema);
export default AccountModel;


