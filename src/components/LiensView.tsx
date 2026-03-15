import { useState, useMemo, Fragment } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  lienRecords,
  liensByType,
} from '@/data/maricopaRealEstateData';
import type {

  LienType,
  LienStatus,
  LiensByType,
} from '@/data/maricopaRealEstateData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  Hash,
  MapPin,
} from 'lucide-react';
import AddressMapLink from './AddressMapLink';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Type & Status Config ───
const typeConfig: Record<LienType, { label: string; color: string; bg: string }> = {
  tax: { label: 'Tax', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
  mechanic: { label: "Mechanic's", color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' },
  hoa: { label: 'HOA', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  judgment: { label: 'Judgment', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  federal_tax: { label: 'Federal Tax', color: 'text-red-300', bg: 'bg-red-800/20 border-red-700/30' },
  state_tax: { label: 'State Tax', color: 'text-orange-300', bg: 'bg-orange-800/20 border-orange-700/30' },
};

const statusConfig: Record<LienStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  released: { label: 'Released', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  foreclosed: { label: 'Foreclosed', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
  satisfied: { label: 'Satisfied', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
};

const CHART_COLORS: Record<string, string> = {
  tax: '#ef4444',
  mechanic: '#f97316',
  hoa: '#3b82f6',
  judgment: '#8b5cf6',
  federal_tax: '#b91c1c',
  state_tax: '#c2410c',
};

const STATUS_PIE_COLORS: Record<string, string> = {
  Active: '#eab308',
  Released: '#22c55e',
  Foreclosed: '#ef4444',
  Satisfied: '#3b82f6',
};

const ITEMS_PER_PAGE = 15;

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export default function LiensView() {
  const { setCurrentView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('filing_date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  // ─── Filtered & Sorted Data ───
  const filteredRecords = useMemo(() => {
    let records = [...lienRecords];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      records = records.filter(
        (r) =>
          r.lienNumber.toLowerCase().includes(term) ||
          r.propertyAddress.toLowerCase().includes(term) ||
          r.lienholder.toLowerCase().includes(term) ||
          r.recordingNumber.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== 'all') {
      records = records.filter((r) => r.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      records = records.filter((r) => r.status === statusFilter);
    }

    records.sort((a, b) => {
      switch (sortBy) {
        case 'filing_date_desc':
          return new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime();
        case 'filing_date_asc':
          return new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        case 'address':
          return a.propertyAddress.localeCompare(b.propertyAddress);
        default:
          return 0;
      }
    });

    return records;
  }, [searchTerm, typeFilter, statusFilter, sortBy]);

  // ─── Pagination ───
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // ─── Stats ───
  const activeRecords = lienRecords.filter((r) => r.status === 'active');
  const totalAmount = activeRecords.reduce((sum, r) => sum + r.amount, 0);
  const avgAmount = activeRecords.length > 0 ? totalAmount / activeRecords.length : 0;

  // ─── Pie chart data ───
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    lienRecords.forEach((r) => {
      const label = statusConfig[r.status].label;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-gray-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-white/5"
          onClick={() => setCurrentView('real_estate_dashboard')}
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Lien Records</h1>
            <p className="text-sm text-gray-500">Public records from county recorder &amp; courts</p>
          </div>
        </div>
        <Badge variant="outline" className="ml-auto border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs">
          Maricopa County
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Liens</p>
          <p className="text-2xl font-bold text-white mt-1">{lienRecords.length}</p>
        </Card>
        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Active Liens</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{activeRecords.length}</p>
        </Card>
        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount (Active)</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(totalAmount)}</p>
        </Card>
        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Lien Amount</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(avgAmount)}</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="bg-[#0d1f3c] border border-white/10 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search liens, addresses, lienholders..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 bg-[#0a1628] border-white/10 text-gray-300 placeholder:text-gray-600 h-9"
            />
          </div>

          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px] bg-[#0a1628] border-white/10 text-gray-300 h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#0d1f3c] border-white/10">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tax">Tax</SelectItem>
              <SelectItem value="mechanic">Mechanic&apos;s</SelectItem>
              <SelectItem value="hoa">HOA</SelectItem>
              <SelectItem value="judgment">Judgment</SelectItem>
              <SelectItem value="federal_tax">Federal Tax</SelectItem>
              <SelectItem value="state_tax">State Tax</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px] bg-[#0a1628] border-white/10 text-gray-300 h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0d1f3c] border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="released">Released</SelectItem>
              <SelectItem value="foreclosed">Foreclosed</SelectItem>
              <SelectItem value="satisfied">Satisfied</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-[#0a1628] border-white/10 text-gray-300 h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#0d1f3c] border-white/10">
              <SelectItem value="filing_date_desc">Filing Date (Newest)</SelectItem>
              <SelectItem value="filing_date_asc">Filing Date (Oldest)</SelectItem>
              <SelectItem value="amount_desc">Amount (High-Low)</SelectItem>
              <SelectItem value="amount_asc">Amount (Low-High)</SelectItem>
              <SelectItem value="address">Address (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-colors h-9 ${showMap ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-white/10 text-gray-400 hover:text-white'}`}
          >
            <MapPin size={14} /> Map
          </button>
        </div>
      </Card>

      {showMap && (
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ height: 400 }}>
          <MapContainer center={[33.45, -111.94]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {filteredRecords.filter((r) => r.property?.lat && r.property?.lng).map((record) => (
              <CircleMarker key={record.id} center={[record.property!.lat ?? 0, record.property!.lng ?? 0]} radius={8} fillColor={CHART_COLORS[record.type] || '#6b7280'} fillOpacity={0.8} stroke={true} color="#fff" weight={1}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{record.propertyAddress}</p>
                    <p className="font-bold">{formatCurrency(record.amount)}</p>
                    <p>{typeConfig[record.type].label} Lien &middot; {statusConfig[record.status].label}</p>
                    <p>Lienholder: {record.lienholder}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1f3c] border-t border-white/10 text-xs text-gray-400 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#ef4444' }}></span> Tax</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#f97316' }}></span> Mechanic's</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#3b82f6' }}></span> HOA</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#8b5cf6' }}></span> Judgment</span>
            <span className="ml-auto">{filteredRecords.filter((r) => r.property?.lat).length} mapped</span>
          </div>
        </div>
      )}

      {/* Data Table */}
      <Card className="bg-[#0d1f3c] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-8"></th>
                <th className="px-4 py-3 text-left">Lien Number</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Property Address</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Filing Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Lienholder</th>
                <th className="px-4 py-3 text-left">Recording #</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => {
                const isExpanded = expandedRow === record.id;
                const tc = typeConfig[record.type];
                const sc = statusConfig[record.status];

                return (
                  <Fragment key={record.id}>
                    <tr
                      className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(isExpanded ? null : record.id)}
                    >
                      <td className="px-4 py-3">
                        {isExpanded ? (
                          <ChevronUp size={14} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={14} className="text-gray-500" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-300">{record.lienNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${tc.bg} ${tc.color}`}>
                          {tc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[240px]"><AddressMapLink address={record.propertyAddress} lat={record.property?.lat} lng={record.property?.lng} className="text-sm" /></td>
                      <td className="px-4 py-3 text-right font-medium text-white">{formatCurrency(record.amount)}</td>
                      <td className="px-4 py-3 text-gray-400">{record.filingDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate">{record.lienholder}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{record.recordingNumber}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-[#0a1628]">
                        <td colSpan={9} className="px-8 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
                            {record.beds != null && (
                              <div>
                                <span className="text-gray-500">Beds</span>
                                <p className="text-gray-300 font-medium">{record.beds}</p>
                              </div>
                            )}
                            {record.baths != null && (
                              <div>
                                <span className="text-gray-500">Baths</span>
                                <p className="text-gray-300 font-medium">{record.baths}</p>
                              </div>
                            )}
                            {record.sqft != null && (
                              <div>
                                <span className="text-gray-500">Sqft</span>
                                <p className="text-gray-300 font-medium">{record.sqft.toLocaleString()}</p>
                              </div>
                            )}
                            {record.yearBuilt != null && (
                              <div>
                                <span className="text-gray-500">Year Built</span>
                                <p className="text-gray-300 font-medium">{record.yearBuilt}</p>
                              </div>
                            )}
                            {record.assessedValue != null && (
                              <div>
                                <span className="text-gray-500">Assessed Value</span>
                                <p className="text-gray-300 font-medium">{formatCurrency(record.assessedValue)}</p>
                              </div>
                            )}
                            {record.marketValue != null && (
                              <div>
                                <span className="text-gray-500">Market Value</span>
                                <p className="text-gray-300 font-medium">{formatCurrency(record.marketValue)}</p>
                              </div>
                            )}
                            {record.apn && (
                              <div>
                                <span className="text-gray-500">APN</span>
                                <p className="text-gray-300 font-medium font-mono">{record.apn}</p>
                              </div>
                            )}
                            {record.releaseDate && (
                              <div>
                                <span className="text-gray-500">Release Date</span>
                                <p className="text-gray-300 font-medium">{record.releaseDate}</p>
                              </div>
                            )}
                            {record.source && (
                              <div>
                                <span className="text-gray-500">Source</span>
                                <p className="text-gray-300 font-medium">{record.source}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}&ndash;{Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)} of {filteredRecords.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <ChevronLeft size={14} />
              </Button>
              {getPageNumbers().map((page, i) =>
                typeof page === 'string' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-600 text-xs">...</span>
                ) : (
                  <Button
                    key={page}
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 p-0 text-xs ${
                      currentPage === page
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-orange-400" /> Liens by Type
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={liensByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {liensByType.map((entry: LiensByType) => (
                  <Cell key={entry.type} fill={CHART_COLORS[entry.type] || '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Hash size={16} className="text-blue-400" /> Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {statusDistribution.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_PIE_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}


