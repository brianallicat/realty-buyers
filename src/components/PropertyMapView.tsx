import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  foreclosureRecords,
  lienRecords,
  fsboListings,
  type ForeclosureRecord,
  type LienRecord,
  type FSBOListing,
  type MaricopaProperty,
} from '@/data/maricopaRealEstateData';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Building2, MapPin, Gavel, FileText, Home, Filter, Search, X, Layers } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createColoredIcon = (color: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const MARKER_ICONS = {
  foreclosure: createColoredIcon('#ef4444'),
  lien: createColoredIcon('#f97316'),
  fsbo: createColoredIcon('#22c55e'),
  standard: createColoredIcon('#3b82f6'),
};

interface MapMarker {
  id: string;
  type: 'foreclosure' | 'lien' | 'fsbo' | 'standard';
  lat: number;
  lng: number;
  property: MaricopaProperty;
  label: string;
  detailLabel: string;
  detailValue: string;
  status: string;
}

const LEGEND_ITEMS = [
  { type: 'foreclosure', color: '#ef4444', label: 'Foreclosure' },
  { type: 'lien', color: '#f97316', label: 'Lien' },
  { type: 'fsbo', color: '#22c55e', label: 'FSBO' },
] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function PropertyMapView() {
  const { setCurrentView } = useApp();
  const [propertyType, setPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allMarkers = useMemo<MapMarker[]>(() => {
    const markers: MapMarker[] = [];

    foreclosureRecords.forEach((rec: ForeclosureRecord) => {
      const prop = rec.property;
      markers.push({
        id: `foreclosure-${rec.id}`,
        type: 'foreclosure',
        lat: prop.lat ?? 33.4484,
        lng: prop.lng ?? -111.949,
        property: prop,
        label: prop.address ?? 'Unknown Address',
        detailLabel: 'Amount Owed',
        detailValue: formatCurrency(rec.amountOwed ?? 0),
        status: rec.status ?? 'Active',
      });
    });

    lienRecords.forEach((rec: LienRecord) => {
      const prop = rec.property ?? { address: rec.propertyAddress, city: '', zip: '', county: 'Maricopa' };
      markers.push({
        id: `lien-${rec.id}`,
        type: 'lien',
        lat: prop.lat ?? 33.4484,
        lng: prop.lng ?? -111.949,
        property: prop,
        label: prop.address ?? rec.propertyAddress,
        detailLabel: 'Lien Amount',
        detailValue: formatCurrency(rec.amount ?? 0),
        status: rec.status ?? 'Active',
      });
    });

    fsboListings.forEach((rec: FSBOListing) => {
      const prop = rec.property ?? { address: rec.address, city: rec.city, zip: rec.zip, county: 'Maricopa' };
      markers.push({
        id: `fsbo-${rec.id}`,
        type: 'fsbo',
        lat: prop.lat ?? 33.4484,
        lng: prop.lng ?? -111.949,
        property: prop,
        label: prop.address ?? rec.address,
        detailLabel: 'List Price',
        detailValue: formatCurrency(rec.price ?? 0),
        status: rec.status ?? 'Active',
      });
    });

    return markers;
  }, []);

  const filteredMarkers = useMemo(() => {
    return allMarkers.filter((m) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          m.label.toLowerCase().includes(q) ||
          (m.property.city ?? '').toLowerCase().includes(q) ||
          (m.property.zip ?? '').toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (propertyType !== 'all') {
        const pType = (m.property.propertyType ?? m.property.type ?? '').toLowerCase();
        if (!pType.includes(propertyType.toLowerCase())) return false;
      }
      if (priceRange !== 'all') {
        const price = m.property.estimatedValue ?? m.property.marketValue ?? m.property.price ?? 0;
        switch (priceRange) {
          case 'under200k': if (price >= 200000) return false; break;
          case '200k-400k': if (price < 200000 || price >= 400000) return false; break;
          case '400k-600k': if (price < 400000 || price >= 600000) return false; break;
          case '600k-800k': if (price < 600000 || price >= 800000) return false; break;
          case '800k+': if (price < 800000) return false; break;
        }
      }
      if (statusFilter !== 'all') {
        if (m.type !== statusFilter) return false;
      }
      return true;
    });
  }, [allMarkers, searchQuery, propertyType, priceRange, statusFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { foreclosure: 0, lien: 0, fsbo: 0, standard: 0 };
    filteredMarkers.forEach((m) => { counts[m.type] = (counts[m.type] ?? 0) + 1; });
    return counts;
  }, [filteredMarkers]);

  const clearFilters = () => { setPropertyType('all'); setPriceRange('all'); setStatusFilter('all'); setSearchQuery(''); };
  const hasActiveFilters = propertyType !== 'all' || priceRange !== 'all' || statusFilter !== 'all' || searchQuery !== '';

  return (
    <div className="h-full flex flex-col bg-[#0a1628]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-blue-400" />
          <h1 className="text-lg font-semibold text-white">Property Map</h1>
          <Badge variant="outline" className="text-gray-400 border-white/10">Maricopa County</Badge>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => setCurrentView('real_estate_dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 border-b border-white/10 bg-[#0a1628]/80">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search address, city, zip..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500 h-9" />
        </div>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-gray-200 h-9">
            <Building2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" /><SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="single family">Single Family</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="multi-family">Multi-Family</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-gray-200 h-9"><SelectValue placeholder="Price Range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under200k">Under $200K</SelectItem>
            <SelectItem value="200k-400k">$200K - $400K</SelectItem>
            <SelectItem value="400k-600k">$400K - $600K</SelectItem>
            <SelectItem value="600k-800k">$600K - $800K</SelectItem>
            <SelectItem value="800k+">$800K+</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-gray-200 h-9">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-gray-400" /><SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="foreclosure">Foreclosure</SelectItem>
            <SelectItem value="lien">Lien</SelectItem>
            <SelectItem value="fsbo">FSBO</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white h-9 px-3">
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="flex-1 relative">
        <MapContainer center={[33.4484, -111.949]} zoom={10} style={{ height: 'calc(100vh - 200px)', width: '100%' }} className="z-0">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
            {filteredMarkers.map((marker) => (
              <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={MARKER_ICONS[marker.type]}>
                <Popup>
                  <div className="min-w-[220px] p-1">
                    <div className="font-semibold text-sm text-gray-900 mb-1">{marker.label}</div>
                    {(marker.property.city || marker.property.zip) && (
                      <div className="text-xs text-gray-600 mb-2">{[marker.property.city, marker.property.zip].filter(Boolean).join(', ')}</div>
                    )}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: marker.type === 'foreclosure' ? '#ef4444' : marker.type === 'lien' ? '#f97316' : '#22c55e' }}>
                        {marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
                      </span>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">{marker.status}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">{marker.detailLabel}:</span>{' '}
                      <span className="font-semibold text-gray-900">{marker.detailValue}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        <Card className="absolute bottom-16 right-4 z-[1000] bg-[#0a1628]/90 border-white/10 backdrop-blur-sm p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-300">Legend</span>
          </div>
          <div className="space-y-1.5">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.type} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-300">{item.label}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{typeCounts[item.type] ?? 0}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between px-6 py-2.5 border-t border-white/10 bg-[#0a1628]">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Showing <span className="text-white font-medium">{filteredMarkers.length}</span> of <span className="text-white font-medium">{allMarkers.length}</span> properties</span>
          {hasActiveFilters && <span className="text-blue-400">({allMarkers.length - filteredMarkers.length} filtered out)</span>}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-red-500" />{typeCounts.foreclosure} Foreclosures</span>
          <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-orange-500" />{typeCounts.lien} Liens</span>
          <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-green-500" />{typeCounts.fsbo} FSBO</span>
        </div>
      </div>
    </div>
  );
}
