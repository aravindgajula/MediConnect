import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>

      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>

         <div>
            <img className='w-40 mb-5' src={assets.logo} alt="" />
            <p className='w-full text-lg leading-6 text-gray-600 md:w-2/3'>  Mediconnect is your trusted platform for managing doctor consultations and appointments, providing seamless and efficient healthcare access.</p>
         </div>

         <div >
            <p className='mb-5 text-xl font-medium'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600 text-md '>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
            </ul>
         </div>

         <div>
            <p className='mb-5 text-xl font-medium'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600 '>
                <li>+91 8639141744</li>
                <li>karthikbandi719@gmail.com</li>
            </ul>
         </div>

      </div>
      <div >
        <hr/>
        <p className='py-5 text-sm text-center'>Copyright 2024 @ MediConnect-All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer
