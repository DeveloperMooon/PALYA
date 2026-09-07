import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  PawPrint,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ArrowRight,
  Upload,
  X,
  Sparkles
} from 'lucide-react';
import { Animal, ScreenId } from '../../types';

interface LivestockScreenProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
  onNavigate: (screen: ScreenId) => void;
  onRegisterAnimal: (newAnimal: Animal) => void;
}

export const LivestockScreen: React.FC<LivestockScreenProps> = ({
  animals,
  onSelectAnimal,
  onNavigate,
  onRegisterAnimal
}) => {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [withdrawalFilter, setWithdrawalFilter] = useState('All');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Animal Form
  const [newTag, setNewTag] = useState('UK-72819-339');
  const [newSpecies, setNewSpecies] = useState<'Cattle' | 'Buffalo' | 'Goat' | 'Sheep'>('Cattle');
  const [newBreed, setNewBreed] = useState('Sahiwal');
  const [newGender, setNewGender] = useState<'Female' | 'Male'>('Female');
  const [newAge, setNewAge] = useState('3.5 years');
  const [newWeight, setNewWeight] = useState('380');
  const [newName, setNewName] = useState('Kasturi');

  const filteredAnimals = animals.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.tag.toLowerCase().includes(search.toLowerCase()) ||
      (a.name && a.name.toLowerCase().includes(search.toLowerCase())) ||
      a.breed.toLowerCase().includes(search.toLowerCase());

    const matchesSpecies = speciesFilter === 'All' || a.species === speciesFilter;
    const matchesStatus = statusFilter === 'All' || a.healthStatus === statusFilter;
    const matchesWithdrawal =
      withdrawalFilter === 'All' ||
      (withdrawalFilter === 'Active' && a.withdrawalStatus === 'Active') ||
      (withdrawalFilter === 'Clear' && a.withdrawalStatus !== 'Active');

    return matchesSearch && matchesSpecies && matchesStatus && matchesWithdrawal;
  });

  const handleCreateAnimal = (e: React.FormEvent) => {
    
    e.preventDefault();
    const newAnimalObj: Animal = {
      id: `COW-0${Math.floor(Math.random() * 80 + 30)}`,
      tag: newTag,
      name: newName,
      species: newSpecies,
      breed: newBreed,
      gender: newGender,
      age: newAge,
      weight: Number(newWeight) || 400,
      farmName: 'Shiv Dairy Farm / Pen A',
      farmId: 'FARM-UP-001',
      healthStatus: 'Healthy',
      withdrawalStatus: 'None',
      riskLevel: 'Low',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAScl4jPd8yHNdv6KVbNKt9MwsgxcEpQvq2Oj1Jwct3dBCFPNFT9n_pn1jkAWVK9_okxHobhi5JfBPuwzoWvSP96p25d04sO5Yd5p4KtdsA4OsYRaJ74-r2IlNB9ap8Mnm94UeOq8Y8bJHlp5h2t1Uil90N2mVLmeFOjMYATnqILLVJPosXFU2eDoV6tJt8fm5l3m_hSafAV6_u8c-sO0-XAt0MG6_g6MwL2mDNKMwe6mRYji0B_LcLUA'
    };
    onRegisterAnimal(newAnimalObj);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Livestock Management
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Search, monitor, and register animals with active electronic health passports and withdrawal tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-register-modal"
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-secondary-container" />
            <span>Register Animal</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            id="livestock-search"
            type="text"
            placeholder="Search by ID, Tag, or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none"
        >
          <option value="All">All Species</option>
          <option value="Cattle">Cattle</option>
          <option value="Buffalo">Buffalo</option>
          <option value="Goat">Goat</option>
          <option value="Sheep">Sheep</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none"
        >
          <option value="All">Any Health Status</option>
          <option value="Healthy">Healthy</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Under Treatment">Under Treatment</option>
          <option value="High Risk">High Risk</option>
        </select>

        <select
          value={withdrawalFilter}
          onChange={(e) => setWithdrawalFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none"
        >
          <option value="All">All Withdrawal</option>
          <option value="Active">Active Withdrawal</option>
          <option value="Clear">Cleared / None</option>
        </select>
      </div>

      {/* Grid of Animal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {/* Register Animal Dashed Card */}
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="p-6 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low/50 hover:bg-surface-container-low transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[280px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-container group-hover:bg-primary-container text-primary group-hover:text-on-primary-container flex items-center justify-center transition-colors mb-3">
            <Plus className="w-7 h-7" />
          </div>
          <span className="text-base font-bold text-primary">Register Animal</span>
          <p className="text-xs text-on-surface-variant mt-1.5 max-w-[200px]">
            Add a new animal to the farm herd with ear tag, breed, and baseline records.
          </p>
        </button>

        {/* Existing Animals */}
        {filteredAnimals.map((animal) => (
          <div
            key={animal.id}
            onClick={() => onSelectAnimal(animal)}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="relative mb-3.5 overflow-hidden rounded-xl h-40 bg-surface-container">
                <img
                  src={animal.imageUrl}
                  alt={animal.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-primary/90 backdrop-blur-xs text-on-primary text-xs font-black px-2 py-0.5 rounded-md">
                    {animal.id}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  {animal.withdrawalStatus === 'Active' ? (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Active ({animal.withdrawalDaysLeft}d)
                    </span>
                  ) : (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Clear
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-primary">
                    {animal.name || animal.id}
                  </h3>
                  <p className="text-xs text-outline font-mono">{animal.tag}</p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    animal.healthStatus === 'Healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : animal.healthStatus === 'High Risk'
                      ? 'bg-error-container text-error'
                      : animal.healthStatus === 'Monitoring'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-blue-100 text-blue-900'
                  }`}
                >
                  {animal.healthStatus}
                </span>
              </div>

              <div className="mt-3 text-xs text-on-surface-variant space-y-1">
                <p>
                  <strong className="text-on-surface">Breed:</strong> {animal.species} ({animal.breed})
                </p>
                <p>
                  <strong className="text-on-surface">Age / Wt:</strong> {animal.age} • {animal.weight} kg
                </p>
                <p className="truncate">
                  <strong className="text-on-surface">Farm:</strong> {animal.farmName}
                </p>
                <p className="truncate">
                  <strong className="text-on-surface">Last Trt:</strong> {animal.lastTreatmentDrug || 'None'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between">
              <span className="text-[11px] font-bold text-outline">Risk: {animal.riskLevel}</span>
              <span className="text-xs font-bold text-primary group-hover:text-secondary flex items-center gap-1">
                <span>View Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Animal Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
              <h3 className="text-lg font-bold text-primary">Register Livestock Ear Tag</h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Tag ID</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Animal Name / Alias</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Species</label>
                  <select
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-white"
                  >
                    <option value="Cattle">Cattle</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Breed</label>
                  <input
                    type="text"
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Age</label>
                  <input
                    type="text"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold shadow-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
