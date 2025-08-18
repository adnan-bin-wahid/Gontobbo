import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { ride, amount } = location.state || {}

    useEffect(() => {
        // Auto redirect to home after 5 seconds
        const timer = setTimeout(() => {
            navigate('/home')
        }, 5000)

        return () => clearTimeout(timer)
    }, [navigate])

    if (!ride || !amount) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h3 className='text-xl font-semibold text-red-500'>Payment data not found</h3>
                    <button
                        onClick={() => navigate('/home')}
                        className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
            <div className='max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center'>
                {/* Success Icon */}
                <div className='w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center'>
                    <i className="ri-check-line text-3xl text-green-600"></i>
                </div>

                <h2 className='text-2xl font-semibold text-green-600 mb-4'>
                    Payment Successful!
                </h2>

                <p className='text-gray-600 mb-6'>
                    Your payment of ৳{amount} has been processed successfully.
                </p>

                {/* Payment Details */}
                <div className='bg-gray-50 p-4 rounded-lg mb-6 text-left'>
                    <h3 className='font-semibold mb-3'>Trip Summary</h3>
                    <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>From:</span>
                            <span>{ride?.pickUp}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>To:</span>
                            <span>{ride?.destination}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Captain:</span>
                            <span>{ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Vehicle:</span>
                            <span>{ride?.captain?.vehicle?.plate}</span>
                        </div>
                        <hr className='my-2' />
                        <div className='flex justify-between font-semibold'>
                            <span>Total Paid:</span>
                            <span>৳{amount}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='space-y-3'>
                    <button
                        onClick={() => navigate('/home')}
                        className='w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700'
                    >
                        Book Another Ride
                    </button>
                    
                    <button
                        onClick={() => window.print()}
                        className='w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300'
                    >
                        Print Receipt
                    </button>
                </div>

                <p className='text-sm text-gray-500 mt-6'>
                    You will be automatically redirected to home in a few seconds...
                </p>
            </div>
        </div>
    )
}

export default PaymentSuccess
