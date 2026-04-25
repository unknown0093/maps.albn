import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import MapControls from './components/MapControls';
import BottomSheet from './components/BottomSheet';
import LoginPage from './components/LoginPage';
import {
  DashboardFullPage,
  LocationsFullPage,
  ManageUsersFullPage,
  ManageZonesFullPage,
  DataUploadFullPage,
  ActivityLogFullPage,
} from './components/FullPageViews';

export type ActiveView =
  | 'dashboard'
  | 'map'
  | 'locations'
  | 'dataUpload'
  | 'manageUsers'
  | 'manageZones'
  | 'activityLog';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;
}

export interface Zone {
  id: string;
  name: string;
  geojson: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Activity {
  id: string;
  userName: string;
  action: string;
  locationName: string;
  time: string;
}

export interface MapLayer {
  type: 'standard' | 'satellite' | 'terrain';
  label: string;
  url: string;
}

export const MAP_LAYERS: MapLayer[] = [
  {
    type: 'standard',
    label: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    type: 'satellite',
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  {
    type: 'terrain',
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  },
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Schools' },
  { id: '2', name: 'Clinics' },
  { id: '3', name: 'Mosques' },
  { id: '4', name: 'Community Centers' },
  { id: '5', name: 'Markets' },
];

export const ZONES = [
  { id: 'z1', name: 'Zone 1' },
  { id: 'z2', name: 'Zone 2' },
  { id: 'z3', name: 'Zone 3' },
  { id: 'z4', name: 'Zone 4' },
  { id: 'z5', name: 'Zone 5' },
];

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Ahmed Khan', role: 'Admin', email: 'ahmed@alburhan.org', password: '••••••••' },
];

export const MOCK_ZONES: Zone[] = [
  { id: 'z1', name: 'Zone 1 — Rahim Yar Khan North', geojson: 'zone1.geojson' },
];

export const MOCK_ACTIVITIES: Activity[] = [];

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerAnimating, setHeaderAnimating] = useState<'visible' | 'hidden' | 'none'>('visible');
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Map state
  const [mapLayer, setMapLayer] = useState<MapLayer['type']>('satellite');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeZones, setActiveZones] = useState<string[]>([]);
  const [showMapControls, setShowMapControls] = useState(false);
  const [showZoneController, setShowZoneController] = useState(false);

  // Data state
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [zones, setZones] = useState<Zone[]>(MOCK_ZONES);
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  // Bottom sheet state
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    category: string;
  } | null>(null);

  // Clock
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode class on body
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // NEW: Supabase Session Listener (Page refresh hone par bhi user logged in rahay ga)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setShowLoginPage(false); // Agar login ho gaya to form hide kar do
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleHeader = useCallback(() => {
    if (headerVisible) {
      setHeaderAnimating('hidden');
      setTimeout(() => {
        setHeaderVisible(false);
        setHeaderAnimating('none');
      }, 300);
    } else {
      setHeaderVisible(true);
      setHeaderAnimating('visible');
    }
  }, [headerVisible]);

  const handleNav = useCallback((view: ActiveView) => {
    setActiveView(view);
    setSidebarOpen(false);
    if (view !== 'map') {
      setSelectedLocation(null);
    }
  }, []);

  const addUser = useCallback((user: Omit<User, 'id'>) => {
    setUsers((prev) => [...prev, { ...user, id: Date.now().toString() }]);
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const addZone = useCallback((zone: Omit<Zone, 'id'>) => {
    setZones((prev) => [...prev, { ...zone, id: Date.now().toString() }]);
  }, []);

  const deleteZone = useCallback((id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  }, []);

  const addCategory = useCallback((name: string) => {
    setCategories((prev) => [...prev, { id: Date.now().toString(), name }]);
  }, []);

  const toggleCategory = useCallback((catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  }, []);

  const toggleZone = useCallback((zoneId: string) => {
    setActiveZones((prev) =>
      prev.includes(zoneId) ? prev.filter((z) => z !== zoneId) : [...prev, zoneId]
    );
  }, []);

  const clearAllZones = useCallback(() => {
    setActiveZones([]);
  }, []);

  const textClass = textSize === 'sm' ? 'text-size-sm' : textSize === 'lg' ? 'text-size-lg' : 'text-size-md';
  const isMapView = activeView === 'map';

  const handleLoginClick = () => {
    setShowLoginPage(true);
  };

  // NEW: Asli Supabase Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setActiveView('map');
    setSelectedLocation(null);
    setSidebarOpen(false);
  };

  if (showLoginPage) {
    // LoginPage ko ab handleLoginSuccess ki zaroorat nahi, Supabase khud handle karega
    return <LoginPage onLogin={() => {}} />;
  }

  return (
    <div className={`relative h-screen w-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Background */}
      <div
        className={`absolute inset-0 z-0 transition-colors duration-500 ${
          darkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900'
            : 'bg-gradient-to-br from-slate-200 via-blue-100 to-slate-100'
        }`}
      />

      {/* Map */}
      {isMapView && (
        <MapView
          mapLayer={mapLayer}
          activeZones={activeZones}
          selectedCategories={selectedCategories}
          onMarkerClick={(loc) => setSelectedLocation(loc)}
        />
      )}

      {/* Header */}
      {headerVisible && (
        <Header
          time={time}
          headerAnimating={headerAnimating}
          darkMode={darkMode}
          onToggleHeader={toggleHeader}
          isLoggedIn={isLoggedIn}
          onLogin={handleLoginClick}
          onLogout={handleLogout}
        />
      )}
      {!headerVisible && (
        <button
          onClick={toggleHeader}
          className={`absolute top-2 left-1/2 -translate-x-1/2 z-50 rounded-full p-2 hover:scale-110 transition-all duration-200 ${
            darkMode ? 'glass-dark text-white' : 'glass text-slate-700'
          }`}
          title="Show Header"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? 'text-white' : 'text-slate-700'}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}

      {/* Sidebar Trigger */}
      {isLoggedIn && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`absolute top-5 left-5 z-20 p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${
            darkMode
              ? 'glass-dark text-white hover:bg-slate-700/80'
              : 'glass text-slate-700 hover:bg-white/90'
          }`}
          title="Open Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      {isLoggedIn && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          onNav={handleNav}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          textSize={textSize}
          onTextSizeChange={setTextSize}
          textClass={textClass}
        />
      )}

      {/* Map Controls */}
      {isMapView && (
        <MapControls
          darkMode={darkMode}
          showControls={showMapControls}
          onToggleControls={() => setShowMapControls(!showMapControls)}
          showZoneController={showZoneController}
          onToggleZoneController={() => setShowZoneController(!showZoneController)}
          mapLayer={mapLayer}
          onMapLayerChange={setMapLayer}
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          activeZones={activeZones}
          onToggleZone={toggleZone}
          onClearAllZones={clearAllZones}
        />
      )}

      {/* Bottom Detail Sheet */}
      {isMapView && selectedLocation && (
        <BottomSheet
          darkMode={darkMode}
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          readOnly={!isLoggedIn}
          isLoggedIn={isLoggedIn}
        />
      )}

      {/* Full-Page Views */}
      {isLoggedIn && !isMapView && activeView === 'dashboard' && <DashboardFullPage darkMode={darkMode} />}
      {isLoggedIn && !isMapView && activeView === 'locations' && <LocationsFullPage darkMode={darkMode} />}
      {isLoggedIn && !isMapView && activeView === 'manageUsers' && (
        <ManageUsersFullPage darkMode={darkMode} users={users} onAddUser={addUser} onDeleteUser={deleteUser} />
      )}
      {isLoggedIn && !isMapView && activeView === 'manageZones' && (
        <ManageZonesFullPage darkMode={darkMode} zones={zones} onAddZone={addZone} onDeleteZone={deleteZone} />
      )}
      {isLoggedIn && !isMapView && activeView === 'dataUpload' && (
        <DataUploadFullPage darkMode={darkMode} categories={categories} onAddCategory={addCategory} />
      )}
      {isLoggedIn && !isMapView && activeView === 'activityLog' && (
        <ActivityLogFullPage darkMode={darkMode} activities={activities} />
      )}
    </div>
  );
}