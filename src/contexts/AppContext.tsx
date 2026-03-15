import React, { createContext, useContext, useState } from 'react';

export type ViewMode =
  | 'real_estate_dashboard'
  | 'property_map'
  | 'foreclosures'
  | 'liens'
  | 'fsbo_listings'
  | 'recent_sales'
  | 'luxury_sales'
  | 'listings_under_1m'
  | 'listings_over_1m'
  | 'county_assessor'
  | 'county_recorder'
  | 'gis_map'
  | 'property_search'
  | 'ultra_luxury_listings' | 'legal_definitions' | 'legal_laws' | 'legal_irs' | 'legal_agreements';

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewMode>('real_estate_dashboard');

  return (
    <AppContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

