import {
  SlidersHorizontal,
  MapPin,
  X,
  Satellite,
  Mountain,
  Globe,
  School,
  Heart,
  Building2,
  Users,
  Store,
  Check,
} from 'lucide-react';
import type { Category, MapLayer } from '../App';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Schools: <School size={14} />,
  Clinics: <Heart size={14} />,
  Mosques: <Building2 size={14} />,
  'Community Centers': <Users size={14} />,
  Markets: <Store size={14} />,
};

interface MapControlsProps {
  darkMode: boolean;
  showControls: boolean;
  onToggleControls: () => void;
  showZoneController: boolean;
  onToggleZoneController: () => void;
  mapLayer: MapLayer['type'];
  onMapLayerChange: (layer: MapLayer['type']) => void;
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
  activeZones: string[];
  onToggleZone: (zoneId: string) => void;
  onClearAllZones: () => void;
}

const ZONES = [
  { id: 'z1', name: 'Zone 1' },
  { id: 'z2', name: 'Zone 2' },
  { id: 'z3', name: 'Zone 3' },
  { id: 'z4', name: 'Zone 4' },
  { id: 'z5', name: 'Zone 5' },
];

const LAYER_OPTIONS: { type: MapLayer['type']; label: string; icon: React.ReactNode }[] = [
  { type: 'satellite', label: 'Satellite', icon: <Satellite size={14} /> },
  { type: 'terrain', label: 'Terrain', icon: <Mountain size={14} /> },
  { type: 'standard', label: 'Standard', icon: <Globe size={14} /> },
];

export default function MapControls({
  darkMode,
  showControls,
  onToggleControls,
  showZoneController,
  onToggleZoneController,
  mapLayer,
  onMapLayerChange,
  categories,
  selectedCategories,
  onToggleCategory,
  activeZones,
  onToggleZone,
  onClearAllZones,
}: MapControlsProps) {
  const glassClass = darkMode
    ? 'bg-slate-800/90 backdrop-blur-xl border border-white/10'
    : 'bg-white/80 backdrop-blur-xl border border-white/40';

  return (
    <>
      {/* Top-Left Controls */}
      <div className="absolute top-20 left-5 z-10">
        <button
          onClick={onToggleControls}
          className={`p-2.5 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 ${glassClass} ${
            darkMode ? 'text-white' : 'text-slate-700'
          }`}
          title="Map Controls"
        >
          <SlidersHorizontal size={18} />
        </button>

        {showControls && (
          <div
            className={`absolute top-14 left-0 w-64 rounded-2xl shadow-xl overflow-hidden ${glassClass}`}
          >
            <div className="p-4 space-y-4">
              {/* Map Layer */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Map Layer
                </p>
                <div className="space-y-1">
                  {LAYER_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => onMapLayerChange(opt.type)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        mapLayer === opt.type
                          ? darkMode
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-blue-50 text-blue-700'
                          : darkMode
                          ? 'text-slate-300 hover:bg-white/5'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                      {mapLayer === opt.type && <Check size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Categories
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onToggleCategory(cat.name)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategories.includes(cat.name)
                          ? darkMode
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-blue-50 text-blue-700'
                          : darkMode
                          ? 'text-slate-300 hover:bg-white/5'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {CATEGORY_ICONS[cat.name] || <MapPin size={14} />}
                      <span>{cat.name}</span>
                      {selectedCategories.includes(cat.name) && <Check size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom-Right Zone Controller */}
      <div className="absolute bottom-6 right-5 z-10">
        <button
          onClick={onToggleZoneController}
          className={`p-2.5 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 ${glassClass} ${
            darkMode ? 'text-white' : 'text-slate-700'
          }`}
          title="Zone Controller"
        >
          <MapPin size={18} />
        </button>

        {showZoneController && (
          <div
            className={`absolute bottom-14 right-0 w-64 rounded-2xl shadow-xl overflow-hidden ${glassClass}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Zone Controller
                </p>
                <button
                  onClick={onToggleZoneController}
                  className={`p-1 rounded-lg ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Zone list */}
              <div className="space-y-1 mb-3">
                {ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => onToggleZone(zone.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeZones.includes(zone.id)
                        ? darkMode
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-amber-50 text-amber-700'
                        : darkMode
                        ? 'text-slate-300 hover:bg-white/5'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        activeZones.includes(zone.id)
                          ? 'bg-amber-500 border-amber-500'
                          : darkMode
                          ? 'border-slate-500'
                          : 'border-slate-300'
                      }`}
                    />
                    <span>{zone.name}</span>
                  </button>
                ))}
              </div>

              {/* Clear All */}
              {activeZones.length > 0 && (
                <>
                  <button
                    onClick={onClearAllZones}
                    className={`w-full py-2 rounded-lg text-xs font-medium transition-all mb-2 ${
                      darkMode
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    Clear All Zones
                  </button>
                  <p className={`text-center text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Total Locations: {activeZones.length * 12}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
