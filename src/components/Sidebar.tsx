import { useApp, type ViewMode } from "@/contexts/AppContext";
import { Building2, MapPin, Gavel, FileText, Home, DollarSign, Tag, Gem, Landmark, BookOpen, Globe, SearchCheck, Diamond, Scale, BookMarked, Receipt, ClipboardList, ScrollText } from "lucide-react";
const navItems = [ { id: "real_estate_dashboard" as ViewMode, label: "Dashboard", icon: Building2 }, { id: "property_map" as ViewMode, label: "Property Map", icon: MapPin }, { id: "foreclosures" as ViewMode, label: "Foreclosures", icon: Gavel }, { id: "liens" as ViewMode, label: "Liens", icon: FileText }, { id: "fsbo_listings" as ViewMode, label: "FSBO Listings", icon: Home }, { id: "recent_sales" as ViewMode, label: "Recent Sales", icon: DollarSign }, { id: "listings_under_1m" as ViewMode, label: "Listings Under $1M", icon: Tag }, { id: "listings_over_1m" as ViewMode, label: "Listings Over $1M", icon: Gem }, { id: "ultra_luxury_listings" as ViewMode, label: "Ultra Luxury $6M+", icon: Diamond } ];
const countyItems = [ { id: "property_search" as ViewMode, label: "Property Search", icon: SearchCheck }, { id: "county_assessor" as ViewMode, label: "County Assessor", icon: Landmark }, { id: "county_recorder" as ViewMode, label: "County Recorder", icon: BookOpen }, { id: "gis_map" as ViewMode, label: "GIS Mapping", icon: Globe } ];
const legalItems = [ { id: "legal_definitions" as ViewMode, label: "RE Definitions", icon: BookMarked }, { id: "legal_laws" as ViewMode, label: "State/Federal Laws", icon: Scale }, { id: "legal_irs" as ViewMode, label: "IRS & Tax Rules", icon: Receipt }, { id: "legal_agreements" as ViewMode, label: "Agreement Templates", icon: ClipboardList } ];
export default function Sidebar() {
  const { currentView, setCurrentView } = useApp();
  const btn = (id: ViewMode, label: string, Icon: React.ElementType) => {
    const active = currentView === id;
    return ( <button key={id} onClick={() => setCurrentView(id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${active ? "bg-blue-500/15 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><Icon size={16} />{label}</button> );
  };
  return (
    <aside className="w-56 bg-[#0d1f3c] border-r border-white/10 flex flex-col min-h-screen">
      <button onClick={() => window.dispatchEvent(new CustomEvent("openShareModal"))} className="p-4 border-b border-white/10 w-full text-left hover:bg-white/5 transition-colors group" title="Share app">
        <div className="flex items-center gap-2">
          <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg,#1a3a6b,#2563eb)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(37,99,235,0.4)",flexShrink:0}}>
            <svg width="22" height="22" viewBox="0 0 36 36" fill="none"><path d="M18 4L32 14V32H22V22H14V32H4V14L18 4Z" fill="white" opacity="0.95"/><circle cx="18" cy="16" r="3" fill="#60a5fa"/></svg>
          </div>
          <div className="flex-1 min-w-0"><h1 className="text-sm font-bold text-white leading-tight">Realty Buyers</h1><p className="text-[10px] text-gray-500">Maricopa County</p></div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" style={{fontSize:"14px"}}>↗</div>
        </div>
      </button>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 px-3 py-2">Real Estate</p>
        {navItems.map(item => btn(item.id, item.label, item.icon))}
        <p className="text-[10px] uppercase tracking-wider text-gray-500 px-3 py-2 mt-3">County Records</p>
        {countyItems.map(item => btn(item.id, item.label, item.icon))}
        <p className="text-[10px] uppercase tracking-wider text-gray-500 px-3 py-2 mt-3">Legal Resources</p>
        {legalItems.map(item => btn(item.id, item.label, item.icon))}
        <button onClick={() => window.dispatchEvent(new CustomEvent("openCalculator"))} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-amber-400 hover:text-amber-300 hover:bg-white/5 mt-2"><ScrollText size={16} />Mortgage Calculator</button>
        <div style={{marginTop:"10px",padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}}>
          <p style={{color:"#4b5563",fontSize:"9px",marginBottom:"3px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Created by</p>
          <p style={{color:"#93c5fd",fontSize:"10px",fontWeight:700,lineHeight:"1.5"}}>Global Resources</p>
          <p style={{color:"#93c5fd",fontSize:"10px",fontWeight:700,lineHeight:"1.5"}}>Management Group, LLC</p>
        </div>
      </nav>
      <div className="p-3 border-t border-white/10"><p className="text-[9px] text-gray-600 text-center">Maricopa County Public Records</p></div>
    </aside>
  );
}