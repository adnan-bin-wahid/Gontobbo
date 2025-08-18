
import React from 'react'
import { Link } from 'react-router-dom'
import Gontobbologo from '../assets/logo.png'
const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(/background.png)] h-screen pt-8 flex justify-between flex-col w-full'>
        <img className='w-28 ml-8' src={Gontobbologo} alt="Gontobbo logo" />
        <div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>Get Started with Gontobbo</h2>
          <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start