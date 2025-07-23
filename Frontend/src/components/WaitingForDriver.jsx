import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={()=>{
          props.setWaitingForDriver(false)
        }}><i className=" text-3xl text-grey-200 ri-arrow-down-wide-line"></i></h5>

       <div className='flex items-center justify-between'>
            <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398986/assets/90/34c200-ce29-49f1-bf35-e9d250e8217a/original/UberX.png"></img>
            <div className='text-right'>
              <h2 className='text-lg font-medium'>
                {props.ride?.captain?.fullname?.firstname || 'Driver'} {props.ride?.captain?.fullname?.lastname || ''}
              </h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>
                {props.ride?.captain?.vehicle?.plate || 'Vehicle info loading...'}
              </h4>
              <p className='text-sm text-gray-600'>
                {props.ride?.captain?.vehicle?.color && props.ride?.captain?.vehicle?.vehicleType 
                  ? `${props.ride.captain.vehicle.color} ${props.ride.captain.vehicle.vehicleType}` 
                  : 'Vehicle details loading...'}
              </p>
            </div>
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
                <h3 className='text-lg font-medium'>{props.ride?.fare}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
              </div>
            </div>
          </div>
         
        </div>
    </div>
  )
}

export default WaitingForDriver