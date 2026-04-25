import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocateFixed, X } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface LocationData {
  lat: number;
  lng: number;
  name: string;
  category: string;
}

interface MapViewProps {
  mapLayer: 'standard' | 'satellite' | 'terrain';
  activeZones: string[];
  selectedCategories: string[];
  onMarkerClick?: (location: LocationData) => void;
}

const MAP_TILES = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
};

// Sample GeoJSON zones for demonstration
const ZONE_GEOJSON: Record<string, any> = {
  z1: {
    type: 'Feature',
    properties: { name: 'Zone 1' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[69.8, 28.7], [70.3, 28.7], [70.3, 28.3], [69.8, 28.3], [69.8, 28.7]]],
    },
  },
  z2: {
    type: 'Feature',
    properties: { name: 'Zone 2' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[70.0, 28.3], [70.5, 28.3], [70.5, 27.9], [70.0, 27.9], [70.0, 28.3]]],
    },
  },
  z3: {
    type: 'Feature',
    properties: { name: 'Zone 3' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[69.5, 28.6], [70.0, 28.6], [70.0, 28.1], [69.5, 28.1], [69.5, 28.6]]],
    },
  },
  z4: {
    type: 'Feature',
    properties: { name: 'Zone 4' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[70.1, 28.8], [70.7, 28.8], [70.7, 28.4], [70.1, 28.4], [70.1, 28.8]]],
    },
  },
  z5: {
    type: 'Feature',
    properties: { name: 'Zone 5' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[69.6, 28.2], [70.1, 28.2], [70.1, 27.7], [69.6, 27.7], [69.6, 28.2]]],
    },
  },
};

// Distinct vibrant colors per zone
const ZONE_COLORS: Record<string, { color: string; fillColor: string; fillOpacity: number }> = {
  z1: { color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.18 },  // Royal Blue
  z2: { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.18 },  // Emerald Green
  z3: { color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.18 },  // Purple
  z4: { color: '#f97316', fillColor: '#f97316', fillOpacity: 0.18 },  // Sunset Orange
  z5: { color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.18 },  // Rose
};

// Sample location markers
const LOCATIONS: LocationData[] = [
  { lat: 28.4212, lng: 70.2989, name: 'Govt. Primary School, Kot Sabzal', category: 'Schools' },
  { lat: 28.3850, lng: 70.2650, name: 'Clinic No. 4, Liaqatpur', category: 'Clinics' },
  { lat: 28.4500, lng: 70.3200, name: 'Jamia Mosque, RYK', category: 'Mosques' },
  { lat: 28.3600, lng: 70.3500, name: 'Community Hall, Sadiqabad', category: 'Community Centers' },
  { lat: 28.4800, lng: 70.2100, name: 'Central Market, Khanpur', category: 'Markets' },
  { lat: 28.3400, lng: 70.2800, name: 'Girls High School, Liaqatpur', category: 'Schools' },
  { lat: 28.4100, lng: 70.3300, name: 'Health Center, RYK', category: 'Clinics' },
  { lat: 28.4600, lng: 70.2700, name: 'Al-Noor Mosque', category: 'Mosques' },
];

function MapUpdater({ mapLayer }: { mapLayer: string }) {
  const map = useMap();
  useEffect(() => {
    // Re-render tiles when layer changes
  }, [mapLayer, map]);
  return null;
}

function ZoneHighlighter({ activeZones }: { activeZones: string[] }) {
  const map = useMap();

  useEffect(() => {
    // Remove existing zone layers
    map.eachLayer((layer) => {
      if ((layer as any)._isZoneLayer) {
        map.removeLayer(layer);
      }
    });

    activeZones.forEach((zoneId) => {
      const geojson = ZONE_GEOJSON[zoneId];
      if (geojson) {
        const zoneColor = ZONE_COLORS[zoneId] || ZONE_COLORS.z1;
        const layer = L.geoJSON(geojson, {
          style: {
            color: zoneColor.color,
            weight: 3,
            fillColor: zoneColor.fillColor,
            fillOpacity: zoneColor.fillOpacity,
            dashArray: '6 4',
          },
        });
        (layer as any)._isZoneLayer = true;
        layer.addTo(map);
      }
    });
  }, [activeZones, map]);

  return null;
}

function LocationMarkers({
  selectedCategories,
  onMarkerClick,
}: {
  selectedCategories: string[];
  onMarkerClick?: (location: LocationData) => void;
}) {
  const map = useMap();

  useEffect(() => {
    // Remove existing markers
    map.eachLayer((layer) => {
      if ((layer as any)._isLocationMarker) {
        map.removeLayer(layer);
      }
    });

    const filteredLocations =
      selectedCategories.length === 0
        ? LOCATIONS
        : LOCATIONS.filter((loc) => selectedCategories.includes(loc.category));

    filteredLocations.forEach((loc) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        ">
          <div style="
            width: 8px; height: 8px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon });

      // Click handler to open bottom sheet
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(loc);
        }
      });

      (marker as any)._isLocationMarker = true;
      marker.addTo(map);
    });
  }, [selectedCategories, map, onMarkerClick]);

  return null;
}

