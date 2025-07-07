import React from 'react'
import { Link } from 'react-router-dom'


export const Riding = () => {
  return (
    <div className='h-screen'>
        <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className="text-2xl font-bold ri-home-2-line"></i>
        </Link>
        <div className='h-1/2'>
            <img className='h-full w-full object-cover'src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Uber map"/>
        </div>
        <div className='h-1/2 p-4'>
            <div className='flex items-center justify-between'>
            <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398986/assets/90/34c200-ce29-49f1-bf35-e9d250e8217a/original/UberX.png"></img>
            <div className='text-right'>
              <h2 className='text-lg font-medium'>Adnan Bin Wahid</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>MP04 AB 1234</h4>
              <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
            </div>
       </div>


        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-5'>

            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-line"></i>
              <div>
                <h3 className='text-lg font-medium'>Doyel Chattar, University of Dhaka</h3>
                <p className='text-sm -mt-1 text-gray-600'>Shahbag, Dhaka</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-cash-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>৳12.50</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash cash</p>
              </div>
            </div>
          </div>
         
        </div>
        <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a Payment</button>

        </div>


    </div>
  )
}

export default Riding;
