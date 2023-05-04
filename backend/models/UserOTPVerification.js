import mongoose from "mongoose";


const UserOTPVerfySchema = mongoose.Schema({      //defining a schema for the otp vrification
    userId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name:{
         type: String,
         required: true 
        },
    otp: { 
        type: String,
        required: true,
        unique: true 
    },
    email:  { 
        type: String, 
        required:true,
        unique: true 
    },
    createdAt: { 
        type: Date 
    },   
    expiresAt:{ 
        type: Date 
    },    
})

const OTPverify = mongoose.model("OTPverify",UserOTPVerfySchema);

export default OTPverify;

