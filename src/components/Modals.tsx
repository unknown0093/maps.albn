import { useState, useRef, useCallback } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  Search,
  ChevronLeft,
  Layers,
  Users,
} from 'lucide-react';
import type { ActiveView, User as UserType, Zone, Category, Activity as ActivityType } from '../App';

interface ModalsOverlayProps {
  view: ActiveView;
  darkMode: boolean;
  textClass: string;
  onClose: () => void;
  users: UserType[];
  onAddUser: (user: Omit<UserType, 'id'>) => void;
  onDeleteUser: (id: string) => void;
  zones: Zone[];
  onAddZone: (zone: Omit<Zone, 'id'>) => void;
  onDeleteZone: (id: string) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  activities: ActivityType[];
}

export function ModalsOverlay({
  view,
  darkMode,
  textClass,
  onClose,
  users,
  onAddUser,
  onDeleteUser,
  zones,
  onAddZone,
  onDeleteZone,
  categories,
  onAddCategory,
  activities,
}: ModalsOverlayProps) {
  const glassClass = darkMode
    ? 'bg-slate-900/95 backdrop-blur-xl border border-white/10'
    : 'bg-white/90 backdrop-blur-xl border border-white/40';

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all ${
    darkMode
      ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500'
      : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500'
  }`;

  const btnPrimary =
    'px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20';
  const btnDanger =
    'p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all';

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden ${glassClass}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            darkMode ? 'border-white/10' : 'border-slate-200/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {view === 'manageUsers' && 'Manage Users'}
              {view === 'manageZones' && 'Manage Zones'}
              {view === 'dataUpload' && 'Data Upload'}
              {view === 'activityLog' && 'Activity Log'}
              {view === 'locations' && 'Locations List'}
              {view === 'dashboard' && 'Dashboard Overview'}
            </h2>
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

        {/* Body */}
        <div className="overflow-y-auto custom-scrollbar p-6" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {view === 'manageUsers' && (
            <ManageUsers
              darkMode={darkMode}
              textClass={textClass}
              users={users}
              onAddUser={onAddUser}
              onDeleteUser={onDeleteUser}
              inputClass={inputClass}
              btnPrimary={btnPrimary}
              btnDanger={btnDanger}
            />
          )}
          {view === 'manageZones' && (
            <ManageZones
              darkMode={darkMode}
              textClass={textClass}
              zones={zones}
              onAddZone={onAddZone}
              onDeleteZone={onDeleteZone}
              inputClass={inputClass}
              btnPrimary={btnPrimary}
              btnDanger={btnDanger}
            />
          )}
          {view === 'dataUpload' && (
            <DataUpload
              darkMode={darkMode}
              textClass={textClass}
              categories={categories}
              onAddCategory={onAddCategory}
              inputClass={inputClass}
              btnPrimary={btnPrimary}
            />
          )}
          {view === 'activityLog' && (
            <ActivityLog
              darkMode={darkMode}
              textClass={textClass}
              activities={activities}
            />
          )}
          {view === 'locations' && (
            <LocationsList darkMode={darkMode} textClass={textClass} />
          )}
          {view === 'dashboard' && (
            <DashboardOverview darkMode={darkMode} textClass={textClass} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================== MANAGE USERS ======================== */
function ManageUsers({
  darkMode,
  textClass,
  users,
  onAddUser,
  onDeleteUser,
  inputClass,
  btnPrimary,
  btnDanger,
}: {
  darkMode: boolean;
  textClass: string;
  users: UserType[];
  onAddUser: (u: Omit<UserType, 'id'>) => void;
  onDeleteUser: (id: string) => void;
  inputClass: string;
  btnPrimary: string;
  btnDanger: string;
}) {
  void textClass;
  const [form, setForm] = useState({ name: '', role: 'Field Agent', email: '', password: '' });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) return;
    onAddUser(form);
    setForm({ name: '', role: 'Field Agent', email: '', password: '' });
    setShowForm(false);
  };

  void textClass; // used for theming

  const thClass = `text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${
    darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-slate-50'
  }`;
  const tdClass = `px-4 py-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {users.length} users registered
        </p>
        <button onClick={() => setShowForm(!showForm)} className={btnPrimary}>
          <Plus size={15} className="inline mr-1.5" />
          Add User
        </button>
      </div>

      {showForm && (
        <div
          className={`p-5 rounded-2xl space-y-3 ${
            darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'
          }`}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <UserIcon size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                className={`${inputClass} pl-9`}
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <select
              className={inputClass}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Field Agent">Field Agent</option>
              <option value="Analyst">Analyst</option>
              <option value="Viewer">Viewer</option>
            </select>
            <div className="relative">
              <Mail size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                className={`${inputClass} pl-9`}
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                className={`${inputClass} pl-9`}
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                darkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className={btnPrimary}>
              Create User
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Role</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-t transition-colors ${
                  darkMode
                    ? 'border-white/5 hover:bg-white/5'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <td className={tdClass}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className={tdClass}>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'Admin'
                      ? darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                      : darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    <Shield size={11} />
                    {user.role}
                  </span>
                </td>
                <td className={tdClass}>{user.email}</td>
                <td className={tdClass}>
                  <button onClick={() => onDeleteUser(user.id)} className={btnDanger} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================== MANAGE ZONES ======================== */
function ManageZones({
  darkMode,
  textClass,
  zones,
  onAddZone,
  onDeleteZone,
  inputClass,
  btnPrimary,
  btnDanger,
}: {
  darkMode: boolean;
  textClass: string;
  zones: Zone[];
  onAddZone: (z: Omit<Zone, 'id'>) => void;
  onDeleteZone: (id: string) => void;
  inputClass: string;
  btnPrimary: string;
  btnDanger: string;
}) {
  void textClass;
  const [zoneName, setZoneName] = useState('');
  const [geoFile, setGeoFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setGeoFile(file.name);
  }, []);

  const handleCreate = () => {
    if (!zoneName) return;
    onAddZone({ name: zoneName, geojson: geoFile || 'No file uploaded' });
    setZoneName('');
    setGeoFile(null);
  };

  const thClass = `text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${
    darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-slate-50'
  }`;
  const tdClass = `px-4 py-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-5">
      <button onClick={() => {}} className={btnPrimary}>
        <Plus size={15} className="inline mr-1.5" />
        Create Zone
      </button>

      {/* Create Zone Form */}
      <div
        className={`p-5 rounded-2xl space-y-4 ${
          darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'
        }`}
      >
        <input
          className={inputClass}
          placeholder="Zone Name"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
        />

        {/* Drag & Drop */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-500/10'
              : darkMode
              ? 'border-white/10 hover:border-white/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".geojson,.json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setGeoFile(e.target.files[0].name);
            }}
          />
          <Upload
            size={28}
            className={`mx-auto mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
          />
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {geoFile ? geoFile : 'Drag & drop GeoJSON file here'}
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            or click to browse
          </p>
        </div>

        <div className="flex justify-end">
          <button onClick={handleCreate} className={btnPrimary}>
            Create Zone
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={thClass}>Zone Name</th>
              <th className={thClass}>GeoJSON File</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr
                key={zone.id}
                className={`border-t transition-colors ${
                  darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <td className={tdClass}>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
                    {zone.name}
                  </div>
                </td>
                <td className={tdClass}>
                  <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {zone.geojson}
                  </span>
                </td>
                <td className={tdClass}>
                  <button onClick={() => onDeleteZone(zone.id)} className={btnDanger} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================== DATA UPLOAD ======================== */
function DataUpload({
  darkMode,
  textClass,
  categories,
  onAddCategory,
  inputClass,
  btnPrimary,
}: {
  darkMode: boolean;
  textClass: string;
  categories: Category[];
  onAddCategory: (name: string) => void;
  inputClass: string;
  btnPrimary: string;
}) {
  void textClass;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [csvFile, setCsvFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setCsvFile(file.name);
  }, []);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    onAddCategory(newCategory.trim());
    setNewCategory('');
  };

  return (
    <div className="space-y-6">
      {/* CSV Upload */}
      <div>
        <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Upload CSV Data
        </p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-500/10'
              : darkMode
              ? 'border-white/10 hover:border-white/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setCsvFile(e.target.files[0].name);
            }}
          />
          <FileText
            size={36}
            className={`mx-auto mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
          />
          <p className={`text-base font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {csvFile ? csvFile : 'Drag & drop your CSV file here'}
          </p>
          <p className={`text-xs mt-1.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Supports .csv files up to 10MB
          </p>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Select Category
        </p>
        <div className="flex gap-3">
          <select
            className={`${inputClass} flex-1`}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Choose a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Category */}
      <div>
        <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Add New Category
        </p>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Enter new category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button onClick={handleAddCategory} className={btnPrimary}>
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <button className={btnPrimary}>
          <Upload size={15} className="inline mr-1.5" />
          Upload Data
        </button>
      </div>
    </div>
  );
}

/* ======================== ACTIVITY LOG ======================== */
function ActivityLog({
  darkMode,
  activities,
}: {
  darkMode: boolean;
  textClass: string;
  activities: ActivityType[];
}) {
  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
            darkMode
              ? 'bg-white/5 hover:bg-white/8 border border-white/5'
              : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            <Activity size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {activity.userName}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                darkMode ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                {activity.action}
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {activity.locationName}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 text-xs shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <Clock size={12} />
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ======================== LOCATIONS LIST ======================== */
function LocationsList({
  darkMode,
}: {
  darkMode: boolean;
  textClass: string;
}) {
  const locations = [
    { id: 1, name: 'Govt. Primary School, Kot Sabzal', category: 'Schools', zone: 'Zone 1', status: 'Active' },
    { id: 2, name: 'Clinic No. 4, Liaqatpur', category: 'Clinics', zone: 'Zone 2', status: 'Active' },
    { id: 3, name: 'Jamia Mosque, RYK', category: 'Mosques', zone: 'Zone 1', status: 'Active' },
    { id: 4, name: 'Community Hall, Sadiqabad', category: 'Community Centers', zone: 'Zone 3', status: 'Pending' },
    { id: 5, name: 'Central Market, Khanpur', category: 'Markets', zone: 'Zone 2', status: 'Active' },
    { id: 6, name: 'Girls High School, Liaqatpur', category: 'Schools', zone: 'Zone 1', status: 'Active' },
    { id: 7, name: 'Health Center, RYK', category: 'Clinics', zone: 'Zone 3', status: 'Pending' },
    { id: 8, name: 'Al-Noor Mosque', category: 'Mosques', zone: 'Zone 2', status: 'Active' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none ${
              darkMode
                ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500'
                : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
            placeholder="Search locations..."
          />
        </div>
        <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {locations.length} locations
        </span>
      </div>

      <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-slate-50'}`}>
                Location
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-slate-50'}`}>
                Category
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-slate-50'}`}>
                Zone
              </th>
              <th className={`text-left text-xs font-semibold uppercase tracking-wider px-4 py-3 ${darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-slate-50'}`}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr
                key={loc.id}
                className={`border-t transition-colors ${
                  darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    {loc.name}
                  </div>
                </td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {loc.category}
                </td>
                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {loc.zone}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    loc.status === 'Active'
                      ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                      : darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <CheckCircle size={11} />
                    {loc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================== DASHBOARD OVERVIEW ======================== */
function DashboardOverview({
  darkMode,
}: {
  darkMode: boolean;
  textClass: string;
}) {
  const stats = [
    { label: 'Total Locations', value: '247', icon: <MapPin size={20} />, color: 'blue' },
    { label: 'Active Zones', value: '5', icon: <Layers size={20} />, color: 'amber' },
    { label: 'Team Members', value: '12', icon: <Users size={20} />, color: 'green' },
    { label: 'Campaigns', value: '3', icon: <Activity size={20} />, color: 'purple' },
  ];

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: darkMode ? 'bg-blue-500/20' : 'bg-blue-100', text: darkMode ? 'text-blue-400' : 'text-blue-600' },
    amber: { bg: darkMode ? 'bg-amber-500/20' : 'bg-amber-100', text: darkMode ? 'text-amber-400' : 'text-amber-600' },
    green: { bg: darkMode ? 'bg-green-500/20' : 'bg-green-100', text: darkMode ? 'text-green-400' : 'text-green-600' },
    purple: { bg: darkMode ? 'bg-purple-500/20' : 'bg-purple-100', text: darkMode ? 'text-purple-400' : 'text-purple-600' },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl border transition-all ${
              darkMode
                ? 'bg-white/5 border-white/10 hover:bg-white/8'
                : 'bg-white/60 border-white/40 hover:bg-white/80'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[stat.color].bg} ${colorMap[stat.color].text}`}>
              {stat.icon}
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {stat.value}
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40'}`}>
        <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { user: 'Sara Ali', action: 'Added new location', time: '2 min ago' },
            { user: 'Usman Tariq', action: 'Updated campaign data', time: '15 min ago' },
            { user: 'Fatima Noor', action: 'Uploaded CSV batch', time: '1 hr ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.user.charAt(0)}
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {item.user}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.action}
                  </p>
                </div>
              </div>
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
