import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';

const MapView = () => {
  const locations = useLocation();
  const { latitude, longitude,location } = locations.state || {
    latitude: 0,
    longitude: 0,
  }; // Provide fallback to avoid undefined error
  console.log(latitude);
  console.log(longitude);

  const handleMarkerClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank'); // Open in a new tab
  };
  return (<>
 <div className='p-9'>

  
   <h2 className="p-4 text-title-md font-semibold text-black dark:text-white">
         {location}
        </h2>

    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: '60vh', width: '60%' }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
   
      <Marker  position={[latitude, longitude]} eventHandlers={{ click: handleMarkerClick }} >
        <Popup>Selected Location</Popup>
      </Marker>
    </MapContainer>
    </div>
    </>
  );
};

export default MapView;
