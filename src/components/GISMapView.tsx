import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Globe, ExternalLink, Map, Layers, Mountain, Droplets, GraduationCap, Building2 } from 'lucide-react';

const gisTools = [
  {
    title: 'Assessor Parcel Viewer',
    description: 'Interactive map with parcel boundaries, ownership data, assessed values, and aerial imagery. Click any parcel for full property details.',
    url: 'https://maps.mcassessor.maricopa.gov/',
    icon: Map,
    color: '#22c55e',
    badge: 'Primary Tool',
  },
  {
    title: 'Maricopa County GIS Portal',
    description: 'Central hub for all county GIS data, downloadable shapefiles, web services, and interactive mapping applications.',
    url: 'https://gis.maricopa.gov/',
    icon: Layers,
    color: '#3b82f6',
    badge: 'Data Portal',
  },
  {
    title: 'MAG Regional GIS',
    description: 'Maricopa Association of Governments regional mapping with transportation, demographics, and land use data.',
    url: 'https://geo.azmag.gov/',
    icon: Building2,
    color: '#f59e0b',
    badge: 'Regional',
  },
  {
    title: 'FEMA Flood Map Service',
    description: 'Federal flood hazard maps for Maricopa County. Check flood zones, FIRM panels, and LOMA/LOMR data for any property.',
    url: 'https://msc.fema.gov/portal/home',
    icon: Droplets,
    color: '#06b6d4',
    badge: 'Federal',
  },
];

const mapLayers = [
  { name: 'Parcel Boundaries', desc: 'All 1.8M+ parcels with APN, owner, and value data', color: '#22c55e' },
  { name: 'Aerial Imagery', desc: 'High-resolution aerial photos updated annually', color: '#3b82f6' },
  { name: 'Zoning Districts', desc: 'City and county zoning designations', color: '#8b5cf6' },
  { name: 'Flood Zones', desc: 'FEMA 100-year and 500-year flood plains', color: '#06b6d4' },
  { name: 'School Districts', desc: 'Elementary, high school, and unified district boundaries', color: '#f59e0b' },
  { name: 'Municipal Boundaries', desc: 'City limits, unincorporated areas, town boundaries', color: '#ef4444' },
  { name: 'Topography', desc: 'Elevation contours and terrain data', color: '#a855f7' },
  { name: 'Transportation', desc: 'Roads, highways, transit routes, bike paths', color: '#6b7280' },
];

export default function GISMapView() {
  const { setCurrentView } = useApp();

  return (
    <div className="p-6 bg-[#0a1628] min-h-screen text-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <Globe size={24} className="text-green-400" />
        <div>
          <h1 className="text-2xl font-bold">GIS Mapping Applications</h1>
          <p className="text-sm text-gray-400">Interactive maps, parcel viewers & geographic data</p>
        </div>
        <span className="ml-auto bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-medium">Maricopa County</span>
      </div>

      {/* Quick Launch */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Quick Launch: Parcel Viewer</h2>
        <p className="text-sm text-gray-400 mb-4">Open the Maricopa County Assessor's interactive parcel map to view property boundaries, ownership data, aerial imagery, and assessed values.</p>
        <a
          href="https://maps.mcassessor.maricopa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Map size={16} /> Open Parcel Viewer <ExternalLink size={14} />
        </a>
      </div>

      {/* GIS Tools */}
      <h2 className="text-lg font-semibold text-white mb-4">GIS Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {gisTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.title}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0d1f3c] border border-white/10 rounded-lg p-5 hover:border-green-500/30 hover:bg-green-500/5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${tool.color}15` }}>
                  <Icon size={20} style={{ color: tool.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white group-hover:text-green-400">{tool.title}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${tool.color}20`, color: tool.color }}>{tool.badge}</span>
                    <ExternalLink size={14} className="text-gray-600 group-hover:text-green-400 ml-auto" />
                  </div>
                  <p className="text-xs text-gray-400">{tool.description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Available Map Layers */}
      <h2 className="text-lg font-semibold text-white mb-4">Available Map Layers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mapLayers.map((layer) => (
          <div key={layer.name} className="bg-[#0d1f3c] border border-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }}></span>
              <h3 className="text-xs font-medium text-white">{layer.name}</h3>
            </div>
            <p className="text-[10px] text-gray-500">{layer.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
