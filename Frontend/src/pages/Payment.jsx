import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'

// Initialize Stripe (you'll need to add your publishable key to .env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PaymentForm = ({ ride, amount, rideId }) => {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [clientSecret, setClientSecret] = useState('')

    useEffect(() => {
        // Create payment intent when component mounts
        createPaymentIntent()
    }, [])

    const createPaymentIntent = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/payment/create-intent`, {
                amount: amount,
                currency: 'usd',
                rideId: rideId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.data.success) {
                setClientSecret(response.data.clientSecret)
            } else {
                setError('Failed to initialize payment')
            }
        } catch (error) {
            console.error('Error creating payment intent:', error)
            setError('Failed to initialize payment')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setLoading(true)
        setError(null)

        const cardElement = elements.getElement(CardElement)

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                }
            })

            if (error) {
                setError(error.message)
                setLoading(false)
            } else if (paymentIntent.status === 'succeeded') {
                // Payment successful - end ride for user
                await endRideForUser()
            }
        } catch (err) {
            setError('Payment failed. Please try again.')
            setLoading(false)
        }
    }

    const endRideForUser = async () => {
        try {
            // Call a new endpoint to end ride for user after payment
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride-user`, {
                rideId: rideId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            // Navigate to success page or home
            navigate('/payment-success', { 
                state: { 
                    ride: ride,
                    amount: amount 
                } 
            })
        } catch (error) {
            console.error('Error ending ride for user:', error)
            // Even if ending ride fails, payment was successful
            navigate('/payment-success', { 
                state: { 
                    ride: ride,
                    amount: amount 
                } 
            })
        }
    }

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
        },
    }

    return (
        <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>Complete Payment</h2>
            
            {/* Ride Summary */}
            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                <h3 className='font-semibold mb-2'>Ride Summary</h3>
                <div className='flex justify-between items-center mb-2'>
                    <span>Pickup:</span>
                    <span className='text-sm text-gray-600'>{ride?.pickUp}</span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                    <span>Destination:</span>
                    <span className='text-sm text-gray-600'>{ride?.destination}</span>
                </div>
                <div className='flex justify-between items-center mb-2'>
                    <span>Captain:</span>
                    <span className='text-sm text-gray-600'>{ride?.captain?.fullname?.firstname}</span>
                </div>
                <div className='flex justify-between items-center font-semibold'>
                    <span>Total Amount:</span>
                    <span>৳{amount}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Card Information
                    </label>
                    <div className='p-3 border border-gray-300 rounded-md'>
                        <CardElement options={cardElementOptions} />
                    </div>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className={`w-full py-3 px-4 rounded-md font-semibold ${
                        loading || !stripe
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {loading ? 'Processing...' : `Pay ৳${amount}`}
                </button>
            </form>

            <button
                onClick={() => navigate('/riding', { state: { ride } })}
                className='w-full mt-3 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
            >
                Back to Ride
            </button>
        </div>
    )
}

const Payment = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { ride, amount, rideId } = location.state || {}

    // Redirect if no payment data
    if (!ride || !amount || !rideId) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h3 className='text-xl font-semibold text-red-500'>Payment data not found</h3>
                    <p className='text-gray-600 mt-2'>Please go back and try again.</p>
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
        <div className='min-h-screen bg-gray-100 py-8'>
            <div className='container mx-auto px-4'>
                <Elements stripe={stripePromise}>
                    <PaymentForm ride={ride} amount={amount} rideId={rideId} />
                </Elements>
            </div>
        </div>
    )
}

export default Payment
