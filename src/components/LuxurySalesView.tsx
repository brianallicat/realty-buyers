import { useState, useMemo, Fragment } from 'react';
import { useApp } from '@/contexts/AppContext';
import AddressMapLink from './AddressMapLink';
import {
  luxurySales,
  totalLuxurySales,
  totalLuxuryVolume,
  avgLuxuryPrice,
  luxuryCashCount,
  type RecentSale,
  type FinancingType,
  type HomeType,
} from '@/data/maricopaRealEstateData';
import { ArrowLeft, Crown, ChevronDown, ChevronUp, Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const ITEMS_PER_PAGE = 15;

const financingColors: Record<FinancingType, string> = {
  cash: '#22c55e',
  conventional: '#3b82f6',
  fha: '#f59e0b',
  va: '#8b5cf6',
  other: '#6b7280',
};

const financingLabels: Record<FinancingType, string> = {
  cash: 'Cash',
  conventional: 'Conventional',
  fha: 'FHA',
  va: 'VA',
  other: 'Other',
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

// Price tier for luxury
function getPriceTier(price: number): string {
  if (price >= 5000000) return '$5M+';
  if (price >= 3000000) return '$3M–$5M';
  if (price >= 2000000) return '$2M–$3M';
  return '$1M–$2M';
}

const tierColors: Record<string, string> = {
  '$1M–$2M': '#3b82f6',
  '$2M–$3M': '#f59e0b',
  '$3M–$5M': '#f97316',
  '$5M+': '#ef4444',
};

export default function LuxurySalesView() {
  const { setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('365');
  const [financingFilter, setFinancingFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [zipFilter, setZipFilter] = useState('all');
  const [sortField, setSortField] = useState<'saleDate' | 'salePrice' | 'sqft' | 'zip'>('saleDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const uniqueZips = useMemo(() => [...new Set(luxurySales.map((s) => s.zip))].sort(), []);

  const filtered = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - parseInt(dateRange));

    let results = luxurySales.filter((s) => {
      const saleDate = new Date(s.saleDate);
      if (saleDate < cutoff) return false;
      if (financingFilter !== 'all' && s.financingType !== financingFilter) return false;
      if (tierFilter !== 'all' && getPriceTier(s.salePrice) !== tierFilter) return false;
      if (zipFilter !== 'all' && s.zip !== zipFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          s.address.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.zip.includes(q) ||
          s.buyerName.toLowerCase().includes(q) ||
          s.sellerName.toLowerCase().includes(q) ||
          s.buyerAgent.toLowerCase().includes(q) ||
          s.sellerAgent.toLowerCase().includes(q) ||
          s.buyerBrokerage.toLowerCase().includes(q) ||
          s.sellerBrokerage.toLowerCase().includes(q)
        );
      }
      return true;
    });

    results.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'saleDate') cmp = a.saleDate.localeCompare(b.saleDate);
      else if (sortField === 'salePrice') cmp = a.salePrice - b.salePrice;
      else if (sortField === 'sqft') cmp = a.sqft - b.sqft;
      else if (sortField === 'zip') cmp = a.zip.localeCompare(b.zip);
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return results;
  }, [searchTerm, dateRange, financingFilter, tierFilter, zipFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const filteredVolume = filtered.reduce((sum, s) => sum + s.salePrice, 0);
  const filteredAvg = filtered.length > 0 ? Math.round(filteredVolume / filtered.length) : 0;
  const filteredCash = filtered.filter((s) => s.financingType === 'cash').length;
  const cashPct = filtered.length > 0 ? Math.round((filteredCash / filtered.length) * 100) : 0;
  const highestSale = filtered.length > 0 ? Math.max(...filtered.map((s) => s.salePrice)) : 0;

  // Chart data
  const salesByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    filtered.forEach((s) => {
      const d = new Date(s.saleDate);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count })).reverse();
  }, [filtered]);

  const priceTierDist = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((s) => {
      const tier = getPriceTier(s.salePrice);
      counts[tier] = (counts[tier] || 0) + 1;
    });
    return ['$1M–$2M', '$2M–$3M', '$3M–$5M', '$5M+']
      .filter((t) => counts[t])
      .map((name) => ({ name, value: counts[name] }));
  }, [filtered]);

  const PIE_COLORS = ['#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    sortField === field ? (sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />) : null
  );

  return (
    <div className="p-6 bg-[#0a1628] min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <Crown size={24} className="text-yellow-400" />
        <div>
          <h1 className="text-2xl font-bold">Luxury Sales <span className="text-yellow-400">$1M+</span></h1>
          <p className="text-sm text-gray-400">High-value property transactions — Maricopa County</p>
        </div>
        <span className="ml-auto bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full font-medium">Premium Market</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0d1f3c] border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Luxury Sales</p>
          <p className="text-2xl font-bold text-white">{filtered.length}</p>
          <p className="text-xs text-gray-500">{totalLuxurySales} all time</p>
        </div>
        <div className="bg-[#0d1f3c] border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(filteredVolume)}</p>
          <p className="text-xs text-gray-500">{formatCurrency(totalLuxuryVolume)} all time</p>
        </div>
        <div className="bg-[#0d1f3c] border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Avg Sale Price</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(filteredAvg)}</p>
          <p className="text-xs text-gray-500">Highest: {formatCurrency(highestSale)}</p>
        </div>
        <div className="bg-[#0d1f3c] border border-yellow-500/20 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Cash Purchases</p>
          <p className="text-2xl font-bold text-green-400">{cashPct}%</p>
          <p className="text-xs text-gray-500">{filteredCash} of {filtered.length} sales</p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search address, buyer, seller, agent, brokerage..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0a1628] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-colors ${showMap ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' : 'border-white/10 text-gray-400 hover:text-white'}`}
          >
            <MapPin size={14} /> Map
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-colors ${showFilters ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' : 'border-white/10 text-gray-400 hover:text-white'}`}
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
            <option value="saleDate-desc">Newest First</option>
            <option value="saleDate-asc">Oldest First</option>
            <option value="salePrice-desc">Highest Price</option>
            <option value="salePrice-asc">Lowest Price</option>
            <option value="sqft-desc">Largest Sqft</option>
            <option value="sqft-asc">Smallest Sqft</option>
          </select>
        </div>

        {showFilters && (
          <div className="flex gap-3 flex-wrap pt-2 border-t border-white/5">
            <select value={dateRange} onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none">
              <option value="90">Last 90 Days</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last 12 Months</option>
              <option value="9999">All Time</option>
            </select>
            <select value={financingFilter} onChange={(e) => { setFinancingFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none">
              <option value="all">All Financing</option>
              <option value="cash">Cash</option>
              <option value="conventional">Conventional</option>
              <option value="va">VA</option>
            </select>
            <select value={tierFilter} onChange={(e) => { setTierFilter(e.target.value); setCurrentPage(1); }} className="bg-[#0a1628] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none">
              <option value="all">All Price Tiers</option>
              <option value="$1M–$2M">$1M – $2M</option>
              <option value="$2M–$3M">$2M – $3M</option>
              <option value="$3M–$5M">$3M – $5M</option>
              <option value="$5M+">$5M+</option>
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
          <MapContainer center={[33.53, -111.94]} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {filtered.map((sale) => {
              const tier = getPriceTier(sale.salePrice);
              return (
                <CircleMarker key={sale.id} center={[sale.lat, sale.lng]} radius={9} fillColor={tierColors[tier]} fillOpacity={0.8} stroke={true} color="#fff" weight={1}>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-bold">{sale.address}</p>
                      <p>{sale.city}, AZ {sale.zip}</p>
                      <p className="font-bold text-green-600">{formatCurrency(sale.salePrice)} ({tier})</p>
                      <p>{formatDate(sale.saleDate)} &middot; {financingLabels[sale.financingType]}</p>
                      <p>{sale.beds}bd/{sale.baths}ba &middot; {sale.sqft.toLocaleString()} sqft</p>
                      <p className="mt-1">Buyer: {sale.buyerName}</p>
                      <p>Seller: {sale.sellerName}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
          <div className="flex items-center gap-4 px-4 py-2 border-t border-white/10 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: tierColors['$1M–$2M'] }}></span> $1M–$2M</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: tierColors['$2M–$3M'] }}></span> $2M–$3M</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: tierColors['$3M–$5M'] }}></span> $3M–$5M</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: tierColors['$5M+'] }}></span> $5M+</span>
            <span className="ml-auto">{filtered.length} luxury sales</span>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('saleDate')}>
                  <span className="flex items-center gap-1">Date <SortIcon field="saleDate" /></span>
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium">Address</th>
                <th className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('zip')}>
                  <span className="flex items-center gap-1">Zip <SortIcon field="zip" /></span>
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('salePrice')}>
                  <span className="flex items-center gap-1">Price <SortIcon field="salePrice" /></span>
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium">Buyer</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Seller</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Financing</th>
                <th className="px-4 py-3 text-gray-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort('sqft')}>
                  <span className="flex items-center gap-1">Sqft <SortIcon field="sqft" /></span>
                </th>
                <th className="px-4 py-3 text-gray-400 font-medium">Tier</th>
                <th className="px-4 py-3 text-gray-400 font-medium w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-500">No luxury sales found matching your criteria.</td></tr>
              ) : (
                paged.map((sale) => {
                  const tier = getPriceTier(sale.salePrice);
                  return (
                    <Fragment key={sale.id}>
                      <tr
                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => setExpandedRow(expandedRow === sale.id ? null : sale.id)}
                      >
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{formatDate(sale.saleDate)}</td>
                        <td className="px-4 py-3 whitespace-nowrap"><AddressMapLink address={sale.address} city={sale.city} zip={sale.zip} lat={sale.lat} lng={sale.lng} /></td>
                        <td className="px-4 py-3 text-gray-300">{sale.zip}</td>
                        <td className="px-4 py-3 text-yellow-400 font-bold whitespace-nowrap">{formatCurrency(sale.salePrice)}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{sale.buyerName}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{sale.sellerName}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${financingColors[sale.financingType]}20`, color: financingColors[sale.financingType] }}>
                            {financingLabels[sale.financingType]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{sale.sqft.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${tierColors[tier]}20`, color: tierColors[tier] }}>
                            {tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {expandedRow === sale.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </td>
                      </tr>
                      {expandedRow === sale.id && (
                        <tr className="bg-[#0a1628]">
                          <td colSpan={10} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 text-xs mb-1">Full Address</p>
                                <AddressMapLink address={`${sale.address}, ${sale.city}, AZ ${sale.zip}`} lat={sale.lat} lng={sale.lng} />
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs mb-1">Property Details</p>
                                <p className="text-white">{sale.beds} bed / {sale.baths} bath &middot; {sale.sqft.toLocaleString()} sqft &middot; Built {sale.yearBuilt}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{homeTypeLabels[sale.propertyType]}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs mb-1">Buyer Agent</p>
                                <p className="text-white">{sale.buyerAgent}</p>
                                <p className="text-blue-400 text-xs">{sale.buyerBrokerage}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs mb-1">Seller Agent</p>
                                <p className="text-white">{sale.sellerAgent}</p>
                                <p className="text-orange-400 text-xs">{sale.sellerBrokerage}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
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
                    <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded text-sm border ${currentPage === p ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'border-white/10 text-gray-400 hover:text-white'}`}>{p}</button>
                  )
                )}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded text-sm border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Luxury Sales by Month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="count" fill="#eab308" radius={[4, 4, 0, 0]} name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Price Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={priceTierDist} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {priceTierDist.map((entry, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
