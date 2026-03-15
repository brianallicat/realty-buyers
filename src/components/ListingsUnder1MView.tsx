import { activeListingsUnder1M } from '@/data/maricopaRealEstateData';
import { Tag } from 'lucide-react';
import ActiveListingsView from './ActiveListingsView';

export default function ListingsUnder1MView() {
  return (
    <ActiveListingsView
      title="Listings Under $1M"
      subtitle="Active, pending & withdrawn listings — Maricopa County"
      badgeLabel="Under $1M"
      badgeColor="#3b82f6"
      accentColor="#3b82f6"
      icon={Tag}
      listings={activeListingsUnder1M}
    />
  );
}
