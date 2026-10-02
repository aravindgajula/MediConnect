import jwt from 'jsonwebtoken';
//Admin Authentication Middleware
const authAdmin=async(req,res,next) => {
    try {
        const {token} = req.headers;

        if(!token)
        {
            return res.json({success: false, message: 'Not Authorized, Login Again'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded!==process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
        {
            return res.json({success:false,message:'Not Authorized Login Admin'})
        }
        next();
    } catch (error) 
    {
        console.log(error);
        res.status(401).json({ success:false,message: error.message });
    }
};

export default authAdmin;