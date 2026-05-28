import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Job } from '../../types';

interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedExperience: string;
  setSelectedExperience: (experience: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  totalJobs: number;
  filteredCount: number;
  jobs: Job[];                    // ← live data for dynamic options
}

// ─── Reusable select wrapper ──────────────────────────────────────────────────
function FilterSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <div>
      <label
        className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold
                   uppercase tracking-wider mb-2"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        <Icon
          className="w-3 h-3 sm:w-3.5 sm:h-3.5"
          style={{ color: '#d4a017' }}
        />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                   text-xs sm:text-sm text-white outline-none cursor-pointer
                   transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,160,23,0.4)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        }}
      >
        {options.map((opt) => (
          <option
            key={opt.id}
            value={opt.id}
            style={{ background: '#0a1628' }}
          >
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function JobFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedExperience,
  setSelectedExperience,
  selectedLocation,
  setSelectedLocation,
  selectedCompany,
  setSelectedCompany,
  totalJobs,
  filteredCount,
  jobs,
}: JobFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  // ── Derive unique filter options from live jobs data ──
  const departments = useMemo(() => {
    const map = new Map<string, string>();
    jobs.forEach((j) => {
      if (j.department?.id && j.department?.name) {
        map.set(j.department.id, j.department.name);
      }
    });
    return [
      { id: 'all', name: 'All Departments' },
      ...Array.from(map.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [jobs]);

  const types = useMemo(() => {
    const map = new Map<string, string>();
    jobs.forEach((j) => {
      if (j.type?.id && j.type?.name) {
        map.set(j.type.id, j.type.name);
      }
    });
    return [
      { id: 'all', name: 'All Types' },
      ...Array.from(map.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [jobs]);

  const experiences = useMemo(() => {
    const map = new Map<string, string>();
    jobs.forEach((j) => {
      if (j.experience?.id && j.experience?.name) {
        map.set(j.experience.id, j.experience.name);
      }
    });
    return [
      { id: 'all', name: 'All Experience Levels' },
      ...Array.from(map.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [jobs]);

  const locations = useMemo(() => {
    const map = new Map<string, string>();
    jobs.forEach((j) => {
      if (j.location?.id && j.location?.name) {
        map.set(j.location.id, j.location.name);
      }
    });
    return [
      { id: 'all', name: 'All Locations' },
      ...Array.from(map.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [jobs]);

  const companies = useMemo(() => {
    const map = new Map<string, string>();
    jobs.forEach((j) => {
      if (j.company?.id && j.company?.name) {
        map.set(j.company.id, j.company.name);
      }
    });
    return [
      { id: 'all', name: 'All Companies' },
      ...Array.from(map.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [jobs]);

  // ── Filter state helpers ──
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedExperience('all');
    setSelectedLocation('all');
    setSelectedCompany('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    selectedExperience !== 'all' ||
    selectedLocation !== 'all' ||
    selectedCompany !== 'all';

  const activeFilterCount = [
    searchQuery !== '',
    selectedCategory !== 'all',
    selectedType !== 'all',
    selectedExperience !== 'all',
    selectedLocation !== 'all',
    selectedCompany !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="mb-8 xl:mb-10">

      {/* ── Search + Filter toggle row ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">

        {/* Search input */}
        <div className="relative flex-1">
          <Icons.Search
            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: 'rgba(212,160,23,0.5)' }}
          />
          <input
            type="text"
            placeholder="Search jobs by title, skills, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl
                       text-sm sm:text-base text-white placeholder:text-white/30
                       outline-none transition-all duration-300"
            style={{
              background: 'rgba(10,36,71,0.4)',
              border: '1px solid rgba(212,160,23,0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.4)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.1)';
            }}
          />
          {/* Clear search */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2
                         w-5 h-5 rounded-full flex items-center justify-center
                         transition-all duration-200 hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <Icons.X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2
                     px-5 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold
                     text-sm sm:text-base transition-all duration-300 flex-shrink-0"
          style={{
            background: showFilters
              ? 'rgba(212,160,23,0.15)'
              : 'rgba(212,160,23,0.08)',
            border: `1px solid ${
              showFilters
                ? 'rgba(212,160,23,0.4)'
                : 'rgba(212,160,23,0.15)'
            }`,
            color: '#d4a017',
          }}
        >
          <Icons.Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center
                         text-[10px] font-bold flex-shrink-0"
              style={{ background: '#d4a017', color: '#050d1a' }}
            >
              {activeFilterCount}
            </span>
          )}
          <Icons.ChevronDown
            className={`w-4 h-4 transition-transform duration-300
                        ${showFilters ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* ── Expandable filter panel ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="p-4 sm:p-6 xl:p-8 rounded-2xl mb-5 sm:mb-6"
              style={{
                background: 'rgba(10,36,71,0.4)',
                border: '1px solid rgba(212,160,23,0.1)',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 xl:gap-5">
                <FilterSelect
                  icon={Icons.Briefcase}
                  label="Department"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={departments}
                />
                <FilterSelect
                  icon={Icons.Briefcase}
                  label="Job Type"
                  value={selectedType}
                  onChange={setSelectedType}
                  options={types}
                />
                <FilterSelect
                  icon={Icons.GraduationCap}
                  label="Experience"
                  value={selectedExperience}
                  onChange={setSelectedExperience}
                  options={experiences}
                />
                <FilterSelect
                  icon={Icons.MapPin}
                  label="Location"
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  options={locations}
                />
                <FilterSelect
                  icon={Icons.Building2}
                  label="Company"
                  value={selectedCompany}
                  onChange={setSelectedCompany}
                  options={companies}
                />
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}
                >
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium
                               transition-colors duration-300 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    <Icons.X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results count row ── */}
      <div className="flex items-center justify-between gap-4">
        <p
          className="text-xs sm:text-sm xl:text-base"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Showing{' '}
          <span className="font-semibold text-white">{filteredCount}</span> of{' '}
          <span className="font-semibold text-white">{totalJobs}</span> jobs
        </p>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs sm:text-sm font-medium
                       transition-colors duration-300 hover:text-yellow-300 flex-shrink-0"
            style={{ color: '#d4a017' }}
          >
            <Icons.X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}