import validator from "validator";
import bcrypt from "bcrypt"; 
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile)
      return res.status(400).json({ message: 'Please fill all the required fields' });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email format' });

    

    if (isNaN(fees) || fees <= 0)
      return res.status(400).json({ message: 'Invalid fees amount' });

    
    
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: typeof address === 'string' ? JSON.parse(address) : address, 
      date: Date.now(),
    };

    
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    
   
    res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error while uploading" });
  }
};


const loginAdmin=async(req,res) => {
  try
  {
    const { email, password } = req.body;
    if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD)
    {
       const token=jwt.sign(email+password,process.env.JWT_SECRET)
       res.json({success:true,message:"Login Successful",token});
    }
    else 
    {
      res.json({success:false,message:"Invalid Credentials"});
    }

  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message: error.message });
  }
}




const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password');
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error while fetching doctors" });
  }
};


const appointmentsAdmin=async(req,res)=>
{
  try{
    const appointments=await appointmentModel.find({});
    res.json({ success: true, appointments});

  }
  catch(error) 
  {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}



const appointmentCancel = async (req, res) => {
  try {
     
      const {  appointmentId } = req.body;

      const appointmentData = await appointmentModel.findById(appointmentId);

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
      res.status(500).json({ success: false, message: error.message });
  }
};


const adminDashboard=async(req,res)=>{
  try{
    
    const doctors=await doctorModel.find({});
    const users=await userModel.find({});
    const appointments=await appointmentModel.find({});

    const dashData={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({success:true,dashData});
  }
  catch(error)
  {
    console.error(error.message);
    res.json({success:false,message:error.message})
  }
}
export { addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard};