// Geolocation control — uses useMap() to interact with the map instance
function GeolocationControl({
  onLocating,
  onError,
}: {
  onLocating: (lat: number, lng: number) => void;
  onError: (msg: string) => void;
}) {
  const map = useMap();
  const userMarkerRef = useRef<L.Layer | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser');
      return;
    }

    onLocating(-1, -1); // signal locating state

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Remove existing user marker
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        // Create blue pulse marker
        const pulseIcon = L.divIcon({
          className: '',
          html: `
            <div style="position: relative; width: 20px; height: 20px;">
              <!-- Pulse ring -->
              <div class="geo-pulse-ring" style="
                position: absolute;
                top: 50%; left: 50%;
                width: 20px; height: 20px;
                margin-left: -10px; margin-top: -10px;
                border-radius: 50%;
                background: rgba(59, 130, 246, 0.4);
                border: 2px solid #3b82f6;
              "></div>
              <!-- Center dot -->
              <div style="
                position: absolute;
                top: 50%; left: 50%;
                width: 12px; height: 12px;
                margin-left: -6px; margin-top: -6px;
                border-radius: 50%;
                background: #3b82f6;
                border: 2px solid white;
                box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
              "></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([latitude, longitude], { icon: pulseIcon, zIndexOffset: 1000 });
        marker.addTo(map);
        userMarkerRef.current = marker;

        // Smoothly fly to user location
        map.flyTo([latitude, longitude], 16, {
          duration: 1.5,
          easeLinearity: 0.25,
        });

        onLocating(latitude, longitude);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          onError('Location access denied');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          onError('Location information unavailable');
        } else if (error.code === error.TIMEOUT) {
          onError('Location request timed out');
        } else {
          onError('An unknown error occurred');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Expose handleLocate via a custom event on window
  useEffect(() => {
    const handler = () => handleLocate();
    window.addEventListener('alburhan-locate-me', handler);
    return () => window.removeEventListener('alburhan-locate-me', handler);
  });

  return null;
}

export default function MapView({ mapLayer, activeZones, selectedCategories, onMarkerClick }: MapViewProps) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocating = (lat: number, lng: number) => {
    if (lat === -1 && lng === -1) {
      setLocating(true);
      setGeoError(null);
    } else {
      setLocating(false);
      setUserCoords({ lat, lng });
    }
  };

  const handleGeoError = (msg: string) => {
    setLocating(false);
    setGeoError(msg);
    setTimeout(() => setGeoError(null), 3000);
  };

  const triggerLocate = () => {
    window.dispatchEvent(new Event('alburhan-locate-me'));
  };

  const clearUserLocation = () => {
    setUserCoords(null);
  };

  return (
    <>
      <MapContainer
        center={[28.4212, 70.2989]}
        zoom={12}
        zoomControl={false}
        className="absolute inset-0 z-0"
      >
        <TileLayer
          key={mapLayer}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={MAP_TILES[mapLayer]}
        />
        <MapUpdater mapLayer={mapLayer} />
        <ZoneHighlighter activeZones={activeZones} />
        <LocationMarkers selectedCategories={selectedCategories} onMarkerClick={onMarkerClick} />
        <GeolocationControl onLocating={handleLocating} onError={handleGeoError} />
      </MapContainer>

      {/* Find My Location Button — bottom-left */}
      <button
        onClick={triggerLocate}
        disabled={locating}
        className={`absolute bottom-8 left-8 z-30 p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
          locating
            ? 'bg-blue-500/80 backdrop-blur-xl text-white animate-pulse'
            : 'bg-white/80 backdrop-blur-xl border border-white/40 text-slate-700 hover:bg-white/90'
        }`}
        title="Find My Location"
      >
        <LocateFixed size={20} />
      </button>

      {/* Geolocation Error Toast */}
      {geoError && (
        <div className="animate-toast-in absolute bottom-24 left-8 z-30">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/90 backdrop-blur-xl text-white text-sm font-medium shadow-lg">
            <X size={14} />
            {geoError}
          </div>
        </div>
      )}

      {/* User Location Info Badge */}
      {userCoords && (
        <div className="absolute bottom-24 left-8 z-30">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/90 backdrop-blur-xl text-white text-xs font-medium shadow-lg">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Your Location: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
            <button
              onClick={clearUserLocation}
              className="ml-1 p-0.5 rounded hover:bg-white/20 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
