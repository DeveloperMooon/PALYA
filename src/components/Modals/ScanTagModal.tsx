import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { Animal, ScreenId } from '../../types';

interface ScanTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  animals?: Animal[];
  onSelectAnimalForMrl?: (animal: Animal) => void;
  onSelectAnimalForTreatment?: (animal: Animal) => void;
  onTagScanned?: (tag: string) => void;
}

export const ScanTagModal: React.FC<ScanTagModalProps> = ({
  isOpen,
  onClose,
  animals = [],
  onSelectAnimalForMrl,
  onSelectAnimalForTreatment,
  onTagScanned
}) => {
  const safeAnimals = Array.isArray(animals) && animals.length > 0 ? animals : [];
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(safeAnimals[0] || null);
  const [isScanning, setIsScanning] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  useEffect(() => {
    if (safeAnimals.length > 0 && !selectedAnimal) {
      setSelectedAnimal(safeAnimals[0]);
    }
  }, [safeAnimals, selectedAnimal]);

  if (!isOpen) return null;

  const handleSimulateScan = (animal: Animal) => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedAnimal(animal);
      setIsScanning(false);
    }, 500);
  };

  const handleSearchOrScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const matched = safeAnimals.find(
        (a) =>
          a.tag.toLowerCase().includes(customTagInput.toLowerCase()) ||
          a.id.toLowerCase().includes(customTagInput.toLowerCase())
      );
      if (matched) {
        setSelectedAnimal(matched);
      } else if (onTagScanned) {
        onTagScanned(customTagInput.trim());
        onClose();
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <QrCode className="w-5 h-5 text-secondary-container" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">RFID & Ear Tag Scanner</h3>
              <p className="text-xs text-on-surface-variant">
                Simulate electronic livestock ear tag or NFC bolus reading
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar for Manual Scanning */}
        <form onSubmit={handleSearchOrScan} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter or scan Tag ID (e.g. UK-72819-331)..."
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Scan Tag
          </button>
        </form>

        {/* Quick Tag Selector Carousel */}
        {safeAnimals.length > 0 && (
          <div className="mt-4">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Select Sample Tag to Emulate RFID Reader:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {safeAnimals.slice(0, 4).map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => handleSimulateScan(animal)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedAnimal?.id === animal.id
                      ? 'border-primary bg-secondary-container/20 ring-2 ring-primary/20'
                      : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container-high text-primary">
                      {animal.id}
                    </span>
                    {animal.withdrawalStatus === 'Active' ? (
                      <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-on-surface truncate">{animal.tag}</p>
                  <p className="text-[10px] text-on-surface-variant truncate">{animal.name || animal.species}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scan Result Passport Card */}
        {isScanning ? (
          <div className="my-8 py-12 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <Radio className="w-6 h-6 text-primary absolute" />
            </div>
            <p className="mt-4 text-sm font-bold text-primary">Interrogating RFID Transponder...</p>
            <p className="text-xs text-on-surface-variant">Reading encrypted health signature</p>
          </div>
        ) : selectedAnimal ? (
          <div className="mt-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="flex items-start gap-4">
              <img
                src={selectedAnimal.imageUrl}
                alt={selectedAnimal.id}
                className="w-20 h-20 rounded-xl object-cover border border-outline-variant shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-primary">{selectedAnimal.id}</span>
                    <span className="text-xs text-on-surface-variant">({selectedAnimal.tag})</span>
                  </div>
                  {selectedAnimal.withdrawalStatus === 'Active' ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-error-container text-error flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      WITHDRAWAL ACTIVE
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      CLEARED FOR FOOD CHAIN
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs text-on-surface-variant space-y-1">
                  <p>
                    <strong className="text-on-surface">Breed / Age:</strong> {selectedAnimal.breed} ({selectedAnimal.age}) • {selectedAnimal.weight} kg
                  </p>
                  <p>
                    <strong className="text-on-surface">Farm:</strong> {selectedAnimal.farmName}
                  </p>
                  <p>
                    <strong className="text-on-surface">Last Treatment:</strong> {selectedAnimal.lastTreatmentDrug || 'None'} ({selectedAnimal.lastTreatmentDate})
                  </p>
                </div>

                {selectedAnimal.withdrawalStatus === 'Active' && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>{selectedAnimal.withdrawalDaysLeft} Days Remaining in Withdrawal</span>
                    </div>
                    <span className="font-semibold text-[11px]">Clearance: {selectedAnimal.clearanceDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-3 border-t border-outline-variant/60 flex flex-wrap items-center gap-2 justify-end">
              {onTagScanned && (
                <button
                  onClick={() => {
                    onTagScanned(selectedAnimal.tag);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Health Passport</span>
                </button>
              )}

              {onSelectAnimalForMrl && (
                <button
                  onClick={() => {
                    onSelectAnimalForMrl(selectedAnimal);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <span>Verify MRL Status</span>
                </button>
              )}

              {onSelectAnimalForTreatment && (
                <button
                  onClick={() => {
                    onSelectAnimalForTreatment(selectedAnimal);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-secondary-container" />
                  <span>Record Treatment</span>
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
