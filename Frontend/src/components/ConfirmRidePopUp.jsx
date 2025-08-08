import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmRidePopUp = (props) => {

  const[otp, setOtp] = useState('')
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    // Add your OTP validation or submission logic here
       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }

  };
  
  return (
   
    <div>
          <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
          props.setRidePopupPanel(false)
        }}><i className=" text-3xl text-grey-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to start</h3>
        <div className="flex items-center justify-between p-3 bg-yellow-300 rounded-lg mt-4">
            <div className="flex items-center gap-3">
                <img className="h-12 rounded-full object-cover w-12" src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" alt="User's picture"/>
                <h2 className="text-lg font-medium capitalize">{props.ride?.user.fullname.firstname} {props.ride?.user.fullname.lastname}</h2>
            </div>
            <h5 className="text-lg font-semibold">2.2 KM</h5>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
         
          <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>{props.ride?.pickUp}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Pickup location</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-line"></i>
              <div>
                <h3 className='text-lg font-medium'>{props.ride?.destination}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Destination location</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-cash-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>৳ {props.ride?.fare}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash cash</p>
              </div>
            </div>
          </div>
         
         <div className='mt-6 w-full'>
          <form onSubmit={(e)=>{
            submitHandler(e)
            // Start live tracking when ride is confirmed
            if (props.startLiveTracking) {
              props.startLiveTracking(props.ride._id);
            }
            }}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="bg-[#eee] font-mono px-6 py-4 text-base rounded-lg w-full mt-5"
              placeholder="Enter OTP"
              required
            />
            <button
              type="submit"
              className="w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg"
            >
              Confirm
            </button>
            
            <button onClick={() => {
             props.setConfirmRidePopupPanel(false)
             props.setRidePopupPanel(false)
             
          }} className='w-full mt-2 text-lg bg-red-500 text-white font-semibold p-3 rounded-lg' >Cancel</button>

          </form>
         </div>
        </div>
    </div>
   
  )
}

export default ConfirmRidePopUp