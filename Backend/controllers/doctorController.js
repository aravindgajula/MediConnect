import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";

// API to change doctor's availability
const changeAvailability=async(req, res)=>{
  try 
  {
    const {docId}=req.body;
    const docData=await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId,{available:!docData.available});
    res.json({ success: true, message: "Availability changed successfully" });
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ success: false, message: "Error while changing availability" });
  }
}

const doctorList=async (req,res)=>
{
  try 
  {
    const doctors=await doctorModel.find({available:true}).select('-password');
    res.json({ success: true, doctors});
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

//API for doctor Login
const loginDoctor=async(req,res)=>{
  try
  {
    const {email,password}=req.body;
    const doctor=await doctorModel.findOne({email});
    if(!doctor)
    {
      return res.json({success:false,message:'Invalid Credentials'});
    }
    const isMatch=await bcrypt.compare(password,doctor.password);
    if(isMatch)
    {
      const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET);
      res.json({success:true,token:token})
    }
    else{
      return res.json({success:false,message:'Invalid Credentials'});
    }
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

//API to get doctor appointments for doctor panel
const appointmentsDoctor=async (req,res)=>{
 try{
  
  const {docId}=req.body;
  const appointments=await appointmentModel.find({docId});
  res.json({success:true,appointments})
 }
 catch(error) {
  console.error(error);
  res.status(500).json({ success: false, message: error.message });
 }
}

//API to mark appointment completed for doctor panel
const appointmentComplete=async(req,res)=>{
  try{
  const {docId,appointmentId}=req.body;
  const appointmentData=await appointmentModel.findById(appointmentId);
  if(appointmentData && appointmentData.docId===docId)
  {
    await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
    return res.json({success:true,message:'Appointment Completed'});
  }
  else 
  {
    return res.json({success:false,message:'Mark Failed'});
  }
  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

//API to cancel appointment
const appointmentCancel=async(req,res)=>{
  try{
  const {docId,appointmentId}=req.body;
  const appointmentData=await appointmentModel.findById(appointmentId);
  
  if(appointmentData && appointmentData.docId===docId)
  {
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
    return res.json({success:true,message:'Appointment Cancelled'});
  }
  else 
  {
    return res.json({success:false,message:'Cancelation Failed'});
  }
  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

//Api to get doctor dashboard data
const doctorDashboard=async(req,res)=>{
  try{
  const {docId}=req.body;
  const appointments=await appointmentModel.find({docId});
  let earnings=0;

  appointments.map((item)=>{
    if(item.isCompleted)
    {
      earnings=earnings+item.amount;
    }
  });

  let patients=[];

  appointments.map((item)=>{
    if(!patients.includes(item.userId))
    {
      patients.push(item.userId);
    }
  });

  const dashData={
    appointments:appointments.length,
    earnings,
    patients:patients.length,
    latestAppointments:appointments.reverse().slice(0,5)
  }

  res.json({success:true,dashData});
  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }

  }

  //API to get doctor profile for doctor panel
  const doctorProfile=async(req,res)=>{
    try{
      
      const {docId}=req.body;
      const profileData=await doctorModel.findById(docId).select('-password');

      res.json({ success: true, profileData});
    }
    catch(error)
    {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //API to update doctor profile for doctor panel
  const updateDoctorProfile=async(req,res)=>{
    try{
      
      const {docId,fees,address,available,about}=req.body;
      await doctorModel.findByIdAndUpdate(docId,{fees,address,available,about});
      res.json({ success: true, message: "Profile updated successfully" });
    }
    catch(error)
    {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
export { changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile};