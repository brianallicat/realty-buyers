import { useState, useRef } from 'react';

interface Agreement {
  name: string;
  cat: string;
  desc: string;
  fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
  template: string;
}

const agreements: Agreement[] = [
  {
    name: 'NCND Agreement',
    cat: 'Wholesale/Investment',
    desc: 'Non-Circumvent, Non-Disclosure Agreement',
    fields: [
      { key: 'date', label: 'Date', placeholder: 'March 14, 2026' },
      { key: 'partyA', label: 'Party A (First Party)', placeholder: 'Full name or company' },
      { key: 'partyB', label: 'Party B (Second Party)', placeholder: 'Full name or company' },
      { key: 'years', label: 'Non-Circumvent Period (years)', placeholder: '2' },
      { key: 'contacts', label: 'Protected Contacts', placeholder: 'List names/companies', multiline: true },
      { key: 'damages', label: 'Liquidated Damages Amount', placeholder: '$10,000' },
    ],
    template: `NON-CIRCUMVENT, NON-DISCLOSURE AGREEMENT

Date: {{date}}
Party A: {{partyA}} ("First Party")
Party B: {{partyB}} ("Second Party")

1. NON-DISCLOSURE
Each party agrees not to disclose confidential information including: buyer/seller names, contact information, transaction details, pricing, and proprietary business information shared during our dealings.

2. NON-CIRCUMVENT
Each party agrees not to directly or indirectly contact, deal with, or engage any contacts introduced by the other party without express written permission. This restriction applies for {{years}} years from the date of last transaction.

3. PROTECTED CONTACTS
The following contacts are protected under this agreement:
{{contacts}}

4. REMEDIES
In the event of breach, the non-breaching party shall be entitled to liquidated damages of {{damages}} per violation, plus reasonable attorney's fees and costs.

5. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Arizona.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

Party A: ______________________________ Date: ____________
Printed Name: {{partyA}}

Party B: ______________________________ Date: ____________
Printed Name: {{partyB}}`
  },
  {
    name: 'Buyer Representation Agreement',
    cat: 'Agent Agreements',
    desc: 'Establishes agency relationship between buyer and real estate agent',
    fields: [
      { key: 'date', label: 'Date', placeholder: 'March 14, 2026' },
      { key: 'buyer', label: 'Buyer Name(s)', placeholder: 'Full legal name(s)' },
      { key: 'agent', label: 'Agent Name', placeholder: 'Agent full name' },
      { key: 'brokerage', label: 'Brokerage Name', placeholder: 'Brokerage company name' },
      { key: 'area', label: 'Search Area', placeholder: 'Maricopa County, AZ' },
      { key: 'minPrice', label: 'Min Price', placeholder: '$200,000' },
      { key: 'maxPrice', label: 'Max Price', placeholder: '$600,000' },
      { key: 'startDate', label: 'Agreement Start Date', placeholder: 'March 14, 2026' },
      { key: 'endDate', label: 'Agreement End Date', placeholder: 'September 14, 2026' },
      { key: 'commission', label: 'Commission %', placeholder: '2.5' },
    ],
    template: `BUYER REPRESENTATION AGREEMENT

Date: {{date}}

PARTIES:
Buyer: {{buyer}}
Agent: {{agent}}
Brokerage: {{brokerage}}

1. REPRESENTATION
Agent agrees to represent Buyer as buyer's exclusive agent in the purchase of real property in:
Search Area: {{area}}
Price Range: {{minPrice}} to {{maxPrice}}

2. TERM
This agreement is effective from {{startDate}} through {{endDate}}.

3. COMPENSATION
Buyer agrees to pay Agent a fee of {{commission}}% of the purchase price if Seller does not offer sufficient buyer's agent compensation to cover this amount.

4. BUYER OBLIGATIONS
Buyer agrees to: (a) work exclusively with Agent during the term; (b) notify Agent of all properties of interest; (c) not purchase property without Agent's involvement.

5. AGENT OBLIGATIONS
Agent agrees to: (a) represent Buyer's best interests with loyalty; (b) conduct diligent property search; (c) maintain strict confidentiality; (d) disclose all known material facts.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Arizona.

Buyer Signature: ______________________________ Date: ____________
Printed Name: {{buyer}}

Agent Signature: ______________________________ Date: ____________
Printed Name: {{agent}}
Brokerage: {{brokerage}}`
  },
  {
    name: 'Letter of Intent (LOI) to Purchase',
    cat: 'Purchase Agreements',
    desc: 'Non-binding letter of intent to purchase real property',
    fields: [
      { key: 'date', label: 'Date', placeholder: 'March 14, 2026' },
      { key: 'seller', label: 'Seller Name', placeholder: 'Seller full name' },
      { key: 'buyer', label: 'Buyer Name', placeholder: 'Buyer full name' },
      { key: 'property', label: 'Property Address', placeholder: '1234 E Main St, Phoenix, AZ 85001' },
      { key: 'price', label: 'Purchase Price', placeholder: '$450,000' },
      { key: 'earnest', label: 'Earnest Money Deposit', placeholder: '$15,000' },
      { key: 'emdDays', label: 'EMD Due (days after PSA)', placeholder: '3' },
      { key: 'financing', label: 'Financing Type', placeholder: 'Conventional' },
      { key: 'downPct', label: 'Down Payment %', placeholder: '20' },
      { key: 'loanAmt', label: 'Loan Amount', placeholder: '$360,000' },
      { key: 'ddDays', label: 'Due Diligence Period (days)', placeholder: '10' },
      { key: 'closeDate', label: 'Closing Date', placeholder: 'April 30, 2026' },
    ],
    template: `LETTER OF INTENT TO PURCHASE REAL PROPERTY
(NON-BINDING)

Date: {{date}}

To: {{seller}} ("Seller")
From: {{buyer}} ("Buyer")
Re: Property at {{property}}

Dear {{seller}},

This Letter of Intent ("LOI") outlines proposed terms under which Buyer intends to purchase the above-referenced property. This LOI is NON-BINDING and subject to execution of a formal Purchase and Sale Agreement.

PROPOSED TERMS:

Purchase Price: {{price}}
Earnest Money Deposit: {{earnest}} (due within {{emdDays}} days of executed PSA)
Financing Type: {{financing}}
Down Payment: {{downPct}}%
Loan Amount: {{loanAmt}}

Due Diligence Period: {{ddDays}} days from executed PSA
Target Closing Date: On or before {{closeDate}}

CONTINGENCIES:
- Financing approval
- Satisfactory home inspection
- Clear and marketable title
- Appraisal at or above purchase price

This LOI does NOT create a binding obligation on either party. Neither party shall be legally bound until a formal Purchase and Sale Agreement has been fully executed by all parties.

Respectfully submitted,

Buyer: ______________________________ Date: ____________
Printed Name: {{buyer}}

Seller Acknowledgment: ______________________________ Date: ____________
Printed Name: {{seller}}`
  },
  {
    name: 'Residential Lease Agreement',
    cat: 'Rental Agreements',
    desc: 'Arizona residential lease governed by A.R.S. § 33-1301',
    fields: [
      { key: 'date', label: 'Agreement Date', placeholder: 'March 14, 2026' },
      { key: 'landlord', label: 'Landlord Name', placeholder: 'Full legal name' },
      { key: 'tenant', label: 'Tenant Name(s)', placeholder: 'All tenant full names' },
      { key: 'property', label: 'Rental Property Address', placeholder: '1234 W Main St, Phoenix, AZ 85001' },
      { key: 'startDate', label: 'Lease Start Date', placeholder: 'April 1, 2026' },
      { key: 'endDate', label: 'Lease End Date', placeholder: 'March 31, 2027' },
      { key: 'rent', label: 'Monthly Rent', placeholder: '$1,800' },
      { key: 'dueDay', label: 'Rent Due Day', placeholder: '1st' },
      { key: 'lateFee', label: 'Late Fee Amount', placeholder: '$75' },
      { key: 'graceDays', label: 'Grace Period (days)', placeholder: '5' },
      { key: 'deposit', label: 'Security Deposit', placeholder: '$1,800' },
      { key: 'minorRepair', label: 'Tenant Minor Repair Limit', placeholder: '$100' },
      { key: 'pets', label: 'Pet Policy', placeholder: 'No pets allowed' },
      { key: 'smoking', label: 'Smoking Policy', placeholder: 'No smoking on premises' },
    ],
    template: `ARIZONA RESIDENTIAL LEASE AGREEMENT

Date: {{date}}

PARTIES:
Landlord: {{landlord}}
Tenant(s): {{tenant}}
Rental Property: {{property}}

LEASE TERM:
Start Date: {{startDate}}
End Date: {{endDate}}

RENT:
Monthly Rent: {{rent}}
Due Date: {{dueDay}} of each month
Late Fee: {{lateFee}} if payment received after {{graceDays}}-day grace period
Security Deposit: {{deposit}} (maximum 1.5 months per A.R.S. § 33-1321)

MAINTENANCE:
Tenant shall maintain the premises in a clean and sanitary condition. Tenant is responsible for repairs under {{minorRepair}} caused by Tenant negligence. Tenant shall promptly notify Landlord of any needed repairs.

LANDLORD ENTRY:
Landlord shall provide Tenant with at least two (2) days written notice prior to entry, except in cases of emergency. (A.R.S. § 33-1343)

PETS: {{pets}}

SMOKING: {{smoking}}

UTILITIES — Tenant responsible for all utilities unless otherwise agreed in writing.

TERMINATION:
For month-to-month tenancy: 30 days written notice required by either party.
Fixed-term early termination requires mutual written agreement.

GOVERNING LAW:
This Lease is governed by the Arizona Residential Landlord and Tenant Act, A.R.S. § 33-1301 et seq.

Landlord Signature: ______________________________ Date: ____________
Printed Name: {{landlord}}

Tenant Signature: ______________________________ Date: ____________
Printed Name: {{tenant}}`
  },
  {
    name: 'Home Inspection Agreement',
    cat: 'Inspection',
    desc: 'Agreement between client and licensed home inspector',
    fields: [
      { key: 'date', label: 'Inspection Date', placeholder: 'March 14, 2026' },
      { key: 'inspector', label: 'Inspector Name', placeholder: 'Inspector full name' },
      { key: 'license', label: 'Inspector License #', placeholder: 'AZ-12345' },
      { key: 'company', label: 'Inspection Company', placeholder: 'Company name' },
      { key: 'client', label: 'Client Name', placeholder: 'Client full name' },
      { key: 'property', label: 'Property Address', placeholder: '1234 E Main St, Phoenix, AZ 85001' },
      { key: 'fee', label: 'Inspection Fee', placeholder: '$395' },
      { key: 'reportHours', label: 'Report Delivery (hours)', placeholder: '24' },
      { key: 'claimDays', label: 'Claim Reporting Period (days)', placeholder: '14' },
    ],
    template: `HOME INSPECTION AGREEMENT

Date: {{date}}

INSPECTOR:
Name: {{inspector}}
License #: {{license}}
Company: {{company}}

CLIENT:
Name: {{client}}
Property to Inspect: {{property}}
Inspection Fee: {{fee}}

SCOPE OF INSPECTION:
Inspector will perform a visual inspection of readily accessible systems and components including:
- Structural components and foundation
- Roof covering and drainage systems
- Plumbing systems and fixtures
- Electrical systems and panels
- Heating and cooling (HVAC) systems
- Insulation and ventilation
- Interior rooms, walls, ceilings, and floors
- Exterior walls, grading, and garage

NOT INCLUDED IN THIS INSPECTION:
The following require specialized inspectors and are NOT included:
Septic systems, swimming pools/spas, mold, radon, termites, asbestos, underground storage tanks, inaccessible areas.

LIMITATIONS:
This is a visual inspection of accessible areas only. Inspector does not move furniture, excavate, or dismantle systems. This is not a code compliance inspection and does not constitute a warranty of any kind.

LIABILITY LIMITATION:
Inspector's total liability is limited to the fee paid for this inspection. Any claims must be reported in writing within {{claimDays}} days of the inspection date.

REPORT DELIVERY:
Written inspection report will be delivered to Client within {{reportHours}} hours of the inspection.

Inspector Signature: ______________________________ Date: ____________
Printed Name: {{inspector}}, License #{{license}}

Client Signature: ______________________________ Date: ____________
Printed Name: {{client}}`
  },
  {
    name: 'IRS 1031 Exchange Checklist',
    cat: 'IRS/Tax Forms',
    desc: 'Section 1031 like-kind exchange timeline and requirements',
    fields: [
      { key: 'taxpayer', label: 'Taxpayer Name', placeholder: 'Full legal name' },
      { key: 'taxId', label: 'Taxpayer EIN/SSN (last 4)', placeholder: 'XXXX' },
      { key: 'relinquished', label: 'Relinquished Property Address', placeholder: '1234 E Main St, Phoenix, AZ 85001' },
      { key: 'saleDate', label: 'Sale Closing Date', placeholder: 'March 14, 2026' },
      { key: 'salePrice', label: 'Sale Price', placeholder: '$600,000' },
      { key: 'gainAmt', label: 'Estimated Capital Gain', placeholder: '$150,000' },
      { key: 'qi', label: 'Qualified Intermediary (QI) Name', placeholder: 'QI Company name' },
      { key: 'qiPhone', label: 'QI Phone', placeholder: '(602) 555-0100' },
      { key: 'day45', label: '45-Day Identification Deadline', placeholder: 'April 28, 2026' },
      { key: 'day180', label: '180-Day Closing Deadline', placeholder: 'September 10, 2026' },
      { key: 'replacement', label: 'Identified Replacement Property', placeholder: '5678 W Oak St, Scottsdale, AZ 85255', multiline: true },
      { key: 'replacePrice', label: 'Replacement Property Target Price', placeholder: '$650,000' },
    ],
    template: `IRS SECTION 1031 LIKE-KIND EXCHANGE CHECKLIST

Taxpayer: {{taxpayer}} (EIN/SSN ending: {{taxId}})

RELINQUISHED PROPERTY:
Address: {{relinquished}}
Sale Closing Date: {{saleDate}}
Sale Price: {{salePrice}}
Estimated Capital Gain to Defer: {{gainAmt}}

QUALIFIED INTERMEDIARY (QI):
Name: {{qi}}
Phone: {{qiPhone}}
IMPORTANT: Taxpayer CANNOT receive sale proceeds. QI must hold all funds.

CRITICAL DEADLINES:
Day 0:   {{saleDate}} — Sale closes, QI holds proceeds
Day 45:  {{day45}} — DEADLINE: Identify replacement property in writing to QI
Day 180: {{day180}} — DEADLINE: Close on replacement property

IDENTIFICATION RULE (select one):
[ ] 3-Property Rule: Identify up to 3 properties (any FMV)
[ ] 200% Rule: Any number of properties, total FMV ≤ 200% of relinquished
[ ] 95% Rule: Any number of properties, must acquire 95% of identified FMV

IDENTIFIED REPLACEMENT PROPERTY:
{{replacement}}

Target Purchase Price: {{replacePrice}}
(Must be equal to or greater than {{salePrice}} to fully defer gain)

REQUIREMENTS CHECKLIST:
[ ] QI agreement executed BEFORE sale closes
[ ] Proceeds wired directly to QI at closing
[ ] Replacement property identified in writing by {{day45}}
[ ] Replacement property is like-kind (real property for real property)
[ ] Replacement property held for investment or business use
[ ] Closing completed by {{day180}}
[ ] Form 8824 filed with tax return for year of exchange

DISCLAIMER: Consult a qualified 1031 exchange attorney and CPA.
This checklist is for informational purposes only.

Prepared for: {{taxpayer}}
Date: _______________`
  },
];

