import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    lastLogin:{type:Date,default:Date.now},
    isVerified:{type:Boolean,default:false},
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date
},{timestamps:true}); 

const authModel = mongoose.models.auth || mongoose.model('auth', authSchema);
export default authModel;
