import React, { useState } from 'react';
import {
  Search,
  Plus,
  Clock,
  ArrowRight,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react';

import { Animal, ScreenId } from '../../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

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

  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState(false);

  const [deletingAnimalId, setDeletingAnimalId] =
    useState<string | null>(null);

  const [deleteError, setDeleteError] =
    useState('');

  /* =========================================================
     NEW ANIMAL FORM
  ========================================================= */

  const [newTag, setNewTag] =
    useState('UK-72819-339');

  const [newSpecies, setNewSpecies] = useState<
    | 'Cattle'
    | 'Buffalo'
    | 'Goat'
    | 'Sheep'
    | 'Pig'
    | 'Chicken'
    | 'Duck'
    | 'Camel'
  >('Cattle');

  const breedOptions: Record<string, string[]> = {
    Cattle: [
      'Sahiwal',
      'Gir',
      'Red Sindhi',
      'Tharparkar',
      'Holstein Friesian',
      'Jersey'
    ],

    Buffalo: [
      'Murrah',
      'Nili-Ravi',
      'Jaffarabadi',
      'Mehsana',
      'Surti'
    ],

    Goat: [
      'Jamunapari',
      'Beetal',
      'Barbari',
      'Black Bengal',
      'Sirohi'
    ],

    Sheep: [
      'Marwari',
      'Malpura',
      'Deccani',
      'Nellore',
      'Garole'
    ],

    Pig: [
      'Large White Yorkshire',
      'Landrace',
      'Hampshire',
      'Duroc',
      'Ghungroo'
    ],

    Chicken: [
      'Kadaknath',
      'Aseel',
      'Vanaraja',
      'Gramapriya',
      'Leghorn'
    ],

    Duck: [
      'Khaki Campbell',
      'Indian Runner',
      'White Pekin',
      'Muscovy'
    ],

    Camel: [
      'Bikaneri',
      'Jaisalmeri',
      'Kachchhi',
      'Mewari'
    ]
  };

  const [newBreed, setNewBreed] =
    useState('Sahiwal');

  const [newGender, setNewGender] =
    useState<'Female' | 'Male'>('Female');

  const [newAge, setNewAge] =
    useState('3.5 years');

  const [newWeight, setNewWeight] =
    useState('380');

  const [newName, setNewName] =
    useState('Kasturi');

  /* =========================================================
     FILTER ANIMALS
  ========================================================= */

  const filteredAnimals = animals.filter((a) => {
    const matchesSearch =
      a.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      a.tag
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (a.name &&
        a.name
          .toLowerCase()
          .includes(search.toLowerCase())) ||

      a.breed
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSpecies =
      speciesFilter === 'All' ||
      a.species === speciesFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      a.healthStatus === statusFilter;

    const matchesWithdrawal =
      withdrawalFilter === 'All' ||

      (
        withdrawalFilter === 'Active' &&
        a.withdrawalStatus === 'Active'
      ) ||

      (
        withdrawalFilter === 'Clear' &&
        a.withdrawalStatus !== 'Active'
      );

    return (
      matchesSearch &&
      matchesSpecies &&
      matchesStatus &&
      matchesWithdrawal
    );
  });

  /* =========================================================
     SPECIES IMAGES
  ========================================================= */

  const speciesImages: Record<string, string> = {
    Cattle:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Cow_female_black_white.jpg',

    Buffalo:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Water_Buffalo.jpg',

    Goat:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Goat.jpg',

    Sheep:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Domestic_sheep.jpg',

    Pig:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Pig.jpg',

    Chicken:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Chicken.jpg',

    Duck:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Mallard2.jpg',

    Camel:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Camelus_dromedarius.jpg'
  };

  /* =========================================================
     IMAGE FALLBACK
  ========================================================= */

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    species: string
  ) => {
    const image =
      e.currentTarget;

    if (
      image.dataset.fallbackApplied ===
      'true'
    ) {
      image.style.display =
        'none';

      return;
    }

    image.dataset.fallbackApplied =
      'true';

    image.src =
      `https://placehold.co/640x480/17202c/95d3ba?text=${encodeURIComponent(
        species
      )}`;
  };

  /* =========================================================
     CREATE ANIMAL
  ========================================================= */

  const handleCreateAnimal = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const newAnimalObj: Animal = {
      id:
        `ANM-${Math.floor(
          Math.random() * 9000 + 1000
        )}`,

      tag:
        newTag,

      name:
        newName,

      species:
        newSpecies,

      breed:
        newBreed,

      gender:
        newGender,

      age:
        newAge,

      weight:
        Number(newWeight) || 400,

      farmName:
        'Shiv Dairy Farm / Pen A',

      farmId:
        'FARM-UP-001',

      healthStatus:
        'Healthy',

      withdrawalStatus:
        'None',

      riskLevel:
        'Low',

      imageUrl:
        speciesImages[newSpecies]
    };

    onRegisterAnimal(
      newAnimalObj
    );

    setIsRegisterModalOpen(
      false
    );
  };

  /* =========================================================
     DELETE ANIMAL FROM DATABASE
  ========================================================= */

  const handleDeleteAnimal = async (
    animal: Animal
  ) => {
    const animalLabel =
      animal.name
        ? `${animal.name} (${animal.id})`
        : animal.id;

    const confirmed =
      window.confirm(
        `Delete ${animalLabel} permanently from the livestock database?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError('');

      setDeletingAnimalId(
        animal.id
      );

      const response =
        await fetch(
          `${API_BASE_URL}/api/animals/${encodeURIComponent(
            animal.id
          )}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type':
                'application/json'
            }
          }
        );

      let result: any =
        null;

      try {
        result =
          await response.json();
      } catch {
        result =
          null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
          result?.error ||
          `Delete failed (${response.status})`
        );
      }

      /*
        Simple and reliable for demo:
        reload -> animals fetched fresh from backend/database.
      */

      window.location.reload();

    } catch (error) {
      console.error(
        'Animal delete error:',
        error
      );

      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Failed to delete animal.'
      );

    } finally {
      setDeletingAnimalId(
        null
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-6 pb-12">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Livestock Management
          </h1>

          <p className="text-sm text-on-surface-variant mt-1">
            Search, monitor, and register animals with
            active electronic health passports and
            withdrawal tracking.
          </p>

        </div>

        <button
          id="btn-open-register-modal"
          onClick={() =>
            setIsRegisterModalOpen(
              true
            )
          }
          className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >

          <Plus className="w-4 h-4 text-secondary-container" />

          Register Animal

        </button>

      </div>

      {/* DELETE ERROR */}

      {deleteError && (

        <div className="p-4 rounded-xl bg-error-container border border-error/30 flex items-start gap-3">

          <AlertTriangle className="w-5 h-5 text-error shrink-0" />

          <div>

            <p className="text-xs font-black text-on-error-container">
              Unable to delete animal
            </p>

            <p className="text-xs text-on-error-container mt-0.5">
              {deleteError}
            </p>

          </div>

        </div>

      )}

      {/* FILTER BAR */}

      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-xs flex flex-wrap items-center gap-3">

        <div className="relative flex-1 min-w-[240px]">

          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />

          <input
            id="livestock-search"
            type="text"
            placeholder="Search by ID, Tag, or Name..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
          />

        </div>

        <select
          value={speciesFilter}
          onChange={(e) =>
            setSpeciesFilter(
              e.target.value
            )
          }
          className="px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
        >

          <option value="All">
            All Species
          </option>

          <option value="Cattle">
            Cattle
          </option>

          <option value="Buffalo">
            Buffalo
          </option>

          <option value="Goat">
            Goat
          </option>

          <option value="Sheep">
            Sheep
          </option>

          <option value="Pig">
            Pig
          </option>

          <option value="Chicken">
            Chicken
          </option>

          <option value="Duck">
            Duck
          </option>

          <option value="Camel">
            Camel
          </option>

        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
        >

          <option value="All">
            Any Health Status
          </option>

          <option value="Healthy">
            Healthy
          </option>

          <option value="Monitoring">
            Monitoring
          </option>

          <option value="Under Treatment">
            Under Treatment
          </option>

          <option value="High Risk">
            High Risk
          </option>

        </select>

        <select
          value={withdrawalFilter}
          onChange={(e) =>
            setWithdrawalFilter(
              e.target.value
            )
          }
          className="px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
        >

          <option value="All">
            All Withdrawal
          </option>

          <option value="Active">
            Active Withdrawal
          </option>

          <option value="Clear">
            Cleared / None
          </option>

        </select>

      </div>

      {/* ANIMAL GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {/* REGISTER CARD */}

        <button
          onClick={() =>
            setIsRegisterModalOpen(
              true
            )
          }
          className="p-6 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low/50 hover:bg-surface-container-low transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[280px]"
        >

          <div className="w-14 h-14 rounded-2xl bg-surface-container group-hover:bg-primary-container text-primary group-hover:text-on-primary-container flex items-center justify-center transition-colors mb-3">

            <Plus className="w-7 h-7" />

          </div>

          <span className="text-base font-bold text-primary">
            Register Animal
          </span>

          <p className="text-xs text-on-surface-variant mt-1.5 max-w-[200px]">
            Add a new animal to the farm herd with
            ear tag, breed, and baseline records.
          </p>

        </button>

        {/* EXISTING ANIMALS */}

        {filteredAnimals.map(
          (animal) => (

            <div
              key={animal.id}
              onClick={() =>
                onSelectAnimal(
                  animal
                )
              }
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >

              <div>

                {/* IMAGE */}

                <div className="relative mb-3.5 overflow-hidden rounded-xl h-40 bg-surface-container">

                  <img
                    src={
                      speciesImages[
                        animal.species
                      ]
                    }
                    alt={`${animal.species} ${animal.id}`}
                    onError={(e) =>
                      handleImageError(
                        e,
                        animal.species
                      )
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* ID */}

                  <div className="absolute top-2.5 left-2.5">

                    <span className="bg-primary/90 backdrop-blur-xs text-on-primary text-xs font-black px-2 py-0.5 rounded-md">

                      {animal.id}

                    </span>

                  </div>

                  {/* WITHDRAWAL */}

                  <div className="absolute top-2.5 right-2.5">

                    {animal.withdrawalStatus ===
                    'Active' ? (

                      <span className="bg-surface-container-high text-on-surface text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-outline-variant">

                        <Clock className="w-3 h-3 text-secondary" />

                        Active

                        {animal.withdrawalDaysLeft !==
                          undefined &&
                          ` (${animal.withdrawalDaysLeft}d)`}

                      </span>

                    ) : (

                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">

                        Clear

                      </span>

                    )}

                  </div>

                </div>

                {/* NAME / STATUS */}

                <div className="flex items-start justify-between gap-2">

                  <div>

                    <h3 className="text-base font-bold text-primary">

                      {animal.name ||
                        animal.id}

                    </h3>

                    <p className="text-xs text-outline font-mono">
                      {animal.tag}
                    </p>

                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      animal.healthStatus ===
                      'Healthy'

                        ? 'bg-emerald-100 text-emerald-800'

                        : animal.healthStatus ===
                          'High Risk'

                        ? 'bg-error-container text-error'

                        : animal.healthStatus ===
                          'Monitoring'

                        ? 'bg-surface-container-high text-on-surface'

                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >

                    {animal.healthStatus}

                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-3 text-xs text-on-surface-variant space-y-1">

                  <p>

                    <strong className="text-on-surface">
                      Breed:
                    </strong>{' '}

                    {animal.species}{' '}
                    ({animal.breed})

                  </p>

                  <p>

                    <strong className="text-on-surface">
                      Age / Wt:
                    </strong>{' '}

                    {animal.age}
                    {' • '}
                    {animal.weight} kg

                  </p>

                  <p className="truncate">

                    <strong className="text-on-surface">
                      Farm:
                    </strong>{' '}

                    {animal.farmName}

                  </p>

                  <p className="truncate">

                    <strong className="text-on-surface">
                      Last Trt:
                    </strong>{' '}

                    {animal.lastTreatmentDrug ||
                      'None'}

                  </p>

                </div>

              </div>

              {/* FOOTER */}

              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-2">

                <span className="text-[11px] font-bold text-outline">

                  Risk: {animal.riskLevel}

                </span>

                <div className="flex items-center gap-2">

                  {/* DELETE BUTTON */}

                  <button
                    type="button"
                    disabled={
                      deletingAnimalId ===
                      animal.id
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDeleteAnimal(
                        animal
                      );
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-error-container text-on-error-container border border-error/20 text-[10px] font-black flex items-center gap-1.5 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    <Trash2 className="w-3.5 h-3.5" />

                    {deletingAnimalId ===
                    animal.id
                      ? 'Deleting...'
                      : 'Delete'}

                  </button>

                  {/* VIEW RECORD */}

                  <span className="text-xs font-bold text-primary group-hover:text-secondary flex items-center gap-1">

                    <span>
                      View Record
                    </span>

                    <ArrowRight className="w-3.5 h-3.5" />

                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </div>

      {/* REGISTER ANIMAL MODAL */}

      {isRegisterModalOpen && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">

            {/* HEADER */}

            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">

              <h3 className="text-lg font-bold text-primary">

                Register Livestock Ear Tag

              </h3>

              <button
                type="button"
                onClick={() =>
                  setIsRegisterModalOpen(
                    false
                  )
                }
                className="p-1 rounded-lg text-outline hover:text-on-surface"
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleCreateAnimal
              }
              className="mt-4 space-y-3.5"
            >

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Tag ID
                  </label>

                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) =>
                      setNewTag(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                    required
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Animal Name / Alias
                  </label>

                  <input
                    type="text"
                    value={newName}
                    onChange={(e) =>
                      setNewName(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />

                </div>

              </div>

              {/* SPECIES / BREED */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Species
                  </label>

                  <select
                    value={newSpecies}
                    onChange={(e) => {
                      const species =
                        e.target
                          .value as typeof newSpecies;

                      setNewSpecies(
                        species
                      );

                      setNewBreed(
                        breedOptions[
                          species
                        ][0]
                      );
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  >

                    <option value="Cattle">Cattle</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Goat">Goat</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Pig">Pig</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Duck">Duck</option>
                    <option value="Camel">Camel</option>

                  </select>

                </div>

                <div>

                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Breed
                  </label>

                  <select
                    value={newBreed}
                    onChange={(e) =>
                      setNewBreed(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  >

                    {breedOptions[
                      newSpecies
                    ].map(
                      (breed) => (

                        <option
                          key={breed}
                          value={breed}
                        >
                          {breed}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

              {/* GENDER / AGE / WEIGHT */}

              <div className="grid grid-cols-3 gap-3">

                <div>

                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Gender
                  </label>

                  <select
                    value={newGender}
                    onChange={(e) =>
                      setNewGender(
                        e.target.value as
                          | 'Female'
                          | 'Male'
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  >

                    <option value="Female">
                      Female
                    </option>

                    <option value="Male">
                      Male
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Age
                  </label>

                  <input
                    type="text"
                    value={newAge}
                    onChange={(e) =>
                      setNewAge(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) =>
                      setNewWeight(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="pt-4 flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsRegisterModalOpen(
                      false
                    )
                  }
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