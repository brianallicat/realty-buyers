import { ExternalLink } from 'lucide-react';

interface Props {
  address: string;
  city?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  className?: string;
}

export default function AddressMapLink({ address, city, zip, lat, lng, className = '' }: Props) {
  const url = lat && lng
    ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent([address, city, 'AZ', zip].filter(Boolean).join(', '))}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-white hover:text-blue-400 transition-colors font-medium ${className}`}
      onClick={(e) => e.stopPropagation()}
      title="Open in OpenStreetMap"
    >
      {address}
      <ExternalLink size={11} className="text-blue-400/60 shrink-0" />
    </a>
  );
}
