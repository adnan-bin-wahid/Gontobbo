import React, {useContext} from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
const CaptainDetails = () => {

const { captain } = useContext(CaptainDataContext);


  return (
    <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-3'>
            <img className='h-10 w-10 rounded-full object-cover' src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Driver's profile"/>
            <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " "+captain.fullname.lastname}</h4>
          </div>
          <div>
            <h4 className='text-xl font-semibold'>৳ 250.50</h4>
            <p className='text-sm text-gray-600'>Earned</p>
          </div>
         </div>
         <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-between items-start'>
          <div className='text-center'>
            <i className="text-3xl mb-2 font-thin ri-time-line"></i>
            <h5 className='text-lg font-medium'>10.2</h5>
            <p className='text-sm text-gray-600'>Hours</p>

          </div>
          <div className='text-center'>
            <i className="text-3xl mb-2 font-thin ri-speed-up-fill"></i>
            <h5 className='text-lg font-medium'>60</h5>
            <p className='text-sm text-gray-600'>mph</p>
          </div>
          <div className='text-center'>
            <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
            <h5 className='text-lg font-medium'>8</h5>
            <p className='text-sm text-gray-600'>Trips</p>
          </div>

         </div>
    </div>
  )
}

export default CaptainDetails