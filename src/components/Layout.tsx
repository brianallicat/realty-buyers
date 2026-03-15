import { Suspense, lazy, useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import Sidebar from './Sidebar';
import MortgageCalculator from './MortgageCalculator';
import LegalResourcesView from './LegalResourcesView';
import AgreementEditor from './AgreementEditor';
import AppShareModal from './AppShareModal';
const RealEstateView = lazy(() => import('./RealEstateView'));
const PropertyMapView = lazy(() => import('./PropertyMapView'));
const ForeclosuresView = lazy(() => import('./ForeclosuresView'));
const LiensView = lazy(() => import('./LiensView'));
const FSBOListingsView = lazy(() => import('./FSBOListingsView'));
const RecentSalesView = lazy(() => import('./RecentSalesView'));
const LuxurySalesView = lazy(() => import('./LuxurySalesView'));
const ListingsUnder1MView = lazy(() => import('./ListingsUnder1MView'));
const ListingsOver1MView = lazy(() => import('./ListingsOver1MView'));
const CountyAssessorView = lazy(() => import('./CountyAssessorView'));
const CountyRecorderView = lazy(() => import('./CountyRecorderView'));
const GISMapView = lazy(() => import('./GISMapView'));
const PropertySearchView = lazy(() => import('./PropertySearchView'));
const UltraLuxuryListingsView = lazy(() => import('./UltraLuxuryListingsView'));
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-[#0a1628]">
      <div className="text-gray-500 text-sm">Loading...</div>
    </div>
  );
}
export default function Layout() {
  const { currentView, setCurrentView } = useApp();
  const [showCalc, setShowCalc] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const handler = () => setShowCalc(true);
    window.addEventListener('openCalculator', handler);
    const shareHandler = () => setShowShare(true);
    window.addEventListener('openShareModal', shareHandler);
    const navHandler = (e: any) => setCurrentView(e.detail);
    window.addEventListener('navigateTo', navHandler);
    return () => {
      window.removeEventListener('openCalculator', handler);
      window.removeEventListener('openShareModal', shareHandler);
      window.removeEventListener('navigateTo', navHandler);
    };
  }, []);
  const renderView = () => {
    switch (currentView) {
      case 'real_estate_dashboard': return <RealEstateView />;
      case 'property_map': return <PropertyMapView />;
      case 'foreclosures': return <ForeclosuresView />;
      case 'liens': return <LiensView />;
      case 'fsbo_listings': return <FSBOListingsView />;
      case 'recent_sales': return <RecentSalesView />;
      case 'luxury_sales': return <LuxurySalesView />;
      case 'listings_under_1m': return <ListingsUnder1MView />;
      case 'listings_over_1m': return <ListingsOver1MView />;
      case 'county_assessor': return <CountyAssessorView />;
      case 'county_recorder': return <CountyRecorderView />;
      case 'gis_map': return <GISMapView />;
      case 'property_search': return <PropertySearchView />;
      case 'ultra_luxury_listings': return <UltraLuxuryListingsView />;
     
      case 'legal_definitions': return <LegalResourcesView section='definitions' />;
      case 'legal_laws': return <LegalResourcesView section='state_federal_laws' />;
      case 'legal_irs': return <LegalResourcesView section='irs' />;
      case 'legal_agreements': return <AgreementEditor />;
      default: return <RealEstateView />;
    }
  };
  return (
    <div className="flex min-h-screen bg-[#0a1628]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {showCalc && <MortgageCalculator onClose={() => setShowCalc(false)} />}
        {showShare && <AppShareModal onClose={() => setShowShare(false)} />}
        <Suspense fallback={<LoadingFallback />}>
          {renderView()}
        </Suspense>
      </main>
    </div>
  );
}



