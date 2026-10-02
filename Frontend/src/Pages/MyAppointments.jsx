import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context/AppContent";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const navigate = useNavigate();

  const slotDateFormat = (slotDate) => {
    const [year, month, day] = slotDate.split("_");
    return `${day} ${months[Number(month)]} ${year}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.log(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling appointment");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, response, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          console.log(error);
          toast.error("Error while processing payment");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while making payment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium border-b text-zinc-700">My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.docData.image} alt="Doctor" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="font-semibold text-neutral-800">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="mt-1 font-medium text-zinc-700">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="mt-1 text-xs">
                <span className="text-sm font-medium text-neutral-700">Date & Time:</span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col justify-end gap-2">
              {!item.cancelled && item.payment && !item.isCompleted && <button className="py-2 bg-indigo-500 border rounded sm:min-w-48 text-stone-50">Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className="py-2 text-sm text-center transition-all duration-300 border rounded text-stone-500 sm:min-w-48 hover:bg-primary hover:text-white">Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className="py-2 text-sm text-center transition-all border rounded text-stone-500 sm:min-w-48 hover:bg-red-600 hover:text-white duration:300">Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className="py-2 text-red-500 border border-red-500 rounded sm:min-w-48">Appointment Cancelled</button>}
              {item.isCompleted && <button className="py-2 text-green-500 border border-green-500 sm:min-w-48">Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
