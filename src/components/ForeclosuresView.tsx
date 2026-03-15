import { useState, useMemo } from 'react';
import {
  foreclosureRecords,
  foreclosureTrends,
 
 
  type ForeclosureStatus,
} from '@/data/maricopaRealEstateData';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  Gavel, Search, Filter, ArrowUpDown, ExternalLink, Calendar, DollarSign, Building2, ArrowLeft, Download, TrendingUp, TrendingDown, AlertTriangle, MapPin,
} from 'lucide-react';
import AddressMapLink from './AddressMapLink';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const statusMapColors: Record<ForeclosureStatus, string> = {
  pre_foreclosure: '#eab308',
  notice_of_default: '#f97316',
  auction_scheduled: '#ef4444',
  bank_owned: '#a855f7',
  dismissed: '#6b7280',
  reinstated: '#22c55e',
};

const statusConfig: Record<ForeclosureStatus, { label: string; color: string; textColor: string }> = {
  pre_foreclosure: { label: 'Pre-Foreclosure', color: 'bg-yellow-500/20', textColor: 'text-yellow-400' },
  notice_of_default: { label: 'Notice of Default', color: 'bg-orange-500/20', textColor: 'text-orange-400' },
  auction_scheduled: { label: 'Auction Scheduled', color: 'bg-red-500/20', textColor: 'text-red-400' },
  bank_owned: { label: 'Bank Owned (REO)', color: 'bg-purple-500/20', textColor: 'text-purple-400' },
  dismissed: { label: 'Dismissed', color: 'bg-gray-500/20', textColor: 'text-gray-400' },
  reinstated: { label: 'Reinstated', color: 'bg-green-500/20', textColor: 'text-green-400' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ITEMS_PER_PAGE = 15;

export default function ForeclosuresView() {
  const { setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'filingDate' | 'amountOwed' | 'address'>('filingDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'filings' | 'trends'>('filings');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMap, setShowMap] = useState(false);

  const filteredRecords = useMemo(() => {
    let records = [...foreclosureRecords];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      records = records.filter((r) =>
        r.caseNumber.toLowerCase().includes(q) || r.property.address.toLowerCase().includes(q) || r.property.city.toLowerCase().includes(q) || r.lender.toLowerCase().includes(q) || r.borrower.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') records = records.filter((r) => r.status === statusFilter);
    records.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'filingDate') cmp = new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime();
      else if (sortField === 'amountOwed') cmp = a.amountOwed - b.amountOwed;
      else if (sortField === 'address') cmp = a.property.address.localeCompare(b.property.address);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return records;
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const activeStatuses: ForeclosureStatus[] = ['pre_foreclosure', 'notice_of_default', 'auction_scheduled'];
  const activeCount = foreclosureRecords.filter((r) => activeStatuses.includes(r.status)).length;
  const avgAmount = foreclosureRecords.reduce((sum, r) => sum + r.amountOwed, 0) / foreclosureRecords.length;
  const nextAuction = foreclosureRecords
    .filter((r) => r.auctionDate && new Date(r.auctionDate) > new Date())
    .sort((a, b) => new Date(a.auctionDate!).getTime() - new Date(b.auctionDate!).getTime())[0];

  const totalFilingsThisYear = foreclosureTrends.filter((t) => t.month.includes('2026')).reduce((sum, t) => sum + t.count, 0);
  const lastTwoMonths = foreclosureTrends.slice(-2);
  const momChange = lastTwoMonths.length === 2 ? ((lastTwoMonths[1].count - lastTwoMonths[0].count) / lastTwoMonths[0].count) * 100 : 0;

  const cityData = useMemo(() => {
    const map: Record<string, number> = {};
    foreclosureRecords.forEach((r) => { map[r.property.city] = (map[r.property.city] || 0) + 1; });
    return Object.entries(map).map(([city, filings]) => ({ city, filings })).sort((a, b) => b.filings - a.filings);
  }, []);

  const mostAffectedZip = useMemo(() => {
    const map: Record<string, number> = {};
    foreclosureRecords.forEach((r) => { map[r.property.zip] = (map[r.property.zip] || 0) + 1; });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : '—';
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#0d1f3c] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white hover:bg-white/5">
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg"><Gavel size={24} className="text-red-400" /></div>
            <div>
              <h1 className="text-2xl font-bold text-white">Foreclosures &mdash; Court Filings</h1>
              <p className="text-sm text-gray-400">Source: Maricopa County Superior Court &mdash; Public Records</p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">
          <Download size={14} className="mr-2" /> Export CSV
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'filings' | 'trends')}>
        <TabsList className="bg-[#0d1f3c] border border-white/10">
          <TabsTrigger value="filings" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Active Filings</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="filings" className="space-y-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search case, address, lender..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9 bg-[#0d1f3c] border-white/10 text-gray-200 placeholder:text-gray-500" />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[200px] bg-[#0d1f3c] border-white/10 text-gray-300">
                <Filter size={14} className="mr-2 text-gray-500" /><SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1f3c] border-white/10">
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([key, cfg]) => (<SelectItem key={key} value={key}>{cfg.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={sortField} onValueChange={(v) => { setSortField(v as any); setCurrentPage(1); }}>
              <SelectTrigger className="w-[180px] bg-[#0d1f3c] border-white/10 text-gray-300">
                <ArrowUpDown size={14} className="mr-2 text-gray-500" /><SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1f3c] border-white/10">
                <SelectItem value="filingDate">Filing Date</SelectItem>
                <SelectItem value="amountOwed">Amount Owed</SelectItem>
                <SelectItem value="address">Address</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))} className="text-gray-400 hover:text-white hover:bg-white/5">
              <ArrowUpDown size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowMap(!showMap)} className={`${showMap ? 'bg-blue-500/15 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <MapPin size={14} className="mr-1" /> Map
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#0d1f3c] border-white/10"><CardContent className="p-4 flex items-center gap-3"><div className="p-2 bg-blue-500/10 rounded-lg"><Building2 size={20} className="text-blue-400" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider">Total Filings</p><p className="text-xl font-bold text-white">{foreclosureRecords.length}</p></div></CardContent></Card>
            <Card className="bg-[#0d1f3c] border-white/10"><CardContent className="p-4 flex items-center gap-3"><div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle size={20} className="text-red-400" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider">Active</p><p className="text-xl font-bold text-white">{activeCount}</p></div></CardContent></Card>
            <Card className="bg-[#0d1f3c] border-white/10"><CardContent className="p-4 flex items-center gap-3"><div className="p-2 bg-amber-500/10 rounded-lg"><DollarSign size={20} className="text-amber-400" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider">Avg Amount Owed</p><p className="text-xl font-bold text-white">{formatCurrency(avgAmount)}</p></div></CardContent></Card>
            <Card className="bg-[#0d1f3c] border-white/10"><CardContent className="p-4 flex items-center gap-3"><div className="p-2 bg-purple-500/10 rounded-lg"><Calendar size={20} className="text-purple-400" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider">Next Auction</p><p className="text-xl font-bold text-white">{nextAuction?.auctionDate ? formatDate(nextAuction.auctionDate) : '—'}</p></div></CardContent></Card>
          </div>

          {showMap && (
            <div className="rounded-lg border border-white/10 overflow-hidden" style={{ height: 400 }}>
              <MapContainer center={[33.45, -111.94]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {filteredRecords.map((record) => (
                  <CircleMarker key={record.id}center={[record.property.lat ?? 0, record.property.lng ?? 0]} radius={8} fillColor={statusMapColors[record.status]} fillOpacity={0.8} stroke={true} color="#fff" weight={1}>
                    <Popup>
                      <div className="text-xs">
                        <p className="font-bold">{record.property.address}</p>
                        <p>{record.property.city}, AZ {record.property.zip}</p>
                        <p className="font-bold">{formatCurrency(record.amountOwed)}</p>
                        <p>{statusConfig[record.status].label}</p>
                        <p>Lender: {record.lender}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
              <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1f3c] border-t border-white/10 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#eab308' }}></span> Pre-Foreclosure</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#f97316' }}></span> Notice of Default</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#ef4444' }}></span> Auction Scheduled</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#a855f7' }}></span> Bank Owned</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#22c55e' }}></span> Reinstated</span>
                <span className="ml-auto">{filteredRecords.length} filings</span>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0d1f3c] border-b border-white/10">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Case Number</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Property Address</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Filing Date</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                    <th className="text-right px-4 py-3 text-gray-400 font-medium">Amount Owed</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Lender</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Auction Date</th>
                    <th className="text-center px-4 py-3 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record) => {
                    const st = statusConfig[record.status];
                    return (
                      <tr key={record.id} className="bg-[#0d1f3c] hover:bg-[#132d5e] transition border-b border-white/5">
                        <td className="px-4 py-3 font-mono text-blue-300 text-xs">{record.caseNumber}</td>
                        <td className="px-4 py-3"><AddressMapLink address={record.property.address} city={record.property.city} zip={record.property.zip} lat={record.property.lat} lng={record.property.lng} /><div className="text-gray-500 text-xs">{record.property.city}, AZ {record.property.zip}</div></td>
                        <td className="px-4 py-3 text-gray-300">{formatDate(record.filingDate)}</td>
                        <td className="px-4 py-3"><Badge className={`${st.color} ${st.textColor} border-0 text-xs`}>{st.label}</Badge></td>
                        <td className="px-4 py-3 text-right text-gray-200 font-medium">{formatCurrency(record.amountOwed)}</td>
                        <td className="px-4 py-3 text-gray-300 text-xs">{record.lender}</td>
                        <td className="px-4 py-3 text-gray-300">{record.auctionDate ? formatDate(record.auctionDate) : '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" onClick={() => window.open(record.courtRecordUrl, '_blank')}>
                            <ExternalLink size={14} className="mr-1" /> Court Record
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d1f3c] border-t border-white/10">
                <p className="text-sm text-gray-500">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)} of {filteredRecords.length} filings</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-40">Previous</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)} className={page === currentPage ? 'bg-blue-600 text-white' : 'border-white/10 text-gray-300 hover:bg-white/5'}>{page}</Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-40">Next</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-[#0d1f3c] border-white/10"><CardContent className="p-4 flex items-center gap-3"><div className="p-2 bg-blue-500/10 rounded-lg"><Building2 size={20} className="text-blue-400" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider">Filings This Year</p><p className="text-xl font-bold text-white">{totalFilingsThisYear}</p></div></CardContent></Card>
            <Card className="bg-[#0d1f3c] border-white/10"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg ${momChange >= 0 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>{momChange >= 0 ? <TrendingUp size={20} className="text-red-400" /> : <TrendingDown size={20} className="text-green-400" />}</div><div><p className="text-xs text-gray-500 uppercase tracking-wider">Month-over-Month</p><p className={`text-xl font-bold ${momChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>{momChange >= 0 ? '+' : ''}{momChange.toFixed(1)}%</p></div></CardContent></Card>
            <Card className="bg-[#0d1f3c] border-white/10"><CardContent className="p-4 flex items-center gap-3"><div className="p-2 bg-amber-500/10 rounded-lg"><AlertTriangle size={20} className="text-amber-400" /></div><div><p className="text-xs text-gray-500 uppercase tracking-wider">Most Affected Zip</p><p className="text-xl font-bold text-white">{mostAffectedZip}</p></div></CardContent></Card>
          </div>

          <Card className="bg-[#0d1f3c] border-white/10">
            <CardHeader><CardTitle className="text-white text-lg">Monthly Foreclosure Filings</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={foreclosureTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" name="Total Filings" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="dismissed" name="Dismissed" stroke="#6b7280" strokeWidth={2} dot={{ fill: '#6b7280', r: 3 }} />
                  <Line type="monotone" dataKey="bankOwned" name="Bank Owned" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#0d1f3c] border-white/10">
            <CardHeader><CardTitle className="text-white text-lg">Filings by City</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="city" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="filings" name="Filings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

