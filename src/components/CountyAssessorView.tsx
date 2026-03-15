import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Landmark, ExternalLink, Search, MapPin, FileText, DollarSign, Building2, Scale, Users } from 'lucide-react';

const assessorTools = [
  {
    title: 'Property Search',
    description: 'Search by address, parcel number, or owner name for property assessments and valuations.',
    url: 'https://mcassessor.maricopa.gov/',
    icon: Search,
    color: '#3b82f6',
  },
  {
    title: 'Parcel Viewer (Maps)',
    description: 'Interactive GIS map with parcel boundaries, aerial imagery, and property data overlays.',
    url: 'https://maps.mcassessor.maricopa.gov/',
    icon: MapPin,
    color: '#22c55e',
  },
  {
    title: 'Customer Portal',
    description: 'File forms, search properties, file an appeal, manage your account online.',
    url: 'https://mcassessor.maricopa.gov/customer-portal/',
    icon: Users,
    color: '#8b5cf6',
  },
  {
    title: 'GIS Data Portal',
    description: 'Download GIS shapefiles, parcel data, and geographic datasets for Maricopa County.',
    url: 'https://gis.maricopa.gov/',
    icon: FileText,
    color: '#f59e0b',
  },
];

const dataCategories = [
  { label: 'Full Cash Value (FCV)', desc: 'Market value assessment for tax purposes', icon: DollarSign },
  { label: 'Limited Property Value (LPV)', desc: 'Value used to calculate primary tax rate', icon: Scale },
  { label: 'Property Classification', desc: 'Residential, commercial, agricultural, vacant land', icon: Building2 },
  { label: 'Legal Description', desc: 'Lot, block, subdivision, section/township/range', icon: FileText },
  { label: 'Owner of Record', desc: 'Current property owner and mailing address', icon: Users },
  { label: 'Tax Area Code', desc: 'School district, city, special taxing districts', icon: MapPin },
];

export default function CountyAssessorView() {
  const { setCurrentView } = useApp();

  return (
    <div className="p-6 bg-[#0a1628] min-h-screen text-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <Landmark size={24} className="text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold">Maricopa County Assessor</h1>
          <p className="text-sm text-gray-400">Property valuations, ownership records & tax assessments</p>
        </div>
        <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">Official County Records</span>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-300 font-medium mb-1">About the Assessor's Office</p>
        <p className="text-xs text-gray-400">
          The Maricopa County Assessor determines property values for tax purposes, maintains ownership records,
          and provides public access to parcel information. Data includes assessed values, property classifications,
          legal descriptions, and ownership history for over 1.8 million parcels.
        </p>
      </div>

      {/* Search & Tools */}
      <h2 className="text-lg font-semibold text-white mb-4">Assessor Tools & Portals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {assessorTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.title}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0d1f3c] border border-white/10 rounded-lg p-5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${tool.color}15` }}>
                  <Icon size={20} style={{ color: tool.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-400">{tool.title}</h3>
                    <ExternalLink size={14} className="text-gray-600 group-hover:text-blue-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{tool.description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Available Data */}
      <h2 className="text-lg font-semibold text-white mb-4">Available Property Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.label} className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-blue-400" />
                <h3 className="text-sm font-medium text-white">{cat.label}</h3>
              </div>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
