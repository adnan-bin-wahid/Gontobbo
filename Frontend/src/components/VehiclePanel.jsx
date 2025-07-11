import React, { useState } from 'react'

export const VehiclePanel = (props) => {
  // Get fare values with fallbacks for each vehicle type
  const carFare = props.fare && (props.fare.car || props.fare['car'] || 350);
  const bikeFare = props.fare && (props.fare.bike || props.fare['bike'] || 150);
  const autoFare = props.fare && (props.fare.auto || props.fare['auto'] || 250);
  
  // State to track which vehicle is selected
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Handle vehicle selection and continue to next step
  const handleVehicleSelect = (vehicleType) => {
    setSelectedVehicle(vehicleType);
    if (props.selectVehicle) {
      props.selectVehicle(vehicleType);
    }
    props.setConfirmRidePanel(true);
    props.setVehiclePanel(false);
  };
  
  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
          props.setVehiclePanel(false)
        }}><i className=" text-3xl text-grey-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>
        
        <div 
          onClick={() => handleVehicleSelect('car')}  
          className={`flex border-2 ${selectedVehicle === 'car' ? 'border-black' : ''} mb-2 rounded-xl w-full p-3 items-center justify-between cursor-pointer hover:bg-gray-50`}
        >
          <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398986/assets/90/34c200-ce29-49f1-bf35-e9d250e8217a/original/UberX.png" alt="Car png"/>
          <div className='ml-2 w-1/2'>
            <h4 className='font-medium text-base'>UberGo <span className='ml-1'><i className="ri-user-3-fill"></i>4</span></h4>
            <h5 className='font-medium text-sm'>2 mins away</h5>
            <p className='font-normal text-xs text-gray-600'>Affordable, compact and fast</p>
          </div>
          <h2 className='text-lg font-semibold'>৳ {carFare}</h2>
        </div>
        
        <div 
          onClick={() => handleVehicleSelect('bike')}  
          className={`flex border-2 ${selectedVehicle === 'bike' ? 'border-black' : ''} mb-2 rounded-xl w-full p-3 items-center justify-between cursor-pointer hover:bg-gray-50`}
        >
          <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Bike png"/>
          <div className='ml-2 w-1/2'>
            <h4 className='font-medium text-base'>Moto <span className='ml-1'><i className="ri-user-3-fill"></i>1</span></h4>
            <h5 className='font-medium text-sm'>3 mins away</h5>
            <p className='font-normal text-xs text-gray-600'>Affordable motorcycle rides</p>
          </div>
          <h2 className='text-lg font-semibold'>৳ {bikeFare}</h2>
        </div>
        
        <div 
          onClick={() => handleVehicleSelect('auto')}  
          className={`flex border-2 ${selectedVehicle === 'auto' ? 'border-black' : ''} mb-2 rounded-xl w-full p-3 items-center justify-between cursor-pointer hover:bg-gray-50`}
        >
          <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="Auto png"/>
          <div className='ml-2 w-1/2'>
            <h4 className='font-medium text-base'>UberAuto <span className='ml-1'><i className="ri-user-3-fill"></i>3</span></h4>
            <h5 className='font-medium text-sm'>10 mins away</h5>
            <p className='font-normal text-xs text-gray-600'>Affordable auto rides</p>
          </div>
          <h2 className='text-lg font-semibold'>৳ {autoFare}</h2>
        </div>
        
        {props.fare ? (
          <p className="text-xs text-gray-500 mt-2 text-center">
            * Prices calculated based on distance and estimated travel time
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-2 text-center">
            * Loading fare information...
          </p>
        )}
    </div>
  )
}
