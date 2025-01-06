"use client";

import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.75rem'
};

const defaultCenter = {
  lat: 50.9359,
  lng: -1.3959
};

export default function MapComponent({ id }) {
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const geocodeLocation = async () => {
      try {
        let response;
        
        if (id) {
          response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?place_id=${encodeURIComponent(id)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
        } 

        const data = await response.json();
        console.log('Geocoding response:', data);

        if (data.status === 'OK' && data.results && data.results[0]) {
          const location = data.results[0].geometry.location;
          setCoordinates(location);
          setError(null);
        } else {
          console.error('Geocoding failed:', data.status);
          setError('Location not found');
        }
      } catch (err) {
        console.error('Map error:', err);
        setError('Failed to load map');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && id) {
      geocodeLocation();
    }
  }, [id, isLoaded]);

  if (loadError) return <div className="h-[300px] bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400">Error loading maps</div>;
  if (!isLoaded) return <div className="h-[300px] bg-gray-800/50 rounded-xl animate-pulse" />;
  if (loading) return <div className="h-[300px] bg-gray-800/50 rounded-xl animate-pulse" />;
  if (error) return <div className="h-[300px] bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400">{error}</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coordinates}
      zoom={17}
    >
      <Marker position={coordinates} />
    </GoogleMap>
  );
} 