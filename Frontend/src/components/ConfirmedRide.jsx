import React, { useState } from 'react'
import axios from 'axios'

export const ConfirmedRide = (props) => {
  const [isCreating, setIsCreating] = useState(false);
  
  // Get vehicle image based on selected type
  const getVehicleImage = () => {
    switch(props.vehicleType) {
      case 'bike':
        return "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png";
      case 'auto':
        return "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png";
      default: // car
        return "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398986/assets/90/34c200-ce29-49f1-bf35-e9d250e8217a/original/UberX.png";
    }
  };
  
  // Get fare for selected vehicle type
  const getSelectedFare = () => {
    if (!props.fare || !props.vehicleType) return "Loading...";
    
    if (typeof props.fare === 'object') {
      return props.fare[props.vehicleType] || 'N/A';
    }
    return props.fare;
  };
  
  // Handle ride creation
  const createRide = async () => {
    if (!props.pickup || !props.destination || !props.vehicleType) {
      console.error('Missing required information for ride creation');
      alert('Missing ride information. Please try again.');
      return;
    }
    
    try {
      setIsCreating(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const rideDetails = {
        pickup: props.pickup,
        destination: props.destination,
        vehicleType: props.vehicleType
      };
      
      console.log('Creating ride with details:', rideDetails);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        rideDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Ride created successfully:', response.data);
      
      // Show the looking for driver panel
      props.setVehicleFound(true);
      props.setConfirmRidePanel(false);
      
      // Save ride details if needed for later use
      if (props.onRideCreated) {
        props.onRideCreated(response.data);
      }
      
    } catch (error) {
      console.error('Failed to create ride:', error);
      alert('Unable to create ride. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
          props.setConfirmRidePanel(false);
        }}><i className=" text-3xl text-grey-200 ri-arrow-down-wide-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Confirm your ride</h3>

        <div className='flex gap-2 justify-between flex-col items-center'>
          <img className='h-20' src={getVehicleImage()} alt={`${props.vehicleType || 'Vehicle'} image`} />
          <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>{props.pickup || "Set pickup location"}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Pickup location</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="ri-map-pin-line"></i>
              <div>
                <h3 className='text-lg font-medium'>{props.destination || "Set destination"}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Destination location</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-cash-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>৳ {getSelectedFare()}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash payment</p>
              </div>
            </div>
          </div>
          <button 
            onClick={createRide}
            disabled={isCreating} 
            className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'
          >
            {isCreating ? 'Creating Ride...' : 'Confirm'}
          </button>
        </div>
    </div>
  )
}
