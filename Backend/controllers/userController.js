import validator from 'validator';
import bcrypt from "bcrypt"; 
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'


//API for UserProfile

const getProfile = async (req, res) => {
    try {
      const userId = req.userId; 
      const userData = await userModel.findById(userId).select('-password');
  
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, userData });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ success: false, message: "Error while fetching user profile" });
    }
  };
  
//API for UserUpdate

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;  
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        console.log("Received Data:", req.body);
        console.log("Received File:", req.file);

        if (!name || !phone || !address || !dob || !gender) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const parsedAddress = JSON.parse(address); 
        await userModel.findByIdAndUpdate(userId, { name, phone, address: parsedAddress, dob, gender });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error while updating user profile:", error);
        res.status(500).json({ success: false, message: "Error while updating user profile" });
    }
};
// API to book appointment
const bookAppointment=async (req,res)=>{
    try{
        const userId=req.userId;
        const { docId, slotDate, slotTime}=req.body;

        const docData=await doctorModel.findById(docId).select('-password');
        if(!docData.available)
        {
            return res.status(400).json({success:false, message: "Doctor is not available at the selected time"});
        }

        let slots_booked=docData.slots_booked 

        if(slots_booked[slotDate])
        {
            if(slots_booked[slotDate].includes(slotTime))
            {
                return res.json({ success: false, message: `The slot at ${slotTime} on ${slotDate} is already booked.` });
            }
            else 
            {
                slots_booked[slotDate].push(slotTime);
            }
        }
        else
        {
        //    slots_booked[slotDate]=[];
        //    slots_booked[slotDate].push(slotTime);
        slots_booked[slotDate] = [slotTime];
        }
    
       const userData=await userModel.findById(userId).select('-password')
       delete docData.slots_booked
        
       const appointmentData={
        userId,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotTime,
        slotDate,
        date:Date.now()
       }
       const newAppointment=new appointmentModel(appointmentData);
       await newAppointment.save();

       await doctorModel.findByIdAndUpdate(docId,{slots_booked});


       res.json({success:true, message: "Appointment booked successfully"});

    }
    catch(error){
        console.error(error);
        res.status(500).json({success:false, message: "Error while booking appointment"});
    }
}

//API to get user appointments 
const listAppointment=async(req,res)=>
{
    try{
        const userId=req.userId;
        const appointments=await appointmentModel.find({userId})
        res.json({success:true, appointments});
    }
    catch(error){
        console.error(error);
        res.status(500).json({success:false, message: "Error while fetching appointments"});
    }
}

//API to cancel appointment

const cancelAppointment = async (req, res) => {
    try {
        const userId=req.userId;
        const {appointmentId } = req.body;
  
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.userId !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        
        if (!doctorData.slots_booked) {
            doctorData.slots_booked = {};
        }
        if (doctorData.slots_booked[slotDate]) {
            doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter((e) => e !== slotTime);
        }


        await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });

        res.json({ success: true, message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error while canceling appointment" });
    }
};

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,

});
//Api to make payments
const paymentRazorpay= async (req,res)=>{

try
{
   const {appointmentId}=req.body;
   const appointmentData=await appointmentModel.findById(appointmentId);
   if(!appointmentData || appointmentData.cancelled)
   {
    return res.status(404).json({success:false, message: "Appointment not found"});
   }
   
   // creating options for razorpay payment
   const options={
    amount:appointmentData.amount*100,
    currency:process.env.CURRENCY,
    receipt: appointmentId,
   }

   // creation of an order
   const order=await razorpayInstance.orders.create(options);
   res.json({success:true, order});
}
catch(error)
{
    console.error(error);
    res.status(500).json({success:false, message: "Error while making payment"});
}

}

// API to verify payment of razorpay
const verifyRazorpay= async (req,res)=>{
    try 
    {
       const {razorpay_order_id}=req.body;
       const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);
       if(orderInfo.status==='paid')
       {
           await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
           res.json({success:true, message: "Payment successful"});
       }
       else 
       {
        return res.status(400).json({success:false, message: "Payment failed"});
       }

    }
    catch (error) 
    {
        console.error(error);
        res.status(500).json({success: false, message: "Error while verifying payment"});
    }
} 
export {getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}