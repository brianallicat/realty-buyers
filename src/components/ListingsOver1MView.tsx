import { activeListingsOver1M } from '@/data/maricopaRealEstateData';
import { Gem } from 'lucide-react';
import ActiveListingsView from './ActiveListingsView';

export default function ListingsOver1MView() {
  return (
    <ActiveListingsView
      title="Listings Over $1M"
      subtitle="Luxury active, pending & withdrawn listings — Maricopa County"
      badgeLabel="$1M+ Premium"
      badgeColor="#eab308"
      accentColor="#eab308"
      icon={Gem}
      listings={activeListingsOver1M}
    />
  );
}