export default function AgreementEditor() {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'select' | 'edit' | 'preview'>('select');
  const [search, setSearch] = useState('');
  const [shareMenu, setShareMenu] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const getDocText = () => {
    if (!selectedAgreement) return '';
    let text = selectedAgreement.template;
    selectedAgreement.fields.forEach(f => {
      const val = fieldValues[f.key] || `[${f.label}]`;
      text = text.split(`{{${f.key}}}`).join(val);
    });
    return text;
  };

  const handleSelect = (ag: Agreement) => {
    setSelectedAgreement(ag);
    setFieldValues({});
    setMode('edit');
  };

  const handlePrint = () => {
    const text = getDocText();
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>${selectedAgreement?.name}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; background: #fff; margin: 1in; line-height: 1.6; }
        pre { white-space: pre-wrap; font-family: inherit; font-size: 12pt; }
        @media print { body { margin: 0.75in; } }
      </style></head>
      <body><pre>${text}</pre></body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleSavePDF = () => {
    const text = getDocText();
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>${selectedAgreement?.name}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; background: #fff; margin: 1in; line-height: 1.6; }
        pre { white-space: pre-wrap; font-family: inherit; font-size: 12pt; }
        @media print { body { margin: 0.75in; } }
      </style></head>
      <body><pre>${text}</pre>
      <script>window.onload = () => { window.print(); }<\/script>
      </body></html>
    `);
    win.document.close();
  };

  const handleSaveWord = () => {
    const text = getDocText();
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${selectedAgreement?.name}</title>
      <style>body{font-family:"Times New Roman",serif;font-size:12pt;color:#000;line-height:1.6;}pre{white-space:pre-wrap;font-family:inherit;}</style>
      </head><body><pre>${text}</pre></body></html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAgreement?.name.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveTxt = () => {
    const text = getDocText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAgreement?.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = (method: string) => {
    const text = getDocText();
    const title = selectedAgreement?.name || 'Agreement';
    const encoded = encodeURIComponent(`${title}\n\n${text}`);
    const urls: Record<string, string> = {
      sms: `sms:?body=${encoded}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encoded}`,
      whatsapp: `https://wa.me/?text=${encoded}`,
      telegram: `https://t.me/share/url?url=&text=${encoded}`,
    };
    if (urls[method]) window.open(urls[method], '_blank');
    setShareMenu(false);
  };

  const filtered = agreements.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.cat.toLowerCase().includes(search.toLowerCase())
  );

  const inp: React.CSSProperties = { background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#f0f6fc', padding: '10px 12px', fontSize: '14px', width: '100%', boxSizing: 'border-box' as const };
  const btn = (color: string): React.CSSProperties => ({ padding: '8px 16px', background: color, color: '#0d1117', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' });

  if (mode === 'select') {
    return (
      <div style={{ padding: '24px', maxWidth: '1100px' }}>
        <h1 style={{ color: '#f0f6fc', fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>📋 Agreement Templates</h1>
        <p style={{ color: '#8b949e', fontSize: '14px', marginBottom: '20px' }}>Select a template, fill in the blanks, preview, print, share, or save</p>
        <input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(ag => (
            <button key={ag.name} onClick={() => handleSelect(ag)} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#f0a500')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#30363d')}>
              <div style={{ background: 'rgba(188,140,255,0.15)', color: '#bc8cff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, display: 'inline-block', marginBottom: '10px' }}>{ag.cat}</div>
              <div style={{ color: '#f0f6fc', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{ag.name}</div>
              <div style={{ color: '#8b949e', fontSize: '13px', lineHeight: '1.5' }}>{ag.desc}</div>
              <div style={{ marginTop: '12px', color: '#f0a500', fontSize: '12px', fontWeight: 600 }}>✏️ Fill & Edit →</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'edit' && selectedAgreement) {
    return (
      <div style={{ padding: '24px', maxWidth: '1100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => setMode('select')} style={{ ...btn('#21262d'), color: '#8b949e' }}>← Back</button>
          <div>
            <h1 style={{ color: '#f0f6fc', fontSize: '20px', fontWeight: 700, margin: 0 }}>{selectedAgreement.name}</h1>
            <p style={{ color: '#8b949e', fontSize: '13px', margin: 0 }}>Fill in all fields below, then preview your document</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {selectedAgreement.fields.map(f => (
            <div key={f.key} style={f.multiline ? { gridColumn: '1 / -1' } : {}}>
              <label style={{ color: '#8b949e', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{f.label}</label>
              {f.multiline
                ? <textarea value={fieldValues[f.key] || ''} onChange={e => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}
                    placeholder={f.placeholder} rows={3}
                    style={{ ...inp, resize: 'vertical' }} />
                : <input value={fieldValues[f.key] || ''} onChange={e => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}
                    placeholder={f.placeholder} style={inp} />
              }
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setMode('preview')} style={btn('#f0a500')}>👁️ Preview Document</button>
          <button onClick={() => { setMode('preview'); setTimeout(handlePrint, 300); }} style={btn('#3fb950')}>🖨️ Preview & Print</button>
        </div>
      </div>
    );
  }

  if (mode === 'preview' && selectedAgreement) {
    const docText = getDocText();
    return (
      <div style={{ padding: '24px', maxWidth: '1100px' }}>
        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setMode('edit')} style={{ ...btn('#21262d'), color: '#8b949e' }}>← Edit</button>
          <button onClick={() => setMode('select')} style={{ ...btn('#21262d'), color: '#8b949e' }}>📄 Templates</button>
          <div style={{ flex: 1 }} />
          <button onClick={handlePrint} style={btn('#3fb950')}>🖨️ Print</button>
          <button onClick={handleSavePDF} style={btn('#58a6ff')}>📄 Save PDF</button>
          <button onClick={handleSaveWord} style={btn('#bc8cff')}>📝 Save Word (.doc)</button>
          <button onClick={handleSaveTxt} style={btn('#e3b341')}>💾 Save as .txt</button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShareMenu(!shareMenu)} style={btn('#f0a500')}>📤 Share ▾</button>
            {shareMenu && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: '#161b22', border: '1px solid #30363d', borderRadius: '10px', overflow: 'hidden', zIndex: 100, minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                {[
                  { id: 'email', label: '📧 Email', color: '#58a6ff' },
                  { id: 'sms', label: '💬 SMS / Text', color: '#3fb950' },
                  { id: 'whatsapp', label: '🟢 WhatsApp', color: '#25d366' },
                  { id: 'telegram', label: '✈️ Telegram', color: '#2aabee' },
                ].map(s => (
                  <button key={s.id} onClick={() => handleShare(s.id)}
                    style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: s.color, fontSize: '14px', textAlign: 'left', display: 'block' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* White Document Preview */}
        <div ref={printRef} style={{
          background: '#ffffff', color: '#000000', borderRadius: '8px',
          padding: '72px 80px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt',
          lineHeight: '1.7', minHeight: '11in', maxWidth: '8.5in', margin: '0 auto'
        }}>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit', color: '#000000', margin: 0, lineHeight: '1.7' }}>
            {docText}
          </pre>
        </div>

        {/* Bottom action bar */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px', justifyContent: 'center' }}>
          <button onClick={handlePrint} style={btn('#3fb950')}>🖨️ Print Document</button>
          <button onClick={handleSavePDF} style={btn('#58a6ff')}>📄 Save as PDF</button>
          <button onClick={handleSaveWord} style={btn('#bc8cff')}>📝 Save as Word (.doc)</button>
          <button onClick={handleSaveTxt} style={btn('#e3b341')}>💾 Save as Text</button>
        </div>
      </div>
    );
  }

  return null;
}