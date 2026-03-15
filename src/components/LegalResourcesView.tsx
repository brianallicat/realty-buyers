import { useState } from 'react';
export type LegalSection = 'definitions'|'state_federal_laws'|'irs'|'forms'|'agreements';
const definitions = [
  { term: 'Abstract of Title', cat: 'Title', def: 'A condensed history of title to a parcel of real estate, summarizing all conveyances and encumbrances.', ex: 'Before closing, the buyer reviewed the abstract of title to confirm no undisclosed liens existed on the Scottsdale property.' },
  { term: 'Acceleration Clause', cat: 'Finance', def: 'A provision allowing the lender to demand immediate full repayment if the borrower defaults or sells the property.', ex: 'When the borrower missed three payments, the lender invoked the acceleration clause, making the entire $280,000 balance due immediately.' },
  { term: 'Ad Valorem Tax', cat: 'Tax', def: 'A tax levied according to assessed value. In Arizona, property taxes are assessed ad valorem by the county assessor.', ex: 'The Maricopa County ad valorem tax on a $450,000 home at 1.2% is $5,400 per year.' },
  { term: 'Amortization', cat: 'Finance', def: 'Gradual repayment of a mortgage through scheduled payments of principal and interest over the loan term.', ex: 'A $360,000 loan at 6.875% amortized over 30 years results in monthly P&I of $2,365.' },
  { term: 'APR (Annual Percentage Rate)', cat: 'Finance', def: 'The true yearly cost of a loan including interest, fees, and mortgage insurance. Required by the Truth in Lending Act (TILA).', ex: 'A loan with a 6.875% interest rate may have a 7.025% APR when origination fees are included.' },
  { term: 'Appraisal', cat: 'Valuation', def: 'A professional estimate of market value by a licensed appraiser, based on comparable sales, condition, and location.', ex: 'The lender required an appraisal before approving the $500,000 mortgage on the Paradise Valley estate.' },
  { term: 'Assessed Value', cat: 'Tax', def: 'Value placed on property by the county assessor for tax purposes. In Arizona, typically a percentage of full cash value.', ex: 'The Maricopa County Assessor set the assessed value at $245,000 for a home with $310,000 market value.' },
  { term: 'Chain of Title', cat: 'Title', def: 'The sequence of historical ownership transfers from the original grant to the current owner.', ex: 'The title search revealed an unbroken chain of title going back to the 1940s for the Chandler parcel.' },
  { term: 'Clear Title', cat: 'Title', def: 'Title to real property free from liens, encumbrances, or legal questions about ownership.', ex: 'The seller provided clear title at closing with all liens satisfied and no disputes.' },
  { term: 'Closing Costs', cat: 'Finance', def: 'Expenses incurred by buyers and sellers in transferring ownership, including title insurance, appraisal, and loan origination fees.', ex: 'The buyer paid $12,500 in closing costs — approximately 2.5% of the $500,000 purchase price.' },
  { term: 'Cloud on Title', cat: 'Title', def: 'Any claim, lien, or encumbrance that impairs or questions the owner\'s clear title.', ex: 'An old mechanic\'s lien from 2018 created a cloud on title that had to be cleared before closing.' },
  { term: 'Deed', cat: 'Title', def: 'A written document conveying title to real property. Must be signed, notarized, and recorded with the county recorder.', ex: 'After the wire transfer cleared, the warranty deed was recorded with the Maricopa County Recorder.' },
  { term: 'Default', cat: 'Finance', def: 'Failure to fulfill a legal obligation, such as missing mortgage payments or violating loan covenants.', ex: 'After missing three consecutive payments, the borrower received a Notice of Default from the lender.' },
  { term: 'Depreciation', cat: 'Tax', def: 'A tax deduction allowing recovery of rental property cost over 27.5 years (residential) or 39 years (commercial).', ex: 'The investor claimed $12,727 in annual depreciation on a $350,000 rental property (land excluded).' },
  { term: 'Due Diligence', cat: 'Contract', def: 'Investigation and verification of property facts before purchase including inspections, title search, and financial review.', ex: 'During the 10-day due diligence period, the buyer completed home inspection, title search, and HOA document review.' },
  { term: 'Earnest Money Deposit', cat: 'Contract', def: 'A deposit demonstrating buyer\'s serious intent to purchase. Held in escrow and applied to purchase price at closing.', ex: 'The buyer submitted a $15,000 earnest money deposit within 24 hours of the accepted offer.' },
  { term: 'Easement', cat: 'Title', def: 'A legal right to use another\'s land for a specific purpose such as utility lines, drainage, or access.', ex: 'A utility easement ran along the back 10 feet of the property, restricting fence placement.' },
  { term: 'Equity', cat: 'Finance', def: 'The difference between a property\'s current market value and the outstanding balance of all liens.', ex: 'With $450,000 value and $280,000 mortgage balance, the homeowner had $170,000 in equity.' },
  { term: 'Escrow', cat: 'Contract', def: 'A neutral third-party arrangement holding funds and documents until all transaction conditions are met.', ex: 'All funds and documents were held in escrow at Chicago Title until the buyer\'s loan was approved.' },
  { term: 'Fee Simple', cat: 'Title', def: 'The most complete form of property ownership, giving absolute rights to use, sell, or transfer.', ex: 'The buyer purchased the Phoenix home in fee simple with no restrictions on ownership transfer.' },
  { term: 'FSBO', cat: 'Listing', def: 'For Sale By Owner — property listed directly by the owner without a real estate agent.', ex: 'The Peoria homeowner listed FSBO at $385,000 to save the 3% listing commission.' },
  { term: 'HOA (Homeowners Association)', cat: 'Property', def: 'An organization managing a community, enforcing CC&Rs, and collecting dues for common area maintenance.', ex: 'The Gainey Ranch HOA charged $450/month and could place a lien for unpaid dues.' },
  { term: 'Homestead Exemption', cat: 'Tax', def: 'Arizona law (A.R.S. § 33-1101) protecting primary residence from forced sale up to $400,000.', ex: 'The Arizona homestead exemption protected $400,000 of the owner\'s home equity from creditor claims.' },
  { term: 'Lien', cat: 'Title', def: 'A legal claim against property as security for a debt. Must be satisfied before clear title can transfer.', ex: 'The IRS filed a federal tax lien of $87,500 against the Scottsdale property for unpaid taxes.' },
  { term: 'Lis Pendens', cat: 'Legal', def: 'Latin for "suit pending." A recorded notice that a lawsuit affecting property title has been filed.', ex: 'A lis pendens was recorded when the neighbor sued over the disputed property boundary.' },
  { term: 'LTV (Loan-to-Value)', cat: 'Finance', def: 'The ratio of a mortgage loan to the appraised property value. LTV above 80% typically requires PMI.', ex: 'A $360,000 loan on a $450,000 property has 80% LTV — avoiding PMI requirements.' },
  { term: 'Mechanic\'s Lien', cat: 'Title', def: 'A lien filed by an unpaid contractor, subcontractor, or material supplier against the property where work was performed.', ex: 'Desert Sun Roofing filed a $28,500 mechanic\'s lien after the homeowner failed to pay for roof repairs.' },
  { term: 'NOD (Notice of Default)', cat: 'Foreclosure', def: 'Formal recorded notice that a borrower is in default, initiating Arizona\'s non-judicial foreclosure process.', ex: 'Bank of America recorded a Notice of Default after the borrower missed 90 days of payments.' },
  { term: 'NTS (Notice of Trustee\'s Sale)', cat: 'Foreclosure', def: 'A recorded notice scheduling property auction to satisfy a defaulted deed of trust.', ex: 'An NTS was recorded scheduling the Gilbert property auction for May 6, 2026.' },
  { term: 'PMI (Private Mortgage Insurance)', cat: 'Finance', def: 'Insurance required when down payment is less than 20%, protecting the lender against default.', ex: 'With a 10% down payment, the buyer paid $180/month in PMI until reaching 80% LTV.' },
  { term: 'RESPA', cat: 'Legal', def: 'Real Estate Settlement Procedures Act — requires disclosure of settlement costs and prohibits kickbacks.', ex: 'RESPA required the lender to provide a Loan Estimate within 3 business days of the application.' },
  { term: 'Short Sale', cat: 'Finance', def: 'A sale for less than the outstanding mortgage balance, requiring lender approval.', ex: 'The lender approved the short sale at $280,000, writing off the remaining $45,000 balance.' },
  { term: 'Title Insurance', cat: 'Title', def: 'Insurance protecting against losses from title defects, liens, or encumbrances not discovered before closing.', ex: 'The buyer purchased an owner\'s title policy for $1,200 to protect against undisclosed title defects.' },
  { term: 'Warranty Deed', cat: 'Title', def: 'A deed in which the grantor warrants clear title and will defend against any future claims.', ex: 'The seller conveyed via warranty deed, guaranteeing clear title back to its original grant.' },
  { term: '1031 Exchange', cat: 'Tax', def: 'IRS Section 1031 tax-deferred exchange — sell one investment property and buy another without immediate capital gains tax.', ex: 'The investor sold a $600,000 rental and used a 1031 exchange to defer $90,000 in capital gains by buying a $750,000 replacement.' },
];
const laws = [
  { title: 'Arizona Residential Landlord & Tenant Act', code: 'A.R.S. § 33-1301', level: 'State', cat: 'Landlord/Tenant', summary: 'Governs rights and responsibilities of landlords and tenants. Covers security deposits (max 1.5 months), habitability, 2-day entry notice, and termination procedures.', points: ['Security deposit max: 1.5 months rent','2 days written notice before landlord entry','5-day notice for nonpayment before eviction','Tenant can terminate for uninhabitable conditions after 10-day notice'], url: 'https://www.azleg.gov/arsDetail/?title=33' },
  { title: 'Arizona Homestead Exemption', code: 'A.R.S. § 33-1101', level: 'State', cat: 'Property Rights', summary: 'Protects primary residence from forced creditor sale up to $400,000 in equity. Does not apply to mortgage, tax, or mechanic\'s liens.', points: ['Protects up to $400,000 in home equity','Must be primary residence','No filing required — automatic','Does not protect against mortgage or tax liens'], url: 'https://www.azleg.gov/arsDetail/?title=33' },
  { title: 'Arizona Mechanic\'s Lien Law', code: 'A.R.S. § 33-981', level: 'State', cat: 'Liens', summary: 'Allows unpaid contractors and suppliers to file liens. Requires Preliminary 20-Day Notice to preserve rights.', points: ['Preliminary 20-Day Notice within 20 days of first work','Lien must be recorded within 120 days of completion','Action must be filed within 6 months of recording','Owner protected if proper lien waivers obtained'], url: 'https://www.azleg.gov/arsDetail/?title=33' },
  { title: 'Arizona Non-Judicial Foreclosure', code: 'A.R.S. § 33-801', level: 'State', cat: 'Foreclosure', summary: 'Arizona uses trustee\'s sale process. After NTS, 91-day wait before auction. No deficiency judgment on qualifying purchase-money mortgages.', points: ['91-day minimum notice before trustee\'s sale','No redemption period after sale','No deficiency on qualifying purchase-money mortgages','Sale by trustee, not sheriff'], url: 'https://www.azleg.gov/arsDetail/?title=33' },
  { title: 'Arizona Seller Disclosure', code: 'A.R.S. § 33-422', level: 'State', cat: 'Disclosure', summary: 'Sellers must complete SPDS disclosing known material defects. Five-day right to rescind after receipt.', points: ['SPDS required for most residential sales','Must disclose known material defects','Includes HOA, utilities, environmental issues','5-day right to rescind after SPDS receipt'], url: 'https://www.azleg.gov/arsDetail/?title=33' },
  { title: 'Arizona Property Tax Code', code: 'A.R.S. § 42-11001', level: 'State', cat: 'Tax', summary: 'Primary residences assessed at 10% of full cash value; rental/commercial at 18%. Two installment payments per year.', points: ['Primary residence: 10% of full cash value','Rental/commercial: 18% of full cash value','Due in two installments: October 1 and March 1','Senior freeze program available'], url: 'https://www.azleg.gov/arsDetail/?title=42' },
  { title: 'Fair Housing Act', code: '42 U.S.C. § 3601', level: 'Federal', cat: 'Civil Rights', summary: 'Prohibits housing discrimination based on race, color, national origin, religion, sex, familial status, or disability.', points: ['Covers sale, rental, financing, and advertising','Prohibits steering and blockbusting','HUD enforces within 1 year','Private lawsuits with compensatory and punitive damages'], url: 'https://www.hud.gov/program_offices/fair_housing_equal_opp' },
  { title: 'RESPA', code: '12 U.S.C. § 2601', level: 'Federal', cat: 'Finance', summary: 'Requires disclosure of settlement costs and prohibits kickbacks and referral fees in federally related mortgage loans.', points: ['Loan Estimate within 3 business days of application','Closing Disclosure 3 days before closing','Prohibits kickbacks (Section 8)','Prohibits required use of affiliate services'], url: 'https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/respa/' },
  { title: 'Truth in Lending Act (TILA)', code: '15 U.S.C. § 1601', level: 'Federal', cat: 'Finance', summary: 'Requires standardized loan cost disclosure including APR. 3-day right of rescission on primary residence refinances.', points: ['APR disclosure required on all loans','3-day right of rescission on refinances','Implemented by Regulation Z','Penalties for non-disclosure'], url: 'https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/' },
  { title: 'Dodd-Frank Ability to Repay Rule', code: '12 U.S.C. § 5301', level: 'Federal', cat: 'Finance', summary: 'Requires lenders to verify borrower ability to repay. Defines Qualified Mortgage (QM) safe harbor with consumer protections.', points: ['Income and asset verification required','QM loans limited to 3% points/fees','Prohibits negative amortization on QMs','Balloon payments restricted on QMs'], url: 'https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/ability-to-repay/' },
];
const irsItems = [
  { form: 'Section 1031', title: 'Like-Kind Exchange', desc: 'Defers capital gains when selling investment property and purchasing replacement property. Must use qualified intermediary and meet strict timelines.', rules: ['45 days to identify replacement property','180 days to close on replacement (both from relinquished closing)','Must use qualified intermediary — cannot receive proceeds','Properties must be held for investment or business use'], url: 'https://www.irs.gov/publications/p544' },
  { form: 'Form 4562', title: 'Depreciation & Amortization', desc: 'Claims depreciation on rental property. Residential: 27.5 years; Commercial: 39 years, straight-line method.', rules: ['Filed annually with tax return','Residential rental: 27.5-year straight-line','Commercial: 39-year straight-line','Bonus depreciation available for certain improvements'], url: 'https://www.irs.gov/forms-pubs/about-form-4562' },
  { form: 'Schedule E', title: 'Rental Income & Expenses', desc: 'Reports rental income and expenses. Passive loss rules limit deductions against active income for most landlords.', rules: ['Filed with Form 1040 annually','Passive activity loss rules apply','$25,000 allowance for active participants (phased out $100K-$150K AGI)','Carryforward unused passive losses'], url: 'https://www.irs.gov/forms-pubs/about-schedule-e-form-1040' },
  { form: 'Form 1099-S', title: 'Real Estate Proceeds', desc: 'Filed by closing agent reporting gross proceeds from real estate sales or exchanges.', rules: ['Required when proceeds exceed $250K ($500K joint primary residence)','Filed by February 15 following year','Copy to seller by February 15','Buyer may be required to file if no title company'], url: 'https://www.irs.gov/forms-pubs/about-form-1099-s' },
  { form: 'Section 121', title: 'Home Sale Exclusion', desc: 'Excludes up to $250,000 ($500,000 married) capital gains from primary home sale if ownership and use tests are met.', rules: ['Must own AND use as primary home 2 of last 5 years','Can use once every 2 years','Partial exclusion for unforeseen circumstances','Must report sale even if gain excluded'], url: 'https://www.irs.gov/taxtopics/tc701' },
  { form: 'Form 8949', title: 'Capital Asset Sales', desc: 'Reports sales of capital assets including real estate. Long-term gains (over 1 year) taxed at preferential rates.', rules: ['Short-term (under 1 year): taxed as ordinary income','Long-term: 0%, 15%, or 20% depending on income','Filed with Form 1040 in year of sale','Depreciation recapture taxed at up to 25%'], url: 'https://www.irs.gov/forms-pubs/about-form-8949' },
  { form: 'Form 6252', title: 'Installment Sale Income', desc: 'Used when seller finances part of sale price, spreading capital gains recognition over the payment period.', rules: ['Filed each year payments are received','Gross profit percentage calculated at time of sale','Interest income reported separately','Dealer installment sales have restrictions'], url: 'https://www.irs.gov/forms-pubs/about-form-6252' },
  { form: 'Form 4797', title: 'Business Property Sales', desc: 'Reports gains and losses from sale of business/investment real estate. Section 1250 depreciation recapture taxed up to 25%.', rules: ['Filed with Form 1040 in year of sale','Section 1250 recapture: up to 25% tax rate','Combines with Schedule D for overall gain/loss','Applies to property used in business or held for rental'], url: 'https://www.irs.gov/forms-pubs/about-form-4797' },
];
const agreements = [
  { name: 'NCND Agreement', cat: 'Wholesale/Investment', desc: 'Non-Circumvent, Non-Disclosure Agreement — prevents parties from bypassing each other and prohibits disclosure of confidential contact information.', terms: ['Non-circumvent period (2-5 years typical)','Scope of protected information and contacts','Geographic limitations','Liquidated damages/penalty clause'], template: `NON-CIRCUMVENT, NON-DISCLOSURE AGREEMENT

Date: _____________, 20___
Party A: _________________________________ ("First Party")
Party B: _________________________________ ("Second Party")

1. NON-DISCLOSURE
Each party agrees not to disclose confidential information including: buyer/seller names, contact information, transaction details, pricing, and proprietary business information.

2. NON-CIRCUMVENT
Each party agrees not to directly or indirectly contact or deal with any contacts introduced by the other party without express written permission. This restriction applies for _____ years from the date of last transaction.

3. PROTECTED CONTACTS
The following contacts are protected:
_______________________________________________

4. REMEDIES
In the event of breach, the non-breaching party shall be entitled to liquidated damages of $____________ per violation, plus attorney fees.

5. GOVERNING LAW: State of Arizona

Party A: ______________________ Date: __________
Party B: ______________________ Date: __________` },
  { name: 'Buyer Representation Agreement', cat: 'Agent Agreements', desc: 'Establishes agency relationship between buyer and real estate agent, defining duties, compensation, and exclusivity.', terms: ['Exclusive vs. non-exclusive representation','Commission/fee structure','Term and geographic area','Buyer obligations and agent duties'], template: `BUYER REPRESENTATION AGREEMENT

Date: _____________
Buyer: _________________________________
Agent: _________________________________
Brokerage: _____________________________

1. REPRESENTATION
Agent agrees to represent Buyer in purchase of real property in:
Area: _________________________ Price: $________ to $________

2. TERM: _____________ to _____________

3. COMPENSATION
Buyer agrees to pay ______% OR $____________ if Seller does not offer sufficient buyer agent compensation.

4. BUYER OBLIGATIONS
Buyer agrees to: (a) work exclusively with Agent; (b) notify Agent of all properties of interest; (c) not purchase without Agent.

5. AGENT OBLIGATIONS
Agent agrees to: (a) represent Buyer's best interests; (b) maintain confidentiality; (c) disclose all known material facts.

Buyer: _________________________ Date: __________
Agent: _________________________ Date: __________` },
  { name: 'Letter of Intent (LOI) to Purchase', cat: 'Purchase Agreements', desc: 'Non-binding letter expressing intent to purchase, outlining key terms before a formal purchase contract is drafted.', terms: ['Purchase price and earnest money','Due diligence period','Closing timeline','Contingencies (financing, inspection, title)','Non-binding nature statement'], template: `LETTER OF INTENT TO PURCHASE REAL PROPERTY
(NON-BINDING)

Date: _____________
To: _________________________________ (Seller)
From: _______________________________ (Buyer)
Property: ____________________________________

PROPOSED TERMS:

Purchase Price: $___________________________
Earnest Money: $____________________________ (due within ___ days of PSA)
Financing: [ ] Cash  [ ] Conventional  [ ] FHA  [ ] VA
Down Payment: _____%    Loan Amount: $_____________

Due Diligence Period: ___ days from executed PSA
Closing Date: On or before ___________________

Contingencies:
[ ] Financing Approval
[ ] Satisfactory Inspection
[ ] Clear Title
[ ] Appraisal at or above purchase price

This LOI is NON-BINDING on either party until a formal Purchase and Sale Agreement is fully executed by all parties.

Buyer: _________________________ Date: __________
Seller (Acknowledged): __________ Date: __________` },
  { name: 'Residential Purchase Contract (Summary)', cat: 'Purchase Agreements', desc: 'The binding contract for purchase and sale of real property. In Arizona, the AAR Residential Purchase Contract is the standard form.', terms: ['Purchase price and deposit amounts','AAR inspection period (default 10 days)','Loan contingency deadline','Closing date and escrow company','Personal property included/excluded'], template: `ARIZONA RESIDENTIAL PURCHASE CONTRACT (Key Terms Summary)
[Use complete AAR Form RPC for full Arizona-compliant agreement]

Property: _______________________________________
APN: ___________________________________________

PURCHASE PRICE: $______________________________
Earnest Money: $_________________ due: __________
Additional Deposit: $______________ due: __________

TIMELINE:
Inspection Period: ___ days (AAR default: 10 days)
Loan Approval Deadline: _________________________
Appraisal Deadline: _____________________________
Close of Escrow: ________________________________

FINANCING:
Loan Amount: $_________________ Type: __________
Down Payment: $________________ (___%)

INCLUDED ITEMS: ________________________________
SELLER CONCESSIONS: $________________________
ESCROW: _______________________________________
TITLE: _________________________________________

Note: This is a summary only. Full AAR Purchase Contract required for binding agreement.` },
  { name: 'Seller\'s Property Disclosure (SPDS)', cat: 'Disclosure Forms', desc: 'Required Arizona form where sellers disclose known material defects, HOA info, utilities, environmental issues, and property condition.', terms: ['Known material defects','HOA fees and assessments','Environmental hazards (lead, asbestos)','Insurance claims history','Permit history'], template: `SELLER'S PROPERTY DISCLOSURE STATEMENT (SPDS)

Property: _______________________________________
Seller: _________________________________________

OWNERSHIP
How long owned: _____ Is primary residence? [ ] Yes [ ] No

LEGAL
Pending lawsuits? [ ] Yes [ ] No
Zoning violations? [ ] Yes [ ] No
Easements/boundary disputes? [ ] Yes [ ] No

HOA
Subject to HOA? [ ] Yes [ ] No
HOA Name: ________________________ Fee: $______/mo
Pending special assessments? [ ] Yes [ ] No

PROPERTY CONDITION
Roof age: _______ HVAC age: _______ Water heater age: _______
Known leaks or water damage? [ ] Yes [ ] No
Foundation issues? [ ] Yes [ ] No
Pest/termite history? [ ] Yes [ ] No

ENVIRONMENTAL
Lead paint (pre-1978)? [ ] Yes [ ] No [ ] Unknown
Asbestos? [ ] Yes [ ] No [ ] Unknown

Seller certifies answers are true to best of knowledge.
Seller: _________________________ Date: __________` },
  { name: 'Arizona Residential Lease Agreement', cat: 'Rental Agreements', desc: 'Arizona lease governed by A.R.S. § 33-1301. Covers rent, security deposit (max 1.5 months), maintenance, and termination.', terms: ['Rent amount and due date','Security deposit (max 1.5 months per ARS)','Late fee provisions','2-day entry notice requirement','Termination procedures'], template: `ARIZONA RESIDENTIAL LEASE AGREEMENT

Landlord: ______________________________________
Tenant(s): _____________________________________
Property: ______________________________________
Term: _____________ to _____________
Monthly Rent: $_____________ Due: _______ of month
Late Fee: $_____________ after ___ day grace period
Security Deposit: $_____________ (max 1.5 months per A.R.S. § 33-1321)

UTILITIES — Tenant pays: [ ] Electric [ ] Gas [ ] Water [ ] Trash

MAINTENANCE: Tenant responsible for repairs under $_____ caused by Tenant negligence. Tenant shall promptly report all needed repairs.

ENTRY: Landlord provides 2 days written notice before entry except emergencies. (A.R.S. § 33-1343)

PETS: [ ] No pets [ ] Pets allowed, deposit: $_________ [ ] Refundable [ ] Non-refundable

TERMINATION: 30 days written notice required for month-to-month.
Early termination fee: $_____________

Landlord: ______________________ Date: __________
Tenant: ________________________ Date: __________` },
  { name: 'Home Inspection Agreement', cat: 'Inspection', desc: 'Agreement between buyer and licensed home inspector outlining scope, limitations, liability, and report delivery.', terms: ['Scope of inspection (included systems)','Excluded areas and systems','Inspector liability limitation','Report delivery timeline','Fee and payment terms'], template: `HOME INSPECTION AGREEMENT

Inspector: _________________________ License #: ________
Client: ____________________________________________
Property: __________________________________________
Date: _________________ Fee: $_____________________

SCOPE — Visual inspection of accessible systems:
[ ] Structure/Foundation  [ ] Roof  [ ] Plumbing  [ ] Electrical
[ ] HVAC  [ ] Insulation  [ ] Interior  [ ] Exterior  [ ] Garage

NOT INCLUDED (requires specialist):
[ ] Septic  [ ] Pool/Spa  [ ] Mold  [ ] Radon  [ ] Termite
[ ] Asbestos  [ ] Underground utilities  [ ] Inaccessible areas

LIMITATIONS: Visual inspection of accessible areas only. Not a code compliance inspection. Inspector does not move furniture or dismantle systems.

LIABILITY: Inspector liability limited to fee paid. Claims must be reported within ___ days of inspection.

REPORT: Delivered within ___ hours of inspection.

Inspector: _____________________ Date: __________
Client: ________________________ Date: __________` },
  { name: 'IRS Form 1031 Exchange Checklist', cat: 'IRS/Tax Forms', desc: 'Key requirements and timeline for completing a valid Section 1031 like-kind exchange to defer capital gains taxes.', terms: ['Qualified intermediary required','45-day identification rule','180-day closing rule','Like-kind property requirement','Equal or greater value rule'], template: `IRS SECTION 1031 LIKE-KIND EXCHANGE CHECKLIST

Taxpayer: _______________________________________
Relinquished Property: ___________________________
Sale Closing Date: ________________________________

CRITICAL DEADLINES:
Day 0:   Sale of relinquished property closes
         QI holds proceeds (taxpayer CANNOT receive funds)
Day 45:  DEADLINE — Identify replacement property in writing
Day 180: DEADLINE — Close on replacement property

IDENTIFICATION REQUIREMENTS (choose one rule):
[ ] 3-Property Rule: Identify up to 3 properties (any value)
[ ] 200% Rule: Identify any properties, total FMV ≤ 200% of relinquished
[ ] 95% Rule: Identify any properties, acquire 95% of identified value

QUALIFIED INTERMEDIARY:
Name: _______________________________
Phone: ______________________________

REPLACEMENT PROPERTY:
Address: ________________________________
Purchase Price: $_________________________ (must be equal or greater)
Mortgage: $______________________________ (must be equal or greater)
Equity: $________________________________

IMPORTANT: Consult a CPA and 1031 exchange attorney. Strict rules apply.` },
  { name: 'Title Insurance Commitment Summary', cat: 'Title', desc: 'Preliminary report issued by title company committing to issue title insurance upon satisfaction of requirements.', terms: ['Schedule A — property, parties, coverage amounts','Schedule B-I — requirements to clear','Schedule B-II — exceptions from coverage','Owner\'s vs. lender\'s policy','Premium amounts'], template: `TITLE INSURANCE COMMITMENT (Summary)
[Full commitment issued by licensed Arizona title company]

File No.: _______________________________
Property: _______________________________
APN: ___________________________________

SCHEDULE A:
Owner's Policy Amount: $________________
Lender's Policy Amount: $________________
Proposed Owner Insured: _________________
Proposed Lender Insured: ________________

SCHEDULE B-I — REQUIREMENTS (must be satisfied):
1. Payment of purchase price and recording of deed
2. Payoff and release of existing mortgage(s): $_____________
3. Satisfaction of outstanding liens: _____________________
4. Execution and delivery of deed from: __________________

SCHEDULE B-II — EXCEPTIONS (not covered):
1. Current year property taxes
2. CC&Rs and easements of record
3. Rights of parties in possession
4. Any survey matters

Owner's Premium: $__________
Lender's Premium: $__________

Review full commitment carefully with your real estate attorney.` },
];

