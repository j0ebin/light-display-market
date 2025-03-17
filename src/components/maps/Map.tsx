
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJpZmViIiwiYSI6ImNqOW1ndDJ3eDBzanMzM3F6ZTZiYWk3aTUifQ.OQ3YHA1tVZIREuS37uOn4g';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  interactive?: boolean;
  markerTitle?: string;
}

const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  zoom = 13,
  className = "h-[250px] w-full rounded-md overflow-hidden",
  interactive = true,
  markerTitle
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Create map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
      interactive: interactive,
      attributionControl: false
    });

    // Add navigation controls if interactive
    if (interactive) {
      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );
    }

    // Add marker at specified coordinates
    marker.current = new mapboxgl.Marker({ color: '#ff0000' })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Add popup with title if provided
    if (markerTitle) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<p class="font-medium">${markerTitle}</p>`);
      
      marker.current.setPopup(popup);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, zoom, interactive, markerTitle]);

  return <div ref={mapContainer} className={className} />;
};

export default Map;
