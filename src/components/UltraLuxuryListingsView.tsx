import { useState, useMemo, Fragment } from 'react';
import { useApp } from '@/contexts/AppContext';
import AddressMapLink from './AddressMapLink';
import {
  ultraLuxuryListings,
  totalUltraLuxury,
  totalUltraLuxuryValue,
  avgUltraLuxuryPrice,
  ultraLuxuryAvgAcreage,
  ultraLuxuryAvgSqft,

  type ListingStatus,
} from '@/data/maricopaRealEstateData';
import { ArrowLeft, Diamond, ChevronDown, ChevronUp, Search, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const ITEMS_PER_PAGE = 10;

const statusColors: Record<ListingStatus, string> = {
  for_sale: '#22c55e',
  pending: '#f59e0b',
  withdrawn: '#6b7280',
};

const statusLabels: Record<ListingStatus, string> = {
  for_sale: 'For Sale',
  pending: 'Pending',
  withdrawn: 'Withdrawn',
};

function formatCurrency(amount: number) {
  if (amount >= 1000000) {
    const m = amount / 1000000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatFullCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function getPriceTier(price: number): string {
  if (price >= 20000000) return '$20M+';
  if (price >= 10000000) return '$10M–$20M';
  return '$6M–$10M';
}

const tierColors: Record<string, string> = {
  '$6M–$10M': '#3b82f6',
  '$10M–$20M': '#f59e0b',
  '$20M+': '#ef4444',
};

export default function UltraLuxuryListingsView() {
  const { setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortField, setSortField] = useState<'listPrice' | 'daysOnMarket' | 'sqft' | 'acreage'>('listPrice');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const cities = useMemo(() => {
    const c = [...new Set(ultraLuxuryListings.map((l) => l.city))].sort();
    return c;
  }, []);

  const filtered = useMemo(() => {
    let data = [...ultraLuxuryListings];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (l) =>
          l.address.toLowerCase().includes(q) ||
          l.sellerName.toLowerCase().includes(q) ||
          l.sellerAgent.toLowerCase().includes(q) ||
          l.sellerBrokerage.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') data = data.filter((l) => l.status === statusFilter);
    if (tierFilter !== 'all') data = data.filter((l) => getPriceTier(l.listPrice) === tierFilter);
    if (cityFilter !== 'all') data = data.filter((l) => l.city === cityFilter);

    data.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      return mul * ((a[sortField] as number) - (b[sortField] as number));
    });

    return data;
  }, [searchTerm, statusFilter, tierFilter, cityFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  // Chart data
  const tierData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((l) => {
      const tier = getPriceTier(l.listPrice);
      map[tier] = (map[tier] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const cityData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((l) => { map[l.city] = (map[l.city] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [filtered]);

  const CHART_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6', '#06b6d4'];

  const forSaleCount = ultraLuxuryListings.filter((l) => l.status === 'for_sale').length;

  return (
    <div className="p-6 bg-[#0a1628] min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <Diamond size={24} className="text-amber-400" />
        <div>
          <h1 className="text-2xl font-bold">Ultra-Luxury Listings $6M–$40M</h1>
          <p className="text-sm text-gray-400">Maricopa County's most exclusive properties</p>
        </div>
        <span className="ml-auto bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium">
          {forSaleCount} Active
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Listings', value: totalUltraLuxury.toString(), color: '#3b82f6' },
          { label: 'Total Value', value: formatCurrency(totalUltraLuxuryValue), color: '#22c55e' },
          { label: 'Avg Price', value: formatCurrency(avgUltraLuxuryPrice), color: '#f59e0b' },
          { label: 'Avg Acreage', value: `${ultraLuxuryAvgAcreage} ac`, color: '#8b5cf6' },
          { label: 'Avg Sqft', value: ultraLuxuryAvgSqft.toLocaleString(), color: '#06b6d4' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search address, seller, agent..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0a1628] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none">
            <option value="all">All Status</option>
            <option value="for_sale">For Sale</option>
            <option value="pending">Pending</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          <select value={tierFilter} onChange={(e) => { setTierFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none">
            <option value="all">All Price Tiers</option>
            <option value="$6M–$10M">$6M–$10M</option>
            <option value="$10M–$20M">$10M–$20M</option>
            <option value="$20M+">$20M+</option>
          </select>
          <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none">
            <option value="all">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={() => setShowMap((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${showMap ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-[#0a1628] border border-white/10 text-gray-400 hover:text-white'}`}
          >
            <MapPin size={14} /> Map
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span>{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Map */}
      {showMap && (
        <div className="mb-6 rounded-lg overflow-hidden border border-white/10" style={{ height: 420 }}>
          <MapContainer center={[33.58, -111.92]} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            {filtered.map((l) => (
              <CircleMarker key={l.id} center={[l.lat, l.lng]} radius={Math.min(14, 6 + l.listPrice / 5000000)} pathOptions={{ color: statusColors[l.status], fillColor: statusColors[l.status], fillOpacity: 0.7 }}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{formatFullCurrency(l.listPrice)}</p>
                    <p>{l.address}, {l.city}</p>
                    <p>{l.sqft.toLocaleString()} sqft | {l.acreage} acres</p>
                    <p>{l.beds} bed / {l.baths} bath</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium">Address</th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium">City</th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium cursor-pointer hover:text-white select-none" onClick={() => toggleSort('listPrice')}>
                  <span className="flex items-center gap-1">Price <SortIcon field="listPrice" /></span>
                </th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium cursor-pointer hover:text-white select-none" onClick={() => toggleSort('sqft')}>
                  <span className="flex items-center gap-1">Sqft <SortIcon field="sqft" /></span>
                </th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium cursor-pointer hover:text-white select-none" onClick={() => toggleSort('acreage')}>
                  <span className="flex items-center gap-1">Acreage <SortIcon field="acreage" /></span>
                </th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium">Seller</th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium">Agent</th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium cursor-pointer hover:text-white select-none" onClick={() => toggleSort('daysOnMarket')}>
                  <span className="flex items-center gap-1">DOM <SortIcon field="daysOnMarket" /></span>
                </th>
                <th className="px-4 py-3 text-xs text-gray-500 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((l) => (
                <Fragment key={l.id}>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setExpandedRow(expandedRow === l.id ? null : l.id)}>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${statusColors[l.status]}20`, color: statusColors[l.status] }}>
                        {statusLabels[l.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AddressMapLink address={`${l.address}, ${l.city}, AZ ${l.zip}`} lat={l.lat} lng={l.lng} />
                    </td>
                    <td className="px-4 py-3 text-gray-400">{l.city}</td>
                    <td className="px-4 py-3 font-semibold text-amber-400">{formatCurrency(l.listPrice)}</td>
                    <td className="px-4 py-3 text-gray-300">{l.sqft.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300">{l.acreage} ac</td>
                    <td className="px-4 py-3 text-gray-300 max-w-[150px] truncate">{l.sellerName}</td>
                    <td className="px-4 py-3 text-gray-300">{l.sellerAgent}</td>
                    <td className="px-4 py-3 text-gray-400">{l.daysOnMarket}d</td>
                    <td className="px-4 py-3 text-gray-600">
                      {expandedRow === l.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>
                  {expandedRow === l.id && (
                    <tr className="bg-[#0a1628]">
                      <td colSpan={10} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Full Price</p>
                            <p className="text-sm font-semibold text-amber-400">{formatFullCurrency(l.listPrice)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Beds / Baths</p>
                            <p className="text-sm text-white">{l.beds} bed / {l.baths} bath</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Year Built</p>
                            <p className="text-sm text-white">{l.yearBuilt}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Property Type</p>
                            <p className="text-sm text-white">{l.propertyType}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Sqft</p>
                            <p className="text-sm text-white">{l.sqft.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Acreage</p>
                            <p className="text-sm text-white">{l.acreage} acres</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Price / Sqft</p>
                            <p className="text-sm text-white">{formatFullCurrency(Math.round(l.listPrice / l.sqft))}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Days on Market</p>
                            <p className="text-sm text-white">{l.daysOnMarket} days</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Seller</p>
                            <p className="text-sm text-white">{l.sellerName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Listing Agent / Brokerage</p>
                            <p className="text-sm text-white">{l.sellerAgent} — {l.sellerBrokerage}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-[10px] text-gray-500 uppercase mb-1">Description</p>
                          <p className="text-xs text-gray-300">{l.description}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase mb-1">Features</p>
                          <div className="flex flex-wrap gap-1.5">
                            {l.features.map((f) => (
                              <span key={f} className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-medium">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3">
                          <AddressMapLink address={`${l.address}, ${l.city}, AZ ${l.zip}`} lat={l.lat} lng={l.lng} />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Page {currentPage} of {totalPages} ({filtered.length} listings)
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2.5 py-1 rounded text-xs ${currentPage === i + 1 ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Listings by City</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Price Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={tierData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {tierData.map((entry, i) => (
                  <Cell key={entry.name} fill={tierColors[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

