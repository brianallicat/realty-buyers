import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, BookOpen, ExternalLink, FileText, Calendar, User, Hash, Search } from 'lucide-react';

const recorderTools = [
  {
    title: 'Document Search (1947–Present)',
    description: 'Search recorded documents by name, recording number, or book/page. 200+ document types available.',
    url: 'https://recorder.maricopa.gov/recdocdata/',
    icon: Search,
    color: '#8b5cf6',
  },
  {
    title: 'Historical Records (1871–1946)',
    description: 'Search early Maricopa County records including original homestead patents, mining claims, and territorial filings.',
    url: 'https://recorder.maricopa.gov/recdocdata/',
    icon: Calendar,
    color: '#f59e0b',
  },
  {
    title: 'eRecording Portal',
    description: 'Submit documents electronically for recording. Used by title companies, attorneys, and real estate professionals.',
    url: 'https://recorder.maricopa.gov/erecording/',
    icon: FileText,
    color: '#3b82f6',
  },
  {
    title: 'Maps & Plats',
    description: 'Search recorded subdivision plats, condominium plats, and survey maps by book and page number.',
    url: 'https://recorder.maricopa.gov/recdocdata/',
    icon: Hash,
    color: '#22c55e',
  },
];

const documentTypes = [
  { category: 'Deeds', types: ['Warranty Deed', 'Quitclaim Deed', 'Special Warranty', 'Beneficiary Deed', 'Personal Representative Deed', 'Trustee Deed'] },
  { category: 'Liens', types: ['Tax Lien', "Mechanic's Lien", 'Judgment Lien', 'Federal Tax Lien', 'HOA Lien', 'Lien Release'] },
  { category: 'Mortgages & Trust', types: ['Deed of Trust', 'Assignment of Deed of Trust', 'Substitution of Trustee', 'Reconveyance', 'Notice of Trustee Sale'] },
  { category: 'Other', types: ['Power of Attorney', 'Affidavit', 'Easement', 'Covenant', 'Lis Pendens', 'Notice of Default'] },
];

export default function CountyRecorderView() {
  const { setCurrentView } = useApp();

  return (
    <div className="p-6 bg-[#0a1628] min-h-screen text-white">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentView('real_estate_dashboard')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <BookOpen size={24} className="text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold">Maricopa County Recorder</h1>
          <p className="text-sm text-gray-400">Recorded documents, deeds, liens & title records</p>
        </div>
        <span className="ml-auto bg-purple-500/20 text-purple-400 text-xs px-3 py-1 rounded-full font-medium">Official County Records</span>
      </div>

      {/* Info Banner */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-purple-300 font-medium mb-1">About the Recorder's Office</p>
        <p className="text-xs text-gray-400">
          The Maricopa County Recorder maintains the official record of all documents affecting real property
          in the county. Records date back to 1871 and include deeds, mortgages, liens, plats, and over 200
          other document types. Name data available from 6/1/1871 through present. Max 500 records per search.
        </p>
      </div>

      {/* Search & Tools */}
      <h2 className="text-lg font-semibold text-white mb-4">Recorder Tools & Portals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {recorderTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.title}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0d1f3c] border border-white/10 rounded-lg p-5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${tool.color}15` }}>
                  <Icon size={20} style={{ color: tool.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white group-hover:text-purple-400">{tool.title}</h3>
                    <ExternalLink size={14} className="text-gray-600 group-hover:text-purple-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{tool.description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Search By */}
      <h2 className="text-lg font-semibold text-white mb-4">Search Parameters</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Recording Number', desc: 'Year + sequence number', icon: Hash, color: '#8b5cf6' },
          { label: 'Personal Name', desc: 'Last, First, Middle', icon: User, color: '#3b82f6' },
          { label: 'Business Name', desc: 'Entity or organization', icon: FileText, color: '#f59e0b' },
          { label: 'Book & Page', desc: 'Docket reference', icon: BookOpen, color: '#22c55e' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
              <Icon size={18} style={{ color: item.color }} className="mb-2" />
              <h3 className="text-sm font-medium text-white">{item.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Document Types */}
      <h2 className="text-lg font-semibold text-white mb-4">Document Types Available</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentTypes.map((cat) => (
          <div key={cat.category} className="bg-[#0d1f3c] border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-400 mb-3">{cat.category}</h3>
            <ul className="space-y-1.5">
              {cat.types.map((type) => (
                <li key={type} className="text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-500/50 shrink-0"></span>
                  {type}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