const catColors: Record<string,string> = { Title:'#58a6ff',Finance:'#3fb950',Tax:'#f0a500',Contract:'#bc8cff',Valuation:'#79c0ff','Landlord/Tenant':'#56d364',Listing:'#e3b341',Property:'#d2a8ff',Foreclosure:'#ff7b72',Legal:'#ff9e64' };

export default function LegalResourcesView({ section }: { section: LegalSection }) {
  const [search, setSearch] = useState('');
  const [selCat, setSelCat] = useState('All');
  const [expanded, setExpanded] = useState<string|null>(null);
  const [copied, setCopied] = useState<string|null>(null);
  const toggle = (id: string) => setExpanded(expanded === id ? null : id);
  const copy = (name: string, text: string) => { navigator.clipboard.writeText(text); setCopied(name); setTimeout(()=>setCopied(null),2000); };
  const inp: React.CSSProperties = { background:'#161b22', border:'1px solid #30363d', borderRadius:'8px', color:'#f0f6fc', padding:'10px 14px', fontSize:'14px', boxSizing:'border-box' };
  const card: React.CSSProperties = { background:'#161b22', border:'1px solid #21262d', borderRadius:'10px', overflow:'hidden', marginBottom:'8px' };
  const hdr: React.CSSProperties = { width:'100%', padding:'14px 16px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px', textAlign:'left' };

  if (section === 'definitions') {
    const cats = ['All',...Array.from(new Set(definitions.map(d=>d.cat)))];
    const list = definitions.filter(d=>(selCat==='All'||d.cat===selCat)&&(d.term.toLowerCase().includes(search.toLowerCase())||d.def.toLowerCase().includes(search.toLowerCase())));
    return (
      <div style={{ padding:'24px', maxWidth:'1100px' }}>
        <h1 style={{ color:'#f0f6fc', fontSize:'22px', fontWeight:700, marginBottom:'4px' }}>📖 Real Estate & Finance Dictionary</h1>
        <p style={{ color:'#8b949e', fontSize:'14px', marginBottom:'20px' }}>Black Law Dictionary definitions with Arizona context and real-world examples</p>
        <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input placeholder="Search terms..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp, flex:1, minWidth:'200px'}} />
          <select value={selCat} onChange={e=>setSelCat(e.target.value)} style={{...inp, width:'auto'}}>{cats.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div style={{ color:'#8b949e', fontSize:'12px', marginBottom:'12px' }}>{list.length} terms</div>
        {list.map(d=>(
          <div key={d.term} style={card}>
            <button onClick={()=>toggle(d.term)} style={hdr}>
              <span style={{ background:(catColors[d.cat]||'#8b949e')+'20', color:catColors[d.cat]||'#8b949e', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:600, flexShrink:0 }}>{d.cat}</span>
              <span style={{ color:'#f0f6fc', fontSize:'15px', fontWeight:600, flex:1 }}>{d.term}</span>
              <span style={{ color:'#8b949e' }}>{expanded===d.term?'▲':'▼'}</span>
            </button>
            {expanded===d.term&&<div style={{ padding:'0 16px 16px', borderTop:'1px solid #21262d' }}>
              <p style={{ color:'#c9d1d9', fontSize:'14px', lineHeight:'1.7', marginTop:'12px' }}>{d.def}</p>
              <div style={{ background:'#0d1117', border:'1px solid #21262d', borderRadius:'8px', padding:'12px', marginTop:'10px' }}>
                <div style={{ color:'#f0a500', fontSize:'11px', fontWeight:600, marginBottom:'6px' }}>ARIZONA EXAMPLE</div>
                <p style={{ color:'#8b949e', fontSize:'13px', lineHeight:'1.6', margin:0 }}>{d.ex}</p>
              </div>
            </div>}
          </div>
        ))}
      </div>
    );
  }

  if (section === 'state_federal_laws') {
    const cats = ['All',...Array.from(new Set(laws.map(l=>l.cat)))];
    const list = laws.filter(l=>(selCat==='All'||l.cat===selCat)&&(l.title.toLowerCase().includes(search.toLowerCase())||l.summary.toLowerCase().includes(search.toLowerCase())));
    return (
      <div style={{ padding:'24px', maxWidth:'1100px' }}>
        <h1 style={{ color:'#f0f6fc', fontSize:'22px', fontWeight:700, marginBottom:'4px' }}>⚖️ State & Federal Real Estate Laws</h1>
        <p style={{ color:'#8b949e', fontSize:'14px', marginBottom:'20px' }}>Arizona statutes and federal laws governing real estate transactions, landlord/tenant rights, and property ownership</p>
        <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input placeholder="Search laws..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp, flex:1}} />
          <select value={selCat} onChange={e=>setSelCat(e.target.value)} style={{...inp, width:'auto'}}>{cats.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        {list.map(l=>(
          <div key={l.title} style={card}>
            <button onClick={()=>toggle(l.title)} style={hdr}>
              <span style={{ background:l.level==='Federal'?'rgba(88,166,255,0.15)':'rgba(63,185,80,0.15)', color:l.level==='Federal'?'#58a6ff':'#3fb950', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:600, flexShrink:0 }}>{l.level}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:'#f0f6fc', fontSize:'15px', fontWeight:600 }}>{l.title}</div>
                <div style={{ color:'#f0a500', fontSize:'12px', marginTop:'2px' }}>{l.code}</div>
              </div>
              <span style={{ color:'#8b949e', fontSize:'11px', background:'#0d1117', padding:'2px 6px', borderRadius:'4px' }}>{l.cat}</span>
              <span style={{ color:'#8b949e' }}>{expanded===l.title?'▲':'▼'}</span>
            </button>
            {expanded===l.title&&<div style={{ padding:'0 16px 16px', borderTop:'1px solid #21262d' }}>
              <p style={{ color:'#c9d1d9', fontSize:'14px', lineHeight:'1.7', marginTop:'12px' }}>{l.summary}</p>
              <div style={{ background:'#0d1117', border:'1px solid #21262d', borderRadius:'8px', padding:'12px', marginTop:'10px' }}>
                <div style={{ color:'#58a6ff', fontSize:'11px', fontWeight:600, marginBottom:'8px' }}>KEY PROVISIONS</div>
                {l.points.map((p,i)=><div key={i} style={{ display:'flex', gap:'8px', marginBottom:'6px' }}><span style={{ color:'#3fb950', flexShrink:0 }}>•</span><span style={{ color:'#8b949e', fontSize:'13px' }}>{p}</span></div>)}
              </div>
              <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'12px', color:'#58a6ff', fontSize:'13px', textDecoration:'none' }}>🔗 View Official Text</a>
            </div>}
          </div>
        ))}
      </div>
    );
  }

  if (section === 'irs') {
    const list = irsItems.filter(i=>i.form.toLowerCase().includes(search.toLowerCase())||i.title.toLowerCase().includes(search.toLowerCase())||i.desc.toLowerCase().includes(search.toLowerCase()));
    return (
      <div style={{ padding:'24px', maxWidth:'1100px' }}>
        <h1 style={{ color:'#f0f6fc', fontSize:'22px', fontWeight:700, marginBottom:'4px' }}>🏛️ IRS Forms & Tax Rules for Real Estate</h1>
        <p style={{ color:'#8b949e', fontSize:'14px', marginBottom:'12px' }}>Federal tax forms, rules, and publications for real estate transactions, depreciation, and capital gains</p>
        <div style={{ background:'rgba(255,123,114,0.08)', border:'1px solid rgba(255,123,114,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px' }}>
          <span style={{ color:'#ff7b72', fontSize:'12px', fontWeight:600 }}>⚠️ DISCLAIMER: </span>
          <span style={{ color:'#8b949e', fontSize:'12px' }}>Informational only. Consult a licensed CPA or tax attorney for advice specific to your situation.</span>
        </div>
        <input placeholder="Search IRS forms..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp, width:'100%', marginBottom:'16px'}} />
        {list.map(item=>(
          <div key={item.form} style={card}>
            <button onClick={()=>toggle(item.form)} style={hdr}>
              <span style={{ background:'rgba(240,165,0,0.15)', color:'#f0a500', padding:'4px 10px', borderRadius:'6px', fontSize:'12px', fontWeight:700, flexShrink:0 }}>{item.form}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:'#f0f6fc', fontSize:'15px', fontWeight:600 }}>{item.title}</div>
              </div>
              <span style={{ color:'#8b949e' }}>{expanded===item.form?'▲':'▼'}</span>
            </button>
            {expanded===item.form&&<div style={{ padding:'0 16px 16px', borderTop:'1px solid #21262d' }}>
              <p style={{ color:'#c9d1d9', fontSize:'14px', lineHeight:'1.7', marginTop:'12px' }}>{item.desc}</p>
              <div style={{ background:'#0d1117', border:'1px solid #21262d', borderRadius:'8px', padding:'12px', marginTop:'10px' }}>
                <div style={{ color:'#f0a500', fontSize:'11px', fontWeight:600, marginBottom:'8px' }}>KEY RULES & DEADLINES</div>
                {item.rules.map((r,i)=><div key={i} style={{ display:'flex', gap:'8px', marginBottom:'6px' }}><span style={{ color:'#f0a500', flexShrink:0 }}>•</span><span style={{ color:'#8b949e', fontSize:'13px' }}>{r}</span></div>)}
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'12px', color:'#58a6ff', fontSize:'13px', textDecoration:'none' }}>🔗 View on IRS.gov</a>
            </div>}
          </div>
        ))}
      </div>
    );
  }

  if (section === 'agreements') {
    const cats = ['All',...Array.from(new Set(agreements.map(a=>a.cat)))];
    const list = agreements.filter(a=>(selCat==='All'||a.cat===selCat)&&(a.name.toLowerCase().includes(search.toLowerCase())||a.desc.toLowerCase().includes(search.toLowerCase())));
    return (
      <div style={{ padding:'24px', maxWidth:'1100px' }}>
        <h1 style={{ color:'#f0f6fc', fontSize:'22px', fontWeight:700, marginBottom:'4px' }}>📋 Real Estate Agreement Templates</h1>
        <p style={{ color:'#8b949e', fontSize:'14px', marginBottom:'12px' }}>NCND, buyer representation, LOI, purchase contracts, leases, inspection agreements — copy and customize</p>
        <div style={{ background:'rgba(255,123,114,0.08)', border:'1px solid rgba(255,123,114,0.3)', borderRadius:'10px', padding:'10px 14px', marginBottom:'16px' }}>
          <span style={{ color:'#ff7b72', fontSize:'12px', fontWeight:600 }}>⚠️ DISCLAIMER: </span>
          <span style={{ color:'#8b949e', fontSize:'12px' }}>Templates only. Consult a licensed Arizona real estate attorney before using in actual transactions.</span>
        </div>
        <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' }}>
          <input placeholder="Search agreements..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp, flex:1}} />
          <select value={selCat} onChange={e=>setSelCat(e.target.value)} style={{...inp, width:'auto'}}>{cats.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        {list.map(a=>(
          <div key={a.name} style={card}>
            <button onClick={()=>toggle(a.name)} style={hdr}>
              <span style={{ background:'rgba(188,140,255,0.15)', color:'#bc8cff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:600, flexShrink:0 }}>{a.cat}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:'#f0f6fc', fontSize:'15px', fontWeight:600 }}>{a.name}</div>
                <div style={{ color:'#8b949e', fontSize:'12px', marginTop:'2px' }}>{a.desc.substring(0,80)}...</div>
              </div>
              <span style={{ color:'#8b949e' }}>{expanded===a.name?'▲':'▼'}</span>
            </button>
            {expanded===a.name&&<div style={{ padding:'0 16px 16px', borderTop:'1px solid #21262d' }}>
              <p style={{ color:'#c9d1d9', fontSize:'14px', lineHeight:'1.7', marginTop:'12px' }}>{a.desc}</p>
              <div style={{ background:'#0d1117', border:'1px solid #21262d', borderRadius:'8px', padding:'12px', marginTop:'10px', marginBottom:'12px' }}>
                <div style={{ color:'#bc8cff', fontSize:'11px', fontWeight:600, marginBottom:'8px' }}>KEY TERMS TO NEGOTIATE</div>
                {a.terms.map((t,i)=><div key={i} style={{ display:'flex', gap:'8px', marginBottom:'6px' }}><span style={{ color:'#bc8cff', flexShrink:0 }}>•</span><span style={{ color:'#8b949e', fontSize:'13px' }}>{t}</span></div>)}
              </div>
              <div style={{ background:'#0d1117', border:'1px solid #30363d', borderRadius:'8px', padding:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                  <span style={{ color:'#f0f6fc', fontSize:'13px', fontWeight:600 }}>📄 Template</span>
                  <button onClick={()=>copy(a.name,a.template)} style={{ padding:'6px 14px', background:copied===a.name?'#3fb950':'#f0a500', color:'#0d1117', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:700 }}>{copied===a.name?'✓ Copied!':'📋 Copy Template'}</button>
                </div>
                <pre style={{ color:'#8b949e', fontSize:'12px', lineHeight:'1.6', whiteSpace:'pre-wrap', margin:0, fontFamily:'monospace' }}>{a.template}</pre>
              </div>
            </div>}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
