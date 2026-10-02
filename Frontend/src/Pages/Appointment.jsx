import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContent";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedDoctors from "../Components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // Selected date index
  const [selectedSlot, setSelectedSlot] = useState(null); // Selected time slot

  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;

    const today = new Date();
    const newDocSlots = [];

    for (let i = 0; i < 7; ++i) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(24, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const day = currentDate.getDate();
        const month = currentDate.getMonth()+1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isSlotAvailable = !(
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime)
        );

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      newDocSlots.push(timeSlots);
    }

    setDocSlots(newDocSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book an appointment");
      return navigate("/signup");
    }

    if (!selectedSlot) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      const { datetime, time } = selectedSlot;
      const day = datetime.getDate();
      const month = datetime.getMonth() + 1;
      const year = datetime.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime: time },
        { headers: { Authorization: `Bearer ${token}`} }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        getAvailableSlots();
        navigate("/my-appointments");
      } else {
        toast.info(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while booking appointment");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div>
            <img
              className="w-full rounded-lg bg-primary sm:max-w-72"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 p-8 mx-2 bg-white border border-gray-400 rounded-lg py-7 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 mt-3 text-sm font-medium text-gray-900">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="mt-4 font-medium text-gray-500">
              Appointment Fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking slots */}
        <div className="mt-4 font-medium text-gray-700 sm:ml-72 sm:pl-4">
          <p>Booking Slots</p>
          <div className="flex items-center w-full gap-3 mt-4 overflow-x-scroll">
            {docSlots.map((item, index) => (
              <div
                onClick={() => setSelectedDateIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  selectedDateIndex === index
                    ? "bg-primary text-white "
                    : "border border-gray-200"
                }`}
                key={index}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center w-full gap-3 mt-4 overflow-x-scroll">
            {docSlots[selectedDateIndex]?.map((item, index) => (
              <p
                onClick={() => setSelectedSlot(item)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  selectedSlot === item
                    ? "bg-primary text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button
            onClick={bookAppointment}
            className="py-3 my-6 text-sm font-light text-white rounded-full bg-primary px-14"
          >
            Book An Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
