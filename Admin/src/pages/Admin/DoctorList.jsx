import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useContext } from 'react'
import { useEffect } from 'react'
const DoctorList = () => {
  const {doctors,aToken,getAllDoctors,changeAvailability}=useContext(AdminContext)
  useEffect(()=>{
    if(aToken){
      getAllDoctors()
    }
  },[aToken])
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll '>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='flex flex-wrap w-full gap-5 pt-5 gap-y-6'>
        {
         doctors.map((item,index,_id)=>(
          <div className='border border-indigo-200 cursor-pointer rounded-xl max-w-56 over-flow-hidden group' key={index}>
            <img className='transition-all duration-500 rounded-t-xl bg-indigo-50 group-hover:bg-primary' src={item.image} alt="" />
            <div className='p-5 '>
              <p className='text-lg font-medium text-neutral-800'>{item.name}</p>
              <p className='text-sm text-zinc-600'>{item.speciality}</p>
              <div className='flex items-center gap-1 mt-2 text-sm'>
                <input onChange={()=>changeAvailability(item,_id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
         )) 

        }
      </div>
    </div>
  )
}

export default DoctorList
