import jwt from 'jsonwebtoken';
import { JWT_USER_SECRET } from '../constant/index.js';

export const isUserAuth=(req,res,next)=>{
      try {
           const token=req.cookies?.userToken;
            const decode=jwt.verify(token,JWT_USER_SECRET);
        
            if(decode){
                req.user=decode;
                next();
            }else{
                res.status(403).json({message:"You are not Signed in !"})
            }
        } catch (error) {
            res.status(403).json({message:"You are not Signed in !"})
        }
}