import { Request,Response } from "express";
// @ts-ignore 
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');

import userModal from "../modals/users";
import { EMAIL_FROM, FRONTEND_URL, JWT_SECRET_KEY } from "../config/envConfig";
import transporter from "../config/emailConfig";

export const registerUser = async(req:Request,res:Response)=>{
    const {name,email,password,tc} = req.body;
    const user = await userModal.findOne({email:email});
    if(user){
        return res.status(400).json({success:false,message:"Email already exists"})
    }
    else{
        if(name && password && tc && email){
            try{
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt)
                const doc = new userModal({
                    email:email,
                    name:name,
                    password:hashPassword,
                    tc:tc
                });
                await doc.save();
                const saved_user = await userModal.findOne({email:email})
                const token =  jwt.sign({userID:saved_user!._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
                return res.status(201).json({success:true,message:"Successfully Registered",token:token})
            }
            catch(error){
               return res.status(500).json({success:false , message:"Something went wrong"})
            }
        }else{
           return res.status(400).json({success:false, message:"All fields are required"})
        }
    }
}

export const loginUser = async(req:Request, res:Response)=>{
    const { email,password} = req.body;
    if(email && password){
        const user = await userModal.findOne({email});
        if(user ){
            const passwordMatched = await bcrypt.compare(password , user!.password);
            if(user.email === email && passwordMatched){
                const token = jwt.sign({userID:user._id} , process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
                return res.status(200).json({success:true,message:"Login Success" , token:token})
            }else{
                return res.status(400).json({success:false , message:"Email or Password is invalid"})
            }
        }else{
            return res.status(400).json({success:false , message:"Email is not registered"})
        }
    }else{
        return res.status(400).json({success:false , message:"All the fields are required"})
    }
}

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const changePassword = async(req:AuthenticatedRequest , res:Response)=>{
    const {password} = req.body;
    if(password){
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password , salt);
        await userModal.findByIdAndUpdate(req.user._id , {$set:{password:newHashPassword}});
        return res.status(200).send({success:true , message:"Successfully updated password"})
    }else{
        return res.status(400).send({success:false , message:"Password is required"})
    }
}

export const sendPasswordResetEmail = async(req:Request,res:Response)=>{
    const {email} = req.body;
    const user = await userModal.findOne({email:email})!;
    if(user){
        const secretKey = user._id + process.env.JWT_SECRET_KEY!;
        const token = jwt.sign({userID:user._id},secretKey , {expiresIn:"10min"});
        const link = `${FRONTEND_URL}/${user._id}/${token}`;
                // Send Email
        let info = await transporter.sendMail({
          from:EMAIL_FROM,
          to: user.email,
          subject: "KAMAL ARYAL - Password Reset Link",
          html: `<a href=${link}>Click Here</a> to Reset Your Password`
        })
        res.send({success:true , message:"Email sent successfully"})

    }else{
        return res.json({success:false , message:"User doesnot exists"})
    }
}

export const userPasswordReset = async(req:Request , res:Response)=>{
    const {password} = req.body;
    const {id , token} = req.params;
    if(password && id && token){
        const user = await userModal.findById(id);
        try{
            if(user){
                const newSecretKey = user._id + process.env.JWT_SECRET_KEY!
                jwt.verify(token , newSecretKey)
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(password , salt);
                await userModal.findByIdAndUpdate(user._id , {$set : {password:newHashPassword}});
                return res.status(200).json({success:true , message:"Successfully updated password"})
            }
        }catch(error){
            return res.status(400).json({success:false , message:"Something went wrong"})
        }
    }
}