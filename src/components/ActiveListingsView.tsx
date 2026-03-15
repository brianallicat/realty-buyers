import { useState, useMemo, Fragment } from 'react';
import { useApp } from '@/contexts/AppContext';
import { type ActiveListing, type ListingStatus, type HomeType } from '@/data/maricopaRealEstateData';
import { ArrowLeft, ChevronDown, ChevronUp, Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AddressMapLink from './AddressMapLink';

const ITEMS_PER_PAGE = 15;

const statusColors: Record<ListingStatus, string> = {
  for_sale: '#22c55e',
  pending: '#f59e0b',
  withdrawn: '#ef4444',
};

const statusLabels: Record<ListingStatus, string> = {
  for_sale: 'For Sale',
  pending: 'Pending',
  withdrawn: 'Withdrawn',
};

const homeTypeLabels: Record<HomeType, string> = {
  single_family: 'Single Family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  multi_family: 'Multi-Family',
  mobile: 'Mobile/Manufactured',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface Props {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeColor: string;
  accentColor: string;
  icon: React.ElementType;
  listings: ActiveListing[];
}

export default function ActiveListingsView({ title, subtitle, badgeLabel, badgeColor, accentColor, icon: Icon, listings }: Props) {
  const { setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [zipFilter, setZipFilter] = useState('all');
  const [sortField, setSortField] = useState<'listDate' | 'listPrice' | 'sqft' | 'daysOnMarket'>('listDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const uniqueZips = useMemo(() => [...new Set(listings.map((l) => l.zip))].sort(), [listings]);

  const filtered = useMemo(() => {
    let results = listings.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (propertyFilter !== 'all' && l.propertyType !== propertyFilter) return false;
      if (zipFilter !== 'all' && l.zip !== zipFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          l.address.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.zip.includes(q) ||
          l.sellerName.toLowerCase().includes(q) ||
          l.sellerAgent.toLowerCase().includes(q) ||
          l.sellerBrokerage.toLowerCase().includes(q)
        );
      }
      return true;
    });

    results.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'listDate') cmp = a.listDate.localeCompare(b.listDate);
      else if (sortField === 'listPrice') cmp = a.listPrice - b.listPrice;
      else if (sortField === 'sqft') cmp = a.sqft - b.sqft;
      else if (sortField === 'daysOnMarket') cmp = a.daysOnMarket - b.daysOnMarket;
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return results;
  }, [listings, searchTerm, statusFilter, propertyFilter, zipFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const forSaleCount = filtered.filter((l) => l.status === 'for_sale').length;
  const pendingCount = filtered.filter((l) => l.status === 'pending').length;
  const withdrawnCount = filtered.filter((l) => l.status === 'withdrawn').length;
  const avgPrice = filtered.length > 0 ? Math.round(filtered.reduce((s, l) => s + l.listPrice, 0) / filtered.length) : 0;

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    sortField === field ? (sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />) : null
  );

  const mapCenter = useMemo(() => {
    if (filtered.length === 0) return [33.45, -111.94] as [number, number];
    const avgLat = filtered.reduce((s, l) => s + l.lat, 0) / filtered.length;
    const avgLng = filtered.reduce((s, l) => s + l.lng, 0) / filtered.length;
    return [avgLat, avgLng] as [number, number];
  }, [filtered]);

  return (
    <div className="p-6 bg-[#0a1628] min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <Icon size={24} style={{ color: accentColor }} />
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <span className="ml-auto text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${badgeColor}33`, color: badgeColor }}>{badgeLabel}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">For Sale</p>
          <p className="text-2xl font-bold text-green-400">{forSaleCount}</p>
          <p className="text-xs text-gray-500">Active listings</p>
        </div>
        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          <p className="text-xs text-gray-500">Under contract</p>
        </div>
        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Withdrawn</p>
          <p className="text-2xl font-bold text-red-400">{withdrawnCount}</p>
          <p className="text-xs text-gray-500">Off market</p>
        </div>
        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Avg List Price</p>
          <p className="text-2xl font-bold" style={{ color: accentColor }}>{formatCurrency(avgPrice)}</p>
          <p className="text-xs text-gray-500">{filtered.length} total listings</p>
        </div>
      </div>

      {/* Map Toggle + Search */}
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search address, seller, agent, brokerage..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0a1628] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-colors ${showMap ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-white/10 text-gray-400 hover:text-white'}`}
          >
            <MapPin size={14} /> Map
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-colors ${showFilters ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-white/10 text-gray-400 hover:text-white'}`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <select
            value={`${sortField}-${sortDir}`}
            onChange={(e) => {
              const [f, d] = e.target.value.split('-') as [typeof sortField, 'asc' | 'desc'];
              setSortField(f); setSortDir(d); setCurrentPage(1);
            }}
            className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="listDate-desc">Newest First</option>
            <option value="listDate-asc">Oldest First</option>
            <option value="listPrice-desc">Highest Price</option>
            <option value="listPrice-asc">Lowest Price</option>
            <option value="sqft-desc">Largest Sqft</option>
            <option value="daysOnMarket-desc">Most Days on Market</option>
            <option value="daysOnMarket-asc">Fewest Days on Market</option>
          </select>
        </div>

        {showFilters && (
          <div className="flex gap-3 flex-wrap pt-2 border-t border-white/5">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none">
              <option value="all">All Statuses</option>
              <option value="for_sale">For Sale</option>
              <option value="pending">Pending</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
            <select value={propertyFilter} onChange={(e) => { setPropertyFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none">
              <option value="all">All Property Types</option>
              <option value="single_family">Single Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
            <select value={zipFilter} onChange={(e) => { setZipFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none">
              <option value="all">All Zip Codes</option>
              {uniqueZips.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Map */}
      {showMap && (
        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg overflow-hidden mb-6" style={{ height: 400 }}>
          <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {filtered.map((l) => (
              <CircleMarker
                key={l.id}
                center={[l.lat, l.lng]}
                radius={8}
                fillColor={statusColors[l.status]}
                fillOpacity={0.8}
                stroke={true}
                color="#fff"
                weight={1}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{l.address}</p>
                    <p>{l.city}, AZ {l.zip}</p>
                    <p className="font-bold text-green-600">{formatCurrency(l.listPrice)}</p>
                    <p>{statusLabels[l.status]} &middot; {l.beds}bd/{l.baths}ba &middot; {l.sqft.toLocaleString()} sqft</p>
                    <p className="mt-1">Seller: {l.sellerName}</p>
                    <p>Agent: {l.sellerAgent} ({l.sellerBrokerage})</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          <div className="flex items-center gap-4 px-4 py-2 border-t border-white/10 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> For Sale</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span> Pending</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Withdrawn</span>
            <span className="ml-auto">{filtered.length} listings</span>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Address</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Zip</th>
                <th className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('listPrice')}>
                  <span className="flex items-center gap-1">Price <SortIcon field="listPrice" /></span>
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium">Seller</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Seller Agent</th>
                <th className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('sqft')}>
                  <span className="flex items-center gap-1">Sqft <SortIcon field="sqft" /></span>
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('daysOnMarket')}>
                  <span className="flex items-center gap-1">DOM <SortIcon field="daysOnMarket" /></span>
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium">Type</th>
                <th className="px-4 py-3 text-gray-400 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-500">No listings found matching your criteria.</td></tr>
              ) : (
                paged.map((listing) => (
                  <Fragment key={listing.id}>
                    <tr
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(expandedRow === listing.id ? null : listing.id)}
                    >
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${statusColors[listing.status]}20`, color: statusColors[listing.status] }}>
                          {statusLabels[listing.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><AddressMapLink address={listing.address} city={listing.city} zip={listing.zip} lat={listing.lat} lng={listing.lng} /></td>
                      <td className="px-4 py-3 text-gray-300">{listing.zip}</td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: accentColor }}>{formatCurrency(listing.listPrice)}</td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{listing.sellerName}</td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{listing.sellerAgent}</td>
                      <td className="px-4 py-3 text-gray-300">{listing.sqft.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-300">{listing.daysOnMarket}d</td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{homeTypeLabels[listing.propertyType]}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {expandedRow === listing.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </td>
                    </tr>
                    {expandedRow === listing.id && (
                      <tr className="bg-[#0a1628]">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Full Address</p>
                              <AddressMapLink address={`${listing.address}, ${listing.city}, AZ ${listing.zip}`} lat={listing.lat} lng={listing.lng} />
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Property Details</p>
                              <p className="text-white">{listing.beds} bed / {listing.baths} bath &middot; {listing.sqft.toLocaleString()} sqft &middot; Built {listing.yearBuilt}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{homeTypeLabels[listing.propertyType]}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Seller</p>
                              <p className="text-white">{listing.sellerName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Seller's Agent</p>
                              <p className="text-white">{listing.sellerAgent}</p>
                              <p className="text-orange-400 text-xs">{listing.sellerBrokerage}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Listed</p>
                              <p className="text-white">{formatDate(listing.listDate)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs mb-1">Days on Market</p>
                              <p className="text-white">{listing.daysOnMarket} days</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded text-sm border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === 'string' ? (
                    <span key={`e-${i}`} className="px-2 py-1 text-gray-600 text-sm">...</span>
                  ) : (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded text-sm border ${currentPage === p ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'border-white/10 text-gray-400 hover:text-white'}`}>{p}</button>
                  )
                )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded text-sm border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
