import React, { useState, useEffect } from 'react'
import axios from 'axios';

const LocationSearchPanel = (props) => {
    const { setPanelOpen, setVehiclePanel, activeField, currentInput, suggestions, isLoading } = props;
    
    const handleSuggestionSelect = (suggestion) => {
        if (props.onSuggestionSelect) {
            props.onSuggestionSelect(suggestion);
        }
        // setVehiclePanel(true);
        // setPanelOpen(false);
    };
    
    // Fallback static locations if no suggestions are available
    const staticLocations = [
        "23/i, West Tezturi Bazar, Dhaka",
        "108/i, BanglaMotor , Dhaka",
        "45/1, GoldenBrew CoffeeHouse, Dhaka",
    ];
    
    // Only use static locations if we're not loading and have no suggestions
    const displayItems = suggestions && suggestions.length > 0 ? suggestions : 
        (!isLoading ? staticLocations.map(location => ({ description: location })) : []);
    
    return (
        <div>
            {isLoading && (
                <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
            )}
            
            {!isLoading && displayItems.map((item, idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleSuggestionSelect(item)}
                    className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer hover:bg-gray-50'
                >
                    <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'>
                        <i className="ri-map-pin-fill"></i>
                    </h2>
                    <h4 className='font-medium'>{item.description}</h4>
                </div>
            ))}
            
            {!isLoading && displayItems.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                    No suggestions found. Try typing more characters.
                </div>
            )}
        </div>
    );
};

export default LocationSearchPanel;