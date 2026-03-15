import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { fsboListings } from '@/data/maricopaRealEstateData';
import type {

  ListingType,
  PropertyStatus,
} from '@/data/maricopaRealEstateData';
import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  List,
  Info,
  Calendar,
  Bed,
  Bath,
  Ruler,
  Clock,
  MapPin,
} from 'lucide-react';
import AddressMapLink from './AddressMapLink';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Listing Type Config ───
const listingTypeConfig: Record<ListingType, { label: string; color: string; bg: string }> = {
  fsbo: { label: 'FSBO', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  unrepresented_buyer: { label: 'Unrep. Buyer', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  unrepresented_seller: { label: 'Unrep. Seller', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  standard: { label: 'Standard', color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30' },
};

const statusMapColors: Record<PropertyStatus, string> = {
  active: '#22c55e',
  pending: '#f59e0b',
  sold: '#3b82f6',
  withdrawn: '#ef4444',
  expired: '#6b7280',
};

const statusConfig: Record<PropertyStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  sold: { label: 'Sold', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  withdrawn: { label: 'Withdrawn', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
  expired: { label: 'Expired', color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30' },
};

const GRID_PER_PAGE = 12;
const TABLE_PER_PAGE = 15;

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export default function FSBOListingsView() {
  const { setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<string>('fsbo');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === 'grid' ? GRID_PER_PAGE : TABLE_PER_PAGE;

  // ─── Filter by tab ───
  const tabFilteredListings = useMemo(() => {
    switch (activeTab) {
      case 'fsbo':
        return fsboListings.filter((l) => l.listingType === 'fsbo');
      case 'unrepresented_buyers':
        return fsboListings.filter((l) => l.listingType === 'unrepresented_buyer');
      case 'unrepresented_sellers':
        return fsboListings.filter((l) => l.listingType === 'unrepresented_seller');
      default:
        return fsboListings;
    }
  }, [activeTab]);

  // ─── Apply filters ───
  const filteredListings = useMemo(() => {
    let listings = [...tabFilteredListings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.address.toLowerCase().includes(term) ||
          l.city.toLowerCase().includes(term) ||
          l.zip.includes(term) ||
          l.propertyType.toLowerCase().includes(term)
      );
    }

    if (priceRange !== 'all') {
      listings = listings.filter((l) => {
        switch (priceRange) {
          case 'under_200k': return l.price < 200000;
          case '200k_300k': return l.price >= 200000 && l.price < 300000;
          case '300k_400k': return l.price >= 300000 && l.price < 400000;
          case '400k_500k': return l.price >= 400000 && l.price < 500000;
          case '500k_plus': return l.price >= 500000;
          default: return true;
        }
      });
    }

    if (propertyType !== 'all') {
      listings = listings.filter((l) => l.propertyType === propertyType);
    }

    return listings;
  }, [tabFilteredListings, searchTerm, priceRange, propertyType]);

  // ─── Pagination ───
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
  const avgPrice = tabFilteredListings.length > 0
    ? tabFilteredListings.reduce((s, l) => s + l.price, 0) / tabFilteredListings.length
    : 0;
  const avgDaysOnMarket = tabFilteredListings.length > 0
    ? Math.round(tabFilteredListings.reduce((s, l) => s + l.daysOnMarket, 0) / tabFilteredListings.length)
    : 0;
  const newThisWeek = tabFilteredListings.filter((l) => l.daysOnMarket <= 7).length;

  // Reset page on filter change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

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
          <Home size={24} className="text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">FSBO &amp; Unrepresented Parties</h1>
            <p className="text-sm text-gray-500">For Sale by Owner &amp; unrepresented party listings</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-500/5 border border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-blue-300 font-medium">ADRE Cross-Reference</p>
            <p className="text-xs text-gray-400 mt-1">
              All listings are cross-referenced with the Arizona Department of Real Estate (ADRE) database to verify
              agent representation status and ensure compliance with Arizona real estate regulations.
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-[#0d1f3c] border border-white/10">
          <TabsTrigger value="fsbo" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
            FSBO Listings
          </TabsTrigger>
          <TabsTrigger value="unrepresented_buyers" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Unrepresented Buyers
          </TabsTrigger>
          <TabsTrigger value="unrepresented_sellers" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            Unrepresented Sellers
          </TabsTrigger>
        </TabsList>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card className="bg-[#0d1f3c] border border-white/10 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Listings</p>
            <p className="text-2xl font-bold text-white mt-1">{tabFilteredListings.length}</p>
          </Card>
          <Card className="bg-[#0d1f3c] border border-white/10 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Price</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(avgPrice)}</p>
          </Card>
          <Card className="bg-[#0d1f3c] border border-white/10 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Days on Market</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{avgDaysOnMarket}</p>
          </Card>
          <Card className="bg-[#0d1f3c] border border-white/10 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">New This Week</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">{newThisWeek}</p>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="bg-[#0d1f3c] border border-white/10 p-4 mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search address, city, zip..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 bg-[#0a1628] border-white/10 text-gray-300 placeholder:text-gray-600 h-9"
              />
            </div>

            <Select value={priceRange} onValueChange={(v) => { setPriceRange(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px] bg-[#0a1628] border-white/10 text-gray-300 h-9">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1f3c] border-white/10">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under_200k">Under $200K</SelectItem>
                <SelectItem value="200k_300k">$200K - $300K</SelectItem>
                <SelectItem value="300k_400k">$300K - $400K</SelectItem>
                <SelectItem value="400k_500k">$400K - $500K</SelectItem>
                <SelectItem value="500k_plus">$500K+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={(v) => { setPropertyType(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px] bg-[#0a1628] border-white/10 text-gray-300 h-9">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1f3c] border-white/10">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Single Family">Single Family</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-colors h-9 ${showMap ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-white/10 text-gray-400 hover:text-white'}`}
            >
              <MapPin size={14} /> Map
            </button>

            <div className="flex items-center border border-white/10 rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setViewMode('grid'); setCurrentPage(1); }}
                className={`h-9 px-3 rounded-none ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <LayoutGrid size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setViewMode('table'); setCurrentPage(1); }}
                className={`h-9 px-3 rounded-none ${viewMode === 'table' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <List size={14} />
              </Button>
            </div>
          </div>
        </Card>

        {showMap && (
          <div className="rounded-lg border border-white/10 overflow-hidden mt-4" style={{ height: 400 }}>
            <MapContainer center={[33.45, -111.94]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {filteredListings.filter((l) => l.property?.lat && l.property?.lng).map((listing) => (
                <CircleMarker key={listing.id}center={[listing.property!.lat ?? 0, listing.property!.lng ?? 0]} radius={8} fillColor={statusMapColors[listing.status]} fillOpacity={0.8} stroke={true} color="#fff" weight={1}>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-bold">{listing.address}</p>
                      <p>{listing.city}, AZ {listing.zip}</p>
                      <p className="font-bold text-green-600">{formatCurrency(listing.price)}</p>
                      <p>{listing.beds}bd/{listing.baths}ba &middot; {listing.sqft.toLocaleString()} sqft</p>
                      <p>{statusConfig[listing.status].label} &middot; {listing.daysOnMarket} days</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
            <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1f3c] border-t border-white/10 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Active</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span> Pending</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Sold</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Withdrawn</span>
              <span className="ml-auto">{filteredListings.filter((l) => l.property?.lat).length} mapped</span>
            </div>
          </div>
        )}

        {/* Content for all tabs shares the same rendering */}
        <TabsContent value={activeTab} className="mt-4">
          {filteredListings.length === 0 ? (
            /* Empty State */
            <Card className="bg-[#0d1f3c] border border-white/10 p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Search size={48} className="text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Listings Found</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  No listings match your current filters. Try adjusting your search criteria or clearing filters.
                </p>
              </div>
            </Card>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedListings.map((listing) => {
                const ltc = listingTypeConfig[listing.listingType];
                const sc = statusConfig[listing.status];

                return (
                  <Card key={listing.id} className="bg-[#0d1f3c] border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                    <div className="p-4 space-y-3">
                      {/* Badges */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${ltc.bg} ${ltc.color}`}>
                          {ltc.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                      </div>

                      {/* Address */}
                      <div>
                        <AddressMapLink address={listing.address} city={listing.city} zip={listing.zip} lat={listing.property?.lat} lng={listing.property?.lng} className="text-sm font-medium" />
                        <p className="text-xs text-gray-500">{listing.city}, AZ {listing.zip}</p>
                      </div>

                      {/* Price */}
                      <p className="text-xl font-bold text-green-400">{formatCurrency(listing.price)}</p>

                      {/* Property Details */}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Bed size={12} /> {listing.beds} bd</span>
                        <span className="flex items-center gap-1"><Bath size={12} /> {listing.baths} ba</span>
                        <span className="flex items-center gap-1"><Ruler size={12} /> {listing.sqft.toLocaleString()} sqft</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {listing.yearBuilt}</span>
                      </div>

                      {/* Days on Market */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{listing.daysOnMarket} days on market</span>
                      </div>

                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <Card className="bg-[#0d1f3c] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Address</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-center">Beds</th>
                      <th className="px-4 py-3 text-center">Baths</th>
                      <th className="px-4 py-3 text-right">Sqft</th>
                      <th className="px-4 py-3 text-center">Year</th>
                      <th className="px-4 py-3 text-center">DOM</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedListings.map((listing) => {
                      const ltc = listingTypeConfig[listing.listingType];
                      const sc = statusConfig[listing.status];

                      return (
                        <tr key={listing.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${ltc.bg} ${ltc.color}`}>
                              {ltc.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <AddressMapLink address={listing.address} city={listing.city} zip={listing.zip} lat={listing.property?.lat} lng={listing.property?.lng} className="text-xs" />
                            <p className="text-gray-600 text-[10px]">{listing.city}, AZ {listing.zip}</p>
                          </td>
                          <td className="px-4 py-2.5 text-right font-medium text-green-400">{formatCurrency(listing.price)}</td>
                          <td className="px-4 py-2.5 text-center text-gray-400">{listing.beds}</td>
                          <td className="px-4 py-2.5 text-center text-gray-400">{listing.baths}</td>
                          <td className="px-4 py-2.5 text-right text-gray-400">{listing.sqft.toLocaleString()}</td>
                          <td className="px-4 py-2.5 text-center text-gray-400">{listing.yearBuilt}</td>
                          <td className="px-4 py-2.5 text-center text-gray-400">{listing.daysOnMarket}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${sc.bg} ${sc.color}`}>
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1}&ndash;{Math.min(currentPage * itemsPerPage, filteredListings.length)} of {filteredListings.length}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
