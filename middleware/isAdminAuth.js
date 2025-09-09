import {jwt} from 'jsonwebtoken';
import { JWT_ADMIN_SECRET } from '../constant';

export const isAdminAuth=(req,res,next)=>{
    try {
        const token=req.headers.token;
        const decode=jwt.verify(token,JWT_ADMIN_SECRET);
    
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