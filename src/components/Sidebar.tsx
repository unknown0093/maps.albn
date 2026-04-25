import {
  LayoutDashboard,
  Map,
  List,
  Upload,
  Users,
  Layers,
  Sun,
  Moon,
  X,
  Type,
} from 'lucide-react';
import type { ActiveView } from '../App';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activeView: ActiveView;
  onNav: (view: ActiveView) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  textSize: 'sm' | 'md' | 'lg';
  onTextSizeChange: (size: 'sm' | 'md' | 'lg') => void;
  textClass: string;
}

const navItems: { view: ActiveView; icon: React.ReactNode; label: string }[] = [
  {
    view: 'dashboard',
    icon: <LayoutDashboard size={18} />,
    label: 'Dashboard Overview',
  },
  {
    view: 'map',
    icon: <Map size={18} />,
    label: 'Campaign Map',
  },
  {
    view: 'locations',
    icon: <List size={18} />,
    label: 'Locations List',
  },
  {
    view: 'dataUpload',
    icon: <Upload size={18} />,
    label: 'Data Upload',
  },
  {
    view: 'manageUsers',
    icon: <Users size={18} />,
    label: 'Manage Users',
  },
  {
    view: 'manageZones',
    icon: <Layers size={18} />,
    label: 'Manage Zones',
  },
  {
    view: 'activityLog',
    icon: <List size={18} />,
    label: 'Activity Log',
  },
];

export default function Sidebar({
  open,
  onClose,
  activeView,
  onNav,
  darkMode,
  onToggleDark,
  textSize,
  onTextSizeChange,
}: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${
          darkMode
            ? 'bg-slate-900/95 backdrop-blur-xl border-r border-white/10'
            : 'bg-white/80 backdrop-blur-xl border-r border-white/40'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-5 border-b ${darkMode ? 'border-white/10' : 'border-slate-200/60'}`}>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute -inset-1 bg-yellow-400/30 blur-md rounded-full" />
                <img
                  src="https://i.postimg.cc/pXT8p6Hw/AL-BURHAN-LOGO.png"
                  alt="Al-Burhan"
                  className="relative h-8 w-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Al-Burhan
              </span>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeView === item.view;
                return (
                  <li key={item.view}>
                    <button
                      onClick={() => onNav(item.view)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? darkMode
                            ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                            : 'bg-blue-50 text-blue-700 shadow-sm'
                          : darkMode
                          ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                          : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                      }`}
                    >
                      <span className={isActive ? (darkMode ? 'text-blue-400' : 'text-blue-600') : ''}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className={`px-4 py-4 border-t space-y-4 ${darkMode ? 'border-white/10' : 'border-slate-200/60'}`}>
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Theme
              </span>
              <button
                onClick={onToggleDark}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  darkMode
                    ? 'bg-white/10 text-yellow-400 hover:bg-white/15'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Text Size */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Text Size
              </span>
              <div className={`flex items-center rounded-lg overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                {(['sm', 'md', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => onTextSizeChange(size)}
                    className={`px-2.5 py-1 text-xs font-bold transition-all ${
                      textSize === size
                        ? darkMode
                          ? 'bg-blue-500/30 text-blue-400'
                          : 'bg-blue-100 text-blue-700'
                        : darkMode
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Type size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
