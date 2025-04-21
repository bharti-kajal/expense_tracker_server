import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 3
    },
    email:{
        type: String,
        required: true,
        min: 3
    },
    password:{
        type: String
    },
    contact: {
        type: String
    },
    country:{
        type: String
    },
    profileImage:{
        type: String
    }
}, {timestamps: true});

const UserModel = mongoose.model('user', userSchema);
export default UserModel;
