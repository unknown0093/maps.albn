import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, ChevronDown, X, CheckCircle, Save } from 'lucide-react';

interface BottomSheetProps {
  darkMode: boolean;
  location: {
    lat: number;
    lng: number;
    name: string;
    category: string;
  };
  onClose: () => void;
  readOnly?: boolean;
  isLoggedIn?: boolean;
}

export default function BottomSheet({ darkMode, location, onClose, readOnly = false, isLoggedIn = false }: BottomSheetProps) {
  const [status, setStatus] = useState<'Pending' | 'Done'>('Pending');
  const [description, setDescription] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleSave = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-30 transition-all duration-300 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div
        className={`rounded-2xl shadow-2xl overflow-hidden ${
          darkMode
            ? 'bg-slate-900/95 backdrop-blur-xl border border-white/10'
            : 'bg-white/90 backdrop-blur-xl border border-white/40'
        }`}
      >
        {/* Save Success Toast */}
        {showSaveToast && (
          <div className="animate-toast-in absolute -top-12 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500 text-white text-sm font-medium shadow-lg shadow-green-500/30">
              <CheckCircle size={16} />
              Changes Saved Successfully
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Left: Image Placeholder */}
          <div className="md:w-72 shrink-0 relative">
            <div
              className={`w-full h-48 md:h-full min-h-[12rem] flex flex-col items-center justify-center gap-3 ${
                darkMode ? 'bg-slate-800/80' : 'bg-gradient-to-br from-slate-100 to-slate-200'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-white/10' : 'bg-white/80 shadow-sm'
                }`}
              >
                <MapPin
                  size={28}
                  className={darkMode ? 'text-blue-400' : 'text-blue-600'}
                />
              </div>
              <p
                className={`text-xs font-medium ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Location Photo
              </p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 p-5 space-y-4">
            {/* Header with close */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-lg font-bold truncate ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {location.name}
                </h3>
                <p
                  className={`text-sm mt-0.5 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {location.category}
                </p>
                <p
                  className={`text-xs mt-1 font-mono ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
              <button
                onClick={handleClose}
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  darkMode
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Status */}
            <div>
              <label
                className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Status
              </label>
              {readOnly || !isLoggedIn ? (
                /* Read-only: plain text with badge */
                <div
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm ${
                    darkMode
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <CheckCircle size={14} className="text-amber-500" />
                  <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                    Pending
                  </span>
                </div>
              ) : (
                /* Editable dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setStatusOpen(!statusOpen)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all ${
                      darkMode
                        ? 'bg-white/5 border border-white/10 text-white focus:border-blue-500'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          status === 'Done'
                            ? 'bg-green-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      {status}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {statusOpen && (
                    <div
                      className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl overflow-hidden z-10 ${
                        darkMode
                          ? 'bg-slate-800/95 backdrop-blur-xl border border-white/10'
                          : 'bg-white/95 backdrop-blur-xl border border-slate-200'
                      }`}
                    >
                      {(['Pending', 'Done'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatus(s);
                            setStatusOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                            status === s
                              ? darkMode
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-blue-50 text-blue-700'
                              : darkMode
                              ? 'text-slate-300 hover:bg-white/5'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              s === 'Done' ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                          />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description Textarea — larger for detailed notes */}
            <div>
              <label
                className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Description / Notes
              </label>
              <textarea
                rows={4}
                placeholder="Add detailed notes about this location..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={readOnly || !isLoggedIn}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none transition-all ${
                  readOnly || !isLoggedIn
                    ? darkMode
                      ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-50/50 border border-slate-200 text-slate-400 cursor-not-allowed'
                    : darkMode
                    ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex gap-3">
              {/* Save Details — Admin only */}
              {isLoggedIn && (
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98]"
                >
                  <Save size={16} />
                  Save Details
                </button>
              )}

              {/* Get Directions — Always visible */}
              <button
                onClick={handleDirections}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg active:scale-[0.98] ${
                  isLoggedIn
                    ? 'flex-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/25'
                    : 'w-full bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/25'
                }`}
              >
                <Navigation size={16} />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
