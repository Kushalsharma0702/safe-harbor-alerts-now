
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface CrimeDataPoint {
  lat: number;
  lng: number;
  weight: number;
  type: string;
}

const GoogleMapsHeatmap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock crime data for Chandigarh
  const crimeData: CrimeDataPoint[] = [
    { lat: 30.7333, lng: 76.7794, weight: 8, type: 'Cyberbullying' },
    { lat: 30.7411, lng: 76.7681, weight: 6, type: 'Harassment' },
    { lat: 30.7267, lng: 76.7789, weight: 9, type: 'Hate Speech' },
    { lat: 30.7318, lng: 76.7686, weight: 4, type: 'Blackmail' },
    { lat: 30.7350, lng: 76.7815, weight: 7, type: 'Cyberbullying' },
    { lat: 30.7298, lng: 76.7734, weight: 5, type: 'Gender Bias' },
    { lat: 30.7156, lng: 76.7854, weight: 3, type: 'Racism' },
    { lat: 30.7423, lng: 76.7634, weight: 8, type: 'Harassment' },
  ];

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        const loader = new Loader({
          apiKey: 'AIzaSyDbYrltvA1sIr6RwQYNbXSuASa-2fojLy0',
          version: 'weekly',
          libraries: ['visualization', 'geometry']
        });

        await loader.load();
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 30.7333, lng: 76.7794 }, // Chandigarh center
          zoom: 13,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'all',
              stylers: [{ saturation: -20 }]
            }
          ]
        });

        // Create heatmap data
        const heatmapData = crimeData.map(point => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          weight: point.weight
        }));

        // Create heatmap layer
        const heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: mapInstance,
          radius: 50,
          opacity: 0.8,
          gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
          ]
        });

        // Add markers for individual incidents
        crimeData.forEach((point, index) => {
          const marker = new google.maps.Marker({
            position: { lat: point.lat, lng: point.lng },
            map: mapInstance,
            title: `${point.type} - Severity: ${point.weight}/10`,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="${point.weight > 7 ? '#dc2626' : point.weight > 4 ? '#f59e0b' : '#10b981'}" stroke="white" stroke-width="2"/>
                  <circle cx="10" cy="10" r="4" fill="white"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(20, 20)
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h4 class="font-semibold text-gray-900">${point.type}</h4>
                <p class="text-sm text-gray-600">Severity: ${point.weight}/10</p>
                <p class="text-xs text-gray-500">Lat: ${point.lat.toFixed(4)}, Lng: ${point.lng.toFixed(4)}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
        });

        setMap(mapInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 rounded-lg shadow-lg" />
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Crime Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">High Severity (7-10)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Medium Severity (4-6)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Low Severity (1-3)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsHeatmap;
