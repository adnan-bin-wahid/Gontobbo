import React from 'react'
import { Link } from 'react-router-dom'

const FinishRide = (props) => {

  return (
     <div>
          <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
          props.setFinishRidePanel(false)
        }}><i className=" text-3xl text-grey-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>
        <div className="flex items-center justify-between p-4 border-2 border-yellow-300 rounded-lg mt-4">
            <div className="flex items-center gap-3">
                <img className="h-12 rounded-full object-cover w-12" src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="User's picture"/>
                <h2 className="text-lg font-medium">Meher Afroj Shaon</h2>
            </div>
            <h5 className="text-lg font-semibold">2.2 KM</h5>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
         
          <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>108/A, MohammadPur</h3>
                <p className='text-sm -mt-1 text-gray-600'>Dhaka</p>
              </div>
            </div>
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
                <h3 className='text-lg font-medium'>৳ 12.50</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash cash</p>
              </div>
            </div>
          </div>
         
         <div className='mt-6 w-full'>
        
             <Link to='/captain-home' className='w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg' >Finish Ride</Link>
            
         </div>
        </div>
    </div>
  )
}

export default FinishRide