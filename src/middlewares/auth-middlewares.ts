import { NextFunction, Request, Response } from "express";
import userModal from "../modals/users";
const jwt = require('jsonwebtoken')

interface AuthenticatedRequest extends Request {
    user?: any;
}
export const checkUserAuth = async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        const token = authorization.split(" ")[1];
        if(token){
            try{
                const {userID} = jwt.verify(token,process.env.JWT_SECRET_KEY);
                const user  = await userModal.findById(userID).select("-password");
                if (user) {
                    req.user = user;
                    next();
                } else {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
            }
            catch(error){
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
        }else{
            return res.status(400).send({success:false , message:"Token doesnot exist"})
        }
    }else{
        return res.status(400).send({success:false , message:"You are not authorized"})
    }
}