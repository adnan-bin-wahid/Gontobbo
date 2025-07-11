# Location Search Feature Documentation

## Overview
The location search feature allows users to search for locations using the Google Maps Places API. As users type in pickup or destination fields, suggestions are fetched from the backend and displayed. When a suggestion is clicked, it populates the corresponding field.

## Components Involved

### Home.jsx
- Manages the state for pickup and destination fields
- Handles API calls to fetch suggestions
- Determines which field (pickup or destination) is active
- Passes relevant props to LocationSearchPanel component

### LocationSearchPanel.jsx
- Displays location suggestions
- Fetches suggestions based on the current input
- Shows loading state while fetching
- Falls back to static locations if no suggestions are found

## Implementation Details

### Suggestion Fetching
When a user types in either pickup or destination field, a debounced API call is made to the backend endpoint `/maps/get-suggestions` with the current input as a parameter. The backend then uses Google Maps Places API to fetch relevant suggestions.

```javascript
const fetchSuggestions = async (input, field) => {
  if (input.length < 3) {
    setSuggestions([]);
    return;
  }
  
  try {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const response = await axios.get('/maps/get-suggestions', {
      params: { input },
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
```

### Suggestion Selection
When a suggestion is clicked, the corresponding field (pickup or destination) is updated with the selected location:

```javascript
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
```

## API Usage

### Backend Endpoint
`GET /maps/get-suggestions`

**Parameters:**
- `input` (query): The text to search for location suggestions

**Headers:**
- `Authorization`: Bearer token for authentication

**Response:**
Array of suggestion objects with the following format:
```json
[
  {
    "description": "Full location name",
    "place_id": "Google Place ID",
    "structured_formatting": {
      "main_text": "Primary location name",
      "secondary_text": "Additional location details"
    }
  },
  ...
]
```

## User Experience Flow
1. User clicks on either pickup or destination field
2. LocationSearchPanel opens
3. User types at least 3 characters
4. Suggestions appear both under the input and in the panel
5. User clicks on a suggestion
6. Selected field is populated with the suggestion text
7. LocationSearchPanel closes
8. VehiclePanel opens for the next step in the booking flow
