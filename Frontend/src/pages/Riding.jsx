import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)

    // Debug: Log the props data
    console.log('Riding - location:', location)
    console.log('Riding - ride data:', ride)

    useEffect(() => {
        if (socket) {
            socket.on("ride-ended", () => {
                navigate('/home')
            })

            return () => {
                socket.off("ride-ended")
            }
        }
    }, [socket, navigate])

    // Handle case where ride data is missing
    if (!ride) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h3 className='text-xl font-semibold text-red-500'>No ride data found</h3>
                    <p className='text-gray-600 mt-2'>Please go back and select a ride.</p>
                    <Link to='/home' className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'>
                        Go to Home
                    </Link>
                </div>
            </div>
        )
    }

    const handleMakePayment = () => {
        setIsProcessingPayment(true)
        // Navigate to payment page with ride data
        navigate('/payment', { 
            state: { 
                ride: ride,
                amount: ride.fare,
                rideId: ride._id 
            } 
        })
    }


    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-1/2'>
                <LiveTracking />

            </div>
            <div className='h-1/2 p-4'>
                <div className='flex items-center justify-between'>
                    <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'>Color : {ride?.captain.vehicle.color}</p>

                    </div>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>

                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>{ride?.destination}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Destination</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>৳{ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleMakePayment}
                    disabled={isProcessingPayment}
                    className={`w-full mt-5 font-semibold p-2 rounded-lg ${
                        isProcessingPayment 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {isProcessingPayment ? 'Processing...' : 'Make a Payment'}
                </button>
            </div>
        </div>
    )
}

export default Riding