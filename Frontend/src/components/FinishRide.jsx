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
                <img className="h-12 rounded-full object-cover w-12" src="https://scontent.fdac5-2.fna.fbcdn.net/v/t39.30808-6/490515450_10234936738175391_9193044080154651462_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEjBqhcH66UjE4GmFT__m45X-1MOlCovltf7Uw6UKi-W0CGUt9tB0MNROR1g6Aj_ZXfAvaWx_woeVjkuCbmrOZa&_nc_ohc=7WpoVJ2guy0Q7kNvwHM_b6b&_nc_oc=AdkOonvb0V-69UDf-O8g5hqV3CggFeZ_bD71m_7pDKWBLy-riKyTP5u9FIsaOI9uRLc&_nc_zt=23&_nc_ht=scontent.fdac5-2.fna&_nc_gid=s9Pt89hBoeDebjgEZxN1Tg&oh=00_AfQ1OYRaq6o6w1GYH2N96ijrQ8iIj_7m6fhi_bGEKEVBVg&oe=686F2C6B" alt="User's picture"/>
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
                <h3 className='text-lg font-medium'>$12.50</h3>
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