import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  fsboListings,
  foreclosureTrends,
  liensByType,
  priceDistribution,
  recentActivity,
  totalForeclosures,
  activeForeclosures,
  totalLiens,
  activeLiens,
  totalFSBO,
  unrepresentedParties,
} from '@/data/maricopaRealEstateData';
import type { ActivityFeedItem } from '@/data/maricopaRealEstateData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LineChart, BarChart, AreaChart, PieChart,
  Line, Bar, Area, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Building2, Gavel, FileText, Home, MapPin,
  AlertTriangle, Clock, ArrowRight, Users,
} from 'lucide-react';

const CHART_COLORS = {
  red: '#ef4444', orange: '#f97316', green: '#22c55e',
  blue: '#3b82f6', purple: '#8b5cf6', cyan: '#06b6d4',
};
const PIE_COLORS = [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.orange];

function getActivityIcon(type: string) {
  switch (type) {
    case 'foreclosure': return <Gavel size={16} className="text-red-400" />;
    case 'lien': return <FileText size={16} className="text-orange-400" />;
    case 'fsbo': return <Home size={16} className="text-green-400" />;
    case 'alert': return <AlertTriangle size={16} className="text-yellow-400" />;
    default: return <Clock size={16} className="text-gray-400" />;
  }
}

export default function RealEstateView() {
  const { setCurrentView } = useApp();

  const listingTypeData = useMemo(() => {
    const fsboCount = fsboListings.filter((l) => !l.agentRepresented).length;
    const agentCount = fsboListings.filter((l) => l.agentRepresented).length;
    return [
      { name: 'FSBO', value: fsboCount },
      { name: 'Agent-Represented', value: agentCount },
    ];
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-gray-300 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={28} className="text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Maricopa County Real Estate</h1>
            <p className="text-sm text-gray-500">Public Records &amp; Court Filings</p>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="outline" size="sm" className="border-white/10 bg-[#0d1f3c] hover:bg-[#162d50] text-gray-300" onClick={() => setCurrentView('property_map')}>
          <MapPin size={14} className="mr-1.5" /> Property Map
        </Button>
        <Button variant="outline" size="sm" className="border-white/10 bg-[#0d1f3c] hover:bg-[#162d50] text-gray-300" onClick={() => setCurrentView('foreclosures')}>
          <Gavel size={14} className="mr-1.5" /> Foreclosures
        </Button>
        <Button variant="outline" size="sm" className="border-white/10 bg-[#0d1f3c] hover:bg-[#162d50] text-gray-300" onClick={() => setCurrentView('liens')}>
          <FileText size={14} className="mr-1.5" /> Liens
        </Button>
        <Button variant="outline" size="sm" className="border-white/10 bg-[#0d1f3c] hover:bg-[#162d50] text-gray-300" onClick={() => setCurrentView('fsbo_listings')}>
          <Home size={14} className="mr-1.5" /> FSBO Listings
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0d1f3c] border border-white/10 border-l-4 border-l-red-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Foreclosures</p>
              <p className="text-2xl font-bold text-white mt-1">{totalForeclosures}</p>
              <p className="text-xs text-gray-400 mt-1"><span className="text-red-400 font-medium">{activeForeclosures}</span> active</p>
            </div>
            <div className="p-2.5 bg-red-500/10 rounded-lg"><Gavel size={20} className="text-red-400" /></div>
          </div>
        </Card>
        <Card className="bg-[#0d1f3c] border border-white/10 border-l-4 border-l-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Active Liens</p>
              <p className="text-2xl font-bold text-white mt-1">{totalLiens}</p>
              <p className="text-xs text-gray-400 mt-1"><span className="text-orange-400 font-medium">{activeLiens}</span> active</p>
            </div>
            <div className="p-2.5 bg-orange-500/10 rounded-lg"><FileText size={20} className="text-orange-400" /></div>
          </div>
        </Card>
        <Card className="bg-[#0d1f3c] border border-white/10 border-l-4 border-l-green-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">FSBO Listings</p>
              <p className="text-2xl font-bold text-white mt-1">{totalFSBO}</p>
            </div>
            <div className="p-2.5 bg-green-500/10 rounded-lg"><Home size={20} className="text-green-400" /></div>
          </div>
        </Card>
        <Card className="bg-[#0d1f3c] border border-white/10 border-l-4 border-l-blue-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Unrepresented Parties</p>
              <p className="text-2xl font-bold text-white mt-1">{unrepresentedParties}</p>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-lg"><Users size={20} className="text-blue-400" /></div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Foreclosure Trends (12 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={foreclosureTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Line type="monotone" dataKey="count" stroke={CHART_COLORS.red} strokeWidth={2} dot={false} name="Total" />
              <Line type="monotone" dataKey="dismissed" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} name="Dismissed" />
              <Line type="monotone" dataKey="bankOwned" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} name="Bank Owned" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Liens by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={liensByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e5e7eb' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {liensByType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={[CHART_COLORS.orange, CHART_COLORS.red, CHART_COLORS.blue, CHART_COLORS.purple, CHART_COLORS.cyan, CHART_COLORS.green][index % 6]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Price Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={priceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e5e7eb' }} />
              <Area type="monotone" dataKey="count" stroke={CHART_COLORS.purple} fill={CHART_COLORS.purple} fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#0d1f3c] border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Listing Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={listingTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" paddingAngle={4} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {listingTypeData.map((_, index) => (
                  <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#0d1f3c] border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
        <ScrollArea className="h-[320px]">
          <div className="space-y-3">
            {recentActivity.map((item: ActivityFeedItem, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#0a1628] border border-white/5 hover:border-white/10 transition-colors">
                <div className="mt-0.5">{getActivityIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    {item.amount && <Badge variant="outline" className="border-white/10 text-gray-400 text-xs shrink-0">{item.amount}</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock size={10} className="text-gray-600" />
                    <span className="text-[10px] text-gray-600">{item.timeAgo}</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-600 mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}


