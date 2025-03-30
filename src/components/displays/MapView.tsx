import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Display } from '@/types/sequence';

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapViewProps {
  displays: Array<Display & { latitude: number | null; longitude: number | null }>;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ displays, className = "h-[600px] w-full rounded-md overflow-hidden" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const navigate = useNavigate();
  
  // Filter displays to only include those with valid coordinates
  const validDisplays = displays.filter(
    (display): display is Display & { latitude: number; longitude: number } => 
      typeof display.latitude === 'number' && 
      typeof display.longitude === 'number'
  );

  useEffect(() => {
    if (!mapContainer.current) return;
    if (validDisplays.length === 0) return;
    
    // Create map instance if it doesn't exist
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Center on US by default
        zoom: 3
      });
      
      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );
    }
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Calculate bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds();
    
    // Add markers for each display
    validDisplays.forEach(display => {
      if (typeof display.latitude !== 'number' || typeof display.longitude !== 'number') return;
      
      // Add point to bounds
      bounds.extend([display.longitude, display.latitude]);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${display.name}</h3>
            <p style="font-size: 12px; margin-bottom: 8px;">${display.location}</p>
            <button 
              id="view-display-${display.id}" 
              style="
                background-color: #6366F1; 
                color: white; 
                border: none; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                cursor: pointer;
              "
            >
              View Display
            </button>
          </div>
        `);
      
      // Create marker
      const marker = new mapboxgl.Marker()
        .setLngLat([display.longitude, display.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Store the marker in ref
      markers.current.push(marker);
      
      // Add event listener for popup open
      marker.getElement().addEventListener('click', () => {
        // Wait for popup to be added to DOM
        setTimeout(() => {
          const button = document.getElementById(`view-display-${display.id}`);
          if (button) {
            button.addEventListener('click', () => {
              navigate(`/display/${display.id}`);
            });
          }
        }, 10);
      });
    });
    
    // Fit map to bounds if we have multiple displays
    if (validDisplays.length > 1 && map.current) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } 
    // Or center on single display
    else if (validDisplays.length === 1 && map.current) {
      map.current.flyTo({
        center: [validDisplays[0].longitude, validDisplays[0].latitude],
        zoom: 13
      });
    }
    
    // Cleanup function
    return () => {
      // We don't remove the map here, just the markers if component unmounts
      markers.current.forEach(marker => marker.remove());
    };
  }, [validDisplays, navigate]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default MapView;
