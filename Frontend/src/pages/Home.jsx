import React, { useRef, useEffect, useContext } from 'react'
 import { useState } from 'react'
 import {useGSAP} from '@gsap/react';
 import { gsap } from 'gsap';
 import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import { VehiclePanel } from '../components/VehiclePanel';
import { ConfirmedRide } from '../components/ConfirmedRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { SocketContext } from '../context/SocketContext';

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [currentRide, setCurrentRide] = useState(null)
  
  // Add states for suggestions and active field
  const [suggestions, setSuggestions] = useState([])
  const [activeField, setActiveField] = useState('') // 'pickup' or 'destination'
  const [isLoading, setIsLoading] = useState(false)
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null); // To track selected vehicle type
  const [ride,setRide] = useState(null); // To track the ride data
  // Function to fetch suggestions
  const {socket} = useContext(SocketContext);
  const {user} = useContext(UserDataContext)

  useEffect(() => {
    socket.emit("join", {
      userType: 'user',
      userId: user._id,
    });
  }, [user]);

  socket.on('ride-confirmed', ride => {


        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

     socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })


  const fetchSuggestions = async (input, field) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: input },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuggestions(response.data);
      setActiveField(field);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    
    if (field === 'pickup') {
      setPickup(value);
    } else {
      setDestination(value);
    }
    
    // Set a small timeout to avoid making too many API calls
    clearTimeout(window.suggestionTimer);
    window.suggestionTimer = setTimeout(() => {
      fetchSuggestions(value, field);
    }, 500);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const description = suggestion.description;
    
    if (activeField === 'pickup') {
      setPickup(description);
    } else if (activeField === 'destination') {
      setDestination(description);
    }
    
    setPanelOpen(false);
    setVehiclePanel(true);
  };

   const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }
  
  const submitHandler = (e) => {
    e.preventDefault();
  }
 
  useGSAP(function(){
   if(panelOpen){
    gsap.to(panelRef.current,{
      height:'70%',
      padding:24
      // opacity:1
    })
    gsap.to(panelCloseRef.current,{
      opacity:1
    })
   }else{
    gsap.to(panelRef.current,{
      height:'0%',
      padding:24
      // opacity:0
    })
    gsap.to(panelCloseRef.current,{
      opacity:0
    })
   }

  },[panelOpen]);
  
  useGSAP(function(){
    if(vehiclePanel){
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(vehiclePanelRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[vehiclePanel])

  useGSAP(function(){
    if(confirmRidePanel){
      gsap.to(confirmRidePanelRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(confirmRidePanelRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[confirmRidePanel])

   useGSAP(function(){
    if(vehicleFound){
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(vehicleFoundRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[vehicleFound])

    useGSAP(function(){
    if(waitingForDriver){
      gsap.to(waitingForDriverRef.current,{
        transform:'translateY(0)'
      })
    }else{
      gsap.to(waitingForDriverRef.current,{
        transform:'translateY(100%)'
      })
    }
  },[waitingForDriver])

  async function findTrip() {
    try {
      // Validate inputs
      if (!pickup || pickup.length < 3) {
        alert('Please enter a valid pickup location');
        return;
      }
      if (!destination || destination.length < 3) {
        alert('Please enter a valid destination');
        return;
      }
      
      setVehiclePanel(true);
      setPanelOpen(false);
      
      // Show loading state
      console.log("Calculating fare...");
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Try POST request first
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/get-fare`, 
          { 
            pickup, 
            destination
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data && response.data.fare) {
          console.log("Fare data received:", response.data.fare);
          setFare(response.data.fare);
        } else if (response.data) {
          console.log("Fare data received (direct):", response.data);
          setFare(response.data);
        } else {
          throw new Error('Invalid fare data format');
        }
      } catch (postError) {
        console.error('POST request failed, trying GET:', postError);
        
        // Fallback to GET request if POST fails
        try {
          const getResponse = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/rides/get-fare`, 
            {
              params: { pickup, destination },
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          if (getResponse.data && getResponse.data.fare) {
            console.log("Fare data received (GET):", getResponse.data.fare);
            setFare(getResponse.data.fare);
          } else if (getResponse.data) {
            console.log("Fare data received (GET direct):", getResponse.data);
            setFare(getResponse.data);
          } else {
            throw new Error('Invalid fare data format from GET request');
          }
        } catch (getError) {
          console.error('Both POST and GET requests failed:', getError);
          throw getError;
        }
      }
    } catch (error) {
      console.error('Error in findTrip:', error);
      
      // Fallback to mock data if all API attempts fail
      setFare({
        car: 350,
        bike: 150,
        auto: 250
      });
      
      // Don't show alert unless it's a critical error
      if (!error.response || error.response.status >= 500) {
        alert('Unable to calculate fare. Using estimated prices.');
      }
    }
  }

  async function createRide(vehicleType){
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
      pickup,
      destination,
      vehicleType
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      
      }
    });
    if (response.status === 201) {
      console.log('Ride created successfully:', response.data);
      setConfirmRidePanel(false);
      setVehicleFound(true);
      setWaitingForDriver(true);
    }
    else {
      console.error('Failed to create ride:', response.data);
      alert('Failed to create ride. Please try again.');
    }
  }

  // Handle ride creation success
  const handleRideCreated = (rideData) => {
    console.log('Ride created and stored in state:', rideData);
    setCurrentRide(rideData);
    
    // Any additional logic after ride creation
    // For example, you might want to start polling for driver status
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-16 absolute left-5 top-5' src="https://www.pngplay.com/wp-content/uploads/8/Uber-Transparent-Background.png" alt="Ubar logo" />
      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover'src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Map"/>
      </div>
      <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
        <div className='h-[30%] p-5 bg-white relative'>
          <h5 ref={panelCloseRef} onClick={()=>{
            setPanelOpen(false)
          }}
          className='absolute opacity-0 right-6 top-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          
         <h4 className='text-2xl font-semibold'>Find a trip</h4>
        <form onSubmit={(e)=>{
          submitHandler(e)
        }}>
          <div className="line absolute h-16 w-1 top-[35%] left-10 bg-gray-900 rounded-full"></div>
          <input 
          onClick={() => {
            setPanelOpen(true);
            setActiveField('pickup');
            fetchSuggestions(pickup, 'pickup');
          }}
          value={pickup}
          onChange={(e) => handleInputChange(e, 'pickup')}
          className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5' 
          type="text" 
          placeholder='Add a pick-up location'></input>
          <input 
          onClick={() => {
            setPanelOpen(true);
            setActiveField('destination');
            fetchSuggestions(destination, 'destination');
          }}
          value={destination}
          onChange={(e) => handleInputChange(e, 'destination')}
          className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3'
          type="text" 
          placeholder='Enter your destination'></input>
        </form>
        <button onClick={findTrip}
        className='bg-black text-white px-6 py-2 rounded-lg mt-4 w-1/2 font-semibold mx-auto block'>
          Find a trip
        </button>
        </div>

        <div ref={panelRef} className=' bg-white h-0'>
            <LocationSearchPanel 
                setPanelOpen={setPanelOpen} 
                setVehiclePanel={setVehiclePanel}
                activeField={activeField}
                currentInput={activeField === 'pickup' ? pickup : destination}
                onSuggestionSelect={handleSuggestionSelect}
                suggestions={suggestions}
                isLoading={isLoading}
            />
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-14'>
        <VehiclePanel 
          fare={fare} 
          selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel} 
          setVehiclePanel={setVehiclePanel}
        />
      </div>
       <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
         <ConfirmedRide 
          setConfirmRidePanel={setConfirmRidePanel} 
          setVehicleFound={setVehicleFound}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          onRideCreated={handleRideCreated}
         
          />
         
      </div>    
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
         <LookingForDriver 
           setVehicleFound={setVehicleFound}
           pickup={pickup}
           destination={destination}
           fare={fare}
           vehicleType={vehicleType}
         />
      </div>  
       <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'>
         <WaitingForDriver 
         ride={ride}
         setVehicleFound={setVehicleFound}
         setWaitingForDriver={setWaitingForDriver}
         waitingForDriver={waitingForDriver}
         />
      </div>  
    </div>
  )
}

export default Home