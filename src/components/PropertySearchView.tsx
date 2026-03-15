import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, SearchCheck, ExternalLink, Search, MapPin, Building2, DollarSign, User, Hash } from 'lucide-react';

const searchSources = [
  {
    name: 'Assessor — Parcel/Address Search',
    url: 'https://mcassessor.maricopa.gov/',
    description: 'Search by address or parcel number for property values, ownership, tax info, and legal descriptions.',
    fields: ['Full Cash Value', 'Limited Property Value', 'Owner Name', 'Legal Description', 'Property Class', 'Tax Area'],
    color: '#3b82f6',
  },
  {
    name: 'Recorder — Document Search',
    url: 'https://recorder.maricopa.gov/recdocdata/',
    description: 'Search recorded documents from 1871 to present: deeds, mortgages, liens, trusts, and more.',
    fields: ['Recording Number', 'Document Type', 'Recording Date', 'Grantor/Grantee', 'Book/Page'],
    color: '#8b5cf6',
  },
  {
    name: 'Treasurer — Tax Search',
    url: 'https://treasurer.maricopa.gov/Parcel/TaxInfo',
    description: 'Look up property tax amounts, payment history, and delinquent tax status by parcel number.',
    fields: ['Tax Amount', 'Payment Status', 'Delinquent Balance', 'Tax Year', 'Tax Area Code'],
    color: '#f59e0b',
  },
  {
    name: 'GIS Parcel Viewer',
    url: 'https://maps.mcassessor.maricopa.gov/',
    description: 'Interactive map with parcel boundaries, aerial imagery, zoning, flood zones, and property data overlays.',
    fields: ['Parcel Boundaries', 'Aerial Photos', 'Zoning', 'Flood Zones', 'School Districts'],
    color: '#22c55e',
  },
];

const quickLinks = [
  { label: 'Owner Name Search', url: 'https://mcassessor.maricopa.gov/', icon: User },
  { label: 'Parcel Number Lookup', url: 'https://mcassessor.maricopa.gov/', icon: Hash },
  { label: 'Address Search', url: 'https://mcassessor.maricopa.gov/', icon: MapPin },
  { label: 'Recorded Documents', url: 'https://recorder.maricopa.gov/recdocdata/', icon: Building2 },
  { label: 'Tax Bill Lookup', url: 'https://treasurer.maricopa.gov/Parcel/TaxInfo', icon: DollarSign },
  { label: 'GIS Parcel Map', url: 'https://maps.mcassessor.maricopa.gov/', icon: MapPin },
];

export default function PropertySearchView() {
  const { setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const isParcelNumber = /^\d{3}-\d{2}-\d{3}/.test(searchTerm.trim());
  const isAddress = searchTerm.trim().length > 5 && /\d/.test(searchTerm) && /[a-zA-Z]/.test(searchTerm);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const q = encodeURIComponent(searchTerm.trim());
    window.open(`https://mcassessor.maricopa.gov/mcs.php?q=${q}`, '_blank');
  };

  return (
    <div className="p-6 bg-[#0a1628] min-h-screen text-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <SearchCheck size={24} className="text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold">Maricopa County Property Search</h1>
          <p className="text-sm text-gray-400">Search across Assessor, Recorder & Treasurer databases</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Search County Assessor</h2>
        <p className="text-sm text-gray-400 mb-4">Enter an address, parcel number (e.g., 123-45-678), or owner name to search property records.</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="123 Main St, Phoenix or 123-45-678 or Smith, John..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#0a1628] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            <ExternalLink size={14} /> Search Assessor
          </button>
        </div>
        {searchTerm.trim() && (
          <div className="flex gap-2 mt-3 text-xs">
            {isParcelNumber && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Detected: Parcel Number</span>}
            {isAddress && !isParcelNumber && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Detected: Address</span>}
            {!isAddress && !isParcelNumber && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Detected: Owner Name</span>}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-cyan-400 group-hover:text-cyan-300" />
                <span className="text-sm text-gray-300 group-hover:text-white">{link.label}</span>
                <ExternalLink size={12} className="text-gray-600 ml-auto group-hover:text-cyan-400" />
              </div>
            </a>
          );
        })}
      </div>

      {/* Data Sources */}
      <h2 className="text-lg font-semibold text-white mb-4">County Data Sources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchSources.map((source) => (
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0d1f3c] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{source.name}</h3>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-cyan-400 shrink-0 mt-0.5" />
            </div>
            <p className="text-xs text-gray-400 mb-3">{source.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {source.fields.map((field) => (
                <span key={field} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${source.color}15`, color: source.color }}>
                  {field}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
