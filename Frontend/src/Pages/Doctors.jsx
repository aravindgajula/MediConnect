import React, { useContext, useState, useEffect } from 'react'; 
import { useParams, useNavigate } from "react-router-dom"; 
import { AppContext } from "../Context/AppContent";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const[showFilter,setShowfilter]=useState(false)
  const navigate = useNavigate(); 

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
       <p className='text-gray-600 '>Browse through the doctors speciality</p>
       <div className='flex flex-col items-start gap-5 mt-5 sm:flex-row '>
        <button onClick={()=>setShowfilter(prev=>!prev)} className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ?'bg-primary text-white':''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter?'flex':'hidden sm:flex'}` }>
          <p onClick={()=>speciality==='General physician'?navigate('/doctors'):navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="General physician"?"bg-indigo-100 text-black":""}`}  >General Physician</p>
          <p onClick={()=>speciality==='Gynecologist'?navigate('/doctors'):navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Gynecologist"?"bg-indigo-100 text-black":""}`} >Gynecologist</p>
          <p onClick={()=>speciality==='Dermatologist'?navigate('/doctors'):navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Dermatologist"?"bg-indigo-100 text-black":""}`} >Dermatologist</p>
          <p onClick={()=>speciality==='Pediatricians'?navigate('/doctors'):navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Pediatricians"?"bg-indigo-100 text-black":""}`} >Pediatricians</p>
          <p onClick={()=>speciality==='Neurologist'?navigate('/doctors'):navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Neurologist"?"bg-indigo-100 text-black":""}`} >Neurologist</p>
          <p onClick={()=>speciality==='Gastroenterologist'?navigate('/doctors'):navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Gastroenterologist"?"bg-indigo-100 text-black":""}`} >Gastroenterologist</p>
        </div>

        <div className='grid w-full gap-5 grid-cols-auto gap-y-5'>
          {
            filterDoc.map((item) => 
              <div 
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className='overflow-hidden border border-blue-200 cursor-pointer rounded-xl hover:translate-y-[-10px] transition-all duration-500' 
                  key={item._id} 
              >
                  <img className='bg-blue-50' src={item.image} alt={item.name} /> 
                  <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available?'text-green-500':'text-gray-500' } `}>
                      <p className={`w-2 h-2 ${item.available?'bg-green-500':'bg-gray-500' } rounded-full `}></p>
                      <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                      <p className='text-lg font-medium text-gray-900'>{item.name}</p>
                      <p className='text-sm text-gray-600'>{item.speciality}</p>
                  </div>
              </div>
            )
          }
        </div>
       </div>
    </div>
  )
}

export default Doctors;
