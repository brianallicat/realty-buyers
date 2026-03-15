// Maricopa County Real Estate - Complete Data

export interface MaricopaProperty {
  address: string; city: string; zip: string; county: string;
  lat?: number; lng?: number; estimatedValue?: number; propertyType?: string; type?: string; marketValue?: number; price?: number;
}
export type ForeclosureStatus = 'pre_foreclosure'|'notice_of_default'|'auction_scheduled'|'bank_owned'|'dismissed'|'reinstated';
export interface ForeclosureRecord {
  id: string; caseNumber: string; property: MaricopaProperty;
  filingDate: string; status: ForeclosureStatus; amountOwed: number;
  lender: string; auctionDate: string|null; courtRecordUrl: string; borrower: string;
}
export interface ForeclosureTrend { month: string; count: number; dismissed: number; bankOwned: number; }
export const foreclosureRecords: ForeclosureRecord[] = [
  { id: "FC-001", caseNumber: "2026-0111781", property: { address: "10341 W Prairie Hills Cir", city: "Sun City", zip: "85351", county: "Maricopa", lat: 33.6600, lng: -112.2800, estimatedValue: 285000 }, filingDate: "2026-03-01", status: "auction_scheduled", amountOwed: 265000, lender: "TruWest Credit Union", auctionDate: "2026-06-02", courtRecordUrl: "https://recorder.maricopa.gov", borrower: "Mincolla, C." },
  { id: "FC-002", caseNumber: "2026-0063401", property: { address: "3862 E Ironhorse Ct", city: "Gilbert", zip: "85297", county: "Maricopa", lat: 33.2900, lng: -111.7400, estimatedValue: 520000 }, filingDate: "2026-02-01", status: "auction_scheduled", amountOwed: 498000, lender: "TruWest Credit Union", auctionDate: "2026-05-06", courtRecordUrl: "https://recorder.maricopa.gov", borrower: "Bakemeier, W." },
  { id: "FC-003", caseNumber: "2026-0153026", property: { address: "7945 W Chickasaw St", city: "Phoenix", zip: "85043", county: "Maricopa", lat: 33.3800, lng: -112.2100, estimatedValue: 245000 }, filingDate: "2026-03-20", status: "notice_of_default", amountOwed: 220600, lender: "Shellpoint Mortgage Servicing", auctionDate: "2026-06-26", courtRecordUrl: "https://recorder.maricopa.gov", borrower: "Owner of Record" },
  { id: "FC-004", caseNumber: "2026-0153234", property: { address: "4840 E Mineral Rd #4", city: "Phoenix", zip: "85044", county: "Maricopa", lat: 33.3200, lng: -111.9800, estimatedValue: 298000 }, filingDate: "2026-03-20", status: "auction_scheduled", amountOwed: 265000, lender: "Federal Home Loan Mortgage Corp", auctionDate: "2026-06-25", courtRecordUrl: "https://recorder.maricopa.gov", borrower: "Owner of Record" },
  { id: "FC-005", caseNumber: "2026-0098432", property: { address: "3339 E Tonopah Dr", city: "Phoenix", zip: "85050", county: "Maricopa", lat: 33.6700, lng: -111.9700, estimatedValue: 425000 }, filingDate: "2026-02-15", status: "notice_of_default", amountOwed: 398000, lender: "TruWest Credit Union", auctionDate: null, courtRecordUrl: "https://recorder.maricopa.gov", borrower: "Riedel, P." },
];
export const foreclosureTrends: ForeclosureTrend[] = [
  { month: 'Apr 2025', count: 42, dismissed: 8, bankOwned: 5 },
  { month: 'May 2025', count: 38, dismissed: 6, bankOwned: 7 },
  { month: 'Jun 2025', count: 45, dismissed: 9, bankOwned: 4 },
  { month: 'Jul 2025', count: 51, dismissed: 7, bankOwned: 6 },
  { month: 'Aug 2025', count: 47, dismissed: 11, bankOwned: 8 },
  { month: 'Sep 2025', count: 53, dismissed: 10, bankOwned: 5 },
  { month: 'Oct 2025', count: 49, dismissed: 8, bankOwned: 9 },
  { month: 'Nov 2025', count: 56, dismissed: 12, bankOwned: 7 },
  { month: 'Dec 2025', count: 44, dismissed: 9, bankOwned: 6 },
  { month: 'Jan 2026', count: 61, dismissed: 11, bankOwned: 8 },
  { month: 'Feb 2026', count: 58, dismissed: 10, bankOwned: 7 },
  { month: 'Mar 2026', count: 64, dismissed: 13, bankOwned: 9 },
];
export type LienType = 'tax'|'mechanic'|'hoa'|'judgment'|'federal_tax'|'state_tax';
export type LienStatus = 'active'|'released'|'foreclosed'|'satisfied';
export interface LienRecord {
  id: string; lienNumber: string; type: LienType; status: LienStatus;
  amount: number; propertyAddress: string; filingDate: string;
  lienholder: string; recordingNumber: string; property?: { address: string; city: string; zip: string; county: string; lat?: number; lng?: number; }; beds?: number; baths?: number; sqft?: number; yearBuilt?: number; assessedValue?: number; marketValue?: number; apn?: string; releaseDate?: string; source?: string;
}
export const lienRecords: LienRecord[] = [
  { id: "LN-001", lienNumber: "2026-0089231", type: "mechanic", status: "active", amount: 28500, propertyAddress: "4521 E Cactus Rd, Phoenix 85032", filingDate: "2026-02-14", lienholder: "Desert Sun Roofing LLC", recordingNumber: "2026-0089231" },
  { id: "LN-002", lienNumber: "2026-0091445", type: "tax", status: "active", amount: 14200, propertyAddress: "7823 W Thomas Rd, Phoenix 85033", filingDate: "2026-02-20", lienholder: "Maricopa County Treasurer", recordingNumber: "2026-0091445" },
  { id: "LN-003", lienNumber: "2026-0078332", type: "hoa", status: "active", amount: 6800, propertyAddress: "9200 E Talking Stick Way, Scottsdale 85250", filingDate: "2026-01-28", lienholder: "Gainey Ranch HOA", recordingNumber: "2026-0078332" },
  { id: "LN-004", lienNumber: "2026-0102341", type: "federal_tax", status: "active", amount: 87500, propertyAddress: "15640 N Frank Lloyd Wright Blvd, Scottsdale 85260", filingDate: "2026-03-01", lienholder: "Internal Revenue Service", recordingNumber: "2026-0102341" },
  { id: "LN-005", lienNumber: "2026-0067891", type: "mechanic", status: "active", amount: 42300, propertyAddress: "3456 E Ray Rd, Gilbert 85296", filingDate: "2026-01-15", lienholder: "Valley Pool & Spa Construction", recordingNumber: "2026-0067891" },
  { id: "LN-006", lienNumber: "2026-0055123", type: "judgment", status: "active", amount: 55000, propertyAddress: "6200 W Bell Rd, Glendale 85308", filingDate: "2026-01-05", lienholder: "Maricopa County Superior Court", recordingNumber: "2026-0055123" },
  { id: "LN-007", lienNumber: "2026-0110234", type: "state_tax", status: "active", amount: 18900, propertyAddress: "2340 S Alma School Rd, Mesa 85210", filingDate: "2026-03-05", lienholder: "Arizona Dept of Revenue", recordingNumber: "2026-0110234" },
  { id: "LN-008", lienNumber: "2025-0988234", type: "tax", status: "satisfied", amount: 9200, propertyAddress: "1820 E Broadway Rd, Tempe 85282", filingDate: "2025-11-12", lienholder: "Maricopa County Treasurer", recordingNumber: "2025-0988234" },
  { id: "LN-009", lienNumber: "2026-0099812", type: "mechanic", status: "active", amount: 31750, propertyAddress: "10800 N Scottsdale Rd, Scottsdale 85254", filingDate: "2026-02-28", lienholder: "AZ Premier Contractors Inc", recordingNumber: "2026-0099812" },
  { id: "LN-010", lienNumber: "2026-0081567", type: "hoa", status: "active", amount: 4500, propertyAddress: "5600 N 74th St, Scottsdale 85250", filingDate: "2026-02-01", lienholder: "McCormick Ranch HOA", recordingNumber: "2026-0081567" },
  { id: "LN-011", lienNumber: "2026-0093421", type: "federal_tax", status: "active", amount: 124000, propertyAddress: "8900 E Pinnacle Peak Rd, Scottsdale 85255", filingDate: "2026-02-22", lienholder: "Internal Revenue Service", recordingNumber: "2026-0093421" },
  { id: "LN-012", lienNumber: "2026-0071234", type: "judgment", status: "released", amount: 38000, propertyAddress: "4100 W Chandler Blvd, Chandler 85226", filingDate: "2026-01-20", lienholder: "Maricopa County Superior Court", recordingNumber: "2026-0071234" },
];
export type ListingType = 'fsbo'|'unrepresented_buyer'|'unrepresented_seller'|'standard';
export type PropertyStatus = 'active'|'pending'|'sold'|'withdrawn'|'expired';
export interface FSBOListing {
  id: string; address: string; city: string; zip: string; price: number;
  beds: number; baths: number; sqft: number; yearBuilt: number;
  propertyType: string; listingType: ListingType; status: PropertyStatus;
  daysOnMarket: number; agentRepresented: boolean; property?: { address: string; city: string; zip: string; county: string; lat?: number; lng?: number; };

export const fsboListings: FSBOListing[] = [
  { id: "FSBO-001", address: "17246 W Ashley Dr", city: "Goodyear", zip: "85338", price: 385000, beds: 4, baths: 4, sqft: 2876, yearBuilt: 2018, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 1, agentRepresented: false, property: { address: "17246 W Ashley Dr", city: "Goodyear", zip: "85338", county: "Maricopa", lat: 33.4350, lng: -112.3750 } },
  { id: "FSBO-002", address: "1713 W Calle Marita", city: "Phoenix", zip: "85085", price: 989900, beds: 4, baths: 3, sqft: 3374, yearBuilt: 2015, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 8, agentRepresented: false, property: { address: "1713 W Calle Marita", city: "Phoenix", zip: "85085", county: "Maricopa", lat: 33.7100, lng: -112.1100 } },
  { id: "FSBO-003", address: "2926 W Northern Ave", city: "Phoenix", zip: "85051", price: 234900, beds: 5, baths: 3, sqft: 1044, yearBuilt: 1960, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 3, agentRepresented: false, property: { address: "2926 W Northern Ave", city: "Phoenix", zip: "85051", county: "Maricopa", lat: 33.5450, lng: -112.1000 } },
  { id: "FSBO-004", address: "7585 W Tumblewood Dr", city: "Peoria", zip: "85382", price: 425000, beds: 5, baths: 2, sqft: 2444, yearBuilt: 2005, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 5, agentRepresented: false, property: { address: "7585 W Tumblewood Dr", city: "Peoria", zip: "85382", county: "Maricopa", lat: 33.6300, lng: -112.2500 } },
  { id: "FSBO-005", address: "3812 E Baseline Rd", city: "Phoenix", zip: "85042", price: 379000, beds: 3, baths: 2, sqft: 1650, yearBuilt: 2002, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 12, agentRepresented: false, property: { address: "3812 E Baseline Rd", city: "Phoenix", zip: "85042", county: "Maricopa", lat: 33.3775, lng: -111.9900 } },
  { id: "FSBO-006", address: "4521 W Krall St", city: "Glendale", zip: "85301", price: 315000, beds: 3, baths: 2, sqft: 1380, yearBuilt: 1998, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 18, agentRepresented: false, property: { address: "4521 W Krall St", city: "Glendale", zip: "85301", county: "Maricopa", lat: 33.5340, lng: -112.1850 } },
  { id: "FSBO-007", address: "9823 E Sunridge Dr", city: "Sun Lakes", zip: "85248", price: 445000, beds: 2, baths: 2, sqft: 1980, yearBuilt: 2001, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 7, agentRepresented: false, property: { address: "9823 E Sunridge Dr", city: "Sun Lakes", zip: "85248", county: "Maricopa", lat: 33.2300, lng: -111.8700 } },
  { id: "FSBO-008", address: "2134 E Vineyard Rd", city: "Phoenix", zip: "85040", price: 389000, beds: 4, baths: 2, sqft: 1820, yearBuilt: 2000, propertyType: "Single Family", listingType: "unrepresented_buyer", status: "active", daysOnMarket: 22, agentRepresented: true, property: { address: "2134 E Vineyard Rd", city: "Phoenix", zip: "85040", county: "Maricopa", lat: 33.3750, lng: -111.9800 } },
  { id: "FSBO-009", address: "6734 S 10th St", city: "Phoenix", zip: "85042", price: 298000, beds: 3, baths: 2, sqft: 1340, yearBuilt: 1996, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 14, agentRepresented: false, property: { address: "6734 S 10th St", city: "Phoenix", zip: "85042", county: "Maricopa", lat: 33.3860, lng: -112.0600 } },
  { id: "FSBO-010", address: "18432 N 65th Ave", city: "Glendale", zip: "85308", price: 520000, beds: 4, baths: 3, sqft: 2250, yearBuilt: 2010, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 9, agentRepresented: false, property: { address: "18432 N 65th Ave", city: "Glendale", zip: "85308", county: "Maricopa", lat: 33.6350, lng: -112.1950 } },
  { id: "FSBO-011", address: "1456 E Wisteria Dr", city: "Chandler", zip: "85286", price: 465000, beds: 4, baths: 2, sqft: 2100, yearBuilt: 2008, propertyType: "Single Family", listingType: "unrepresented_seller", status: "active", daysOnMarket: 31, agentRepresented: false, property: { address: "1456 E Wisteria Dr", city: "Chandler", zip: "85286", county: "Maricopa", lat: 33.2850, lng: -111.8100 } },
  { id: "FSBO-012", address: "4290 E Melody Dr", city: "Gilbert", zip: "85234", price: 549000, beds: 5, baths: 3, sqft: 2680, yearBuilt: 2012, propertyType: "Single Family", listingType: "fsbo", status: "pending", daysOnMarket: 4, agentRepresented: false, property: { address: "4290 E Melody Dr", city: "Gilbert", zip: "85234", county: "Maricopa", lat: 33.3750, lng: -111.7900 } },
  { id: "FSBO-013", address: "11234 W Yuma Rd", city: "Avondale", zip: "85323", price: 349000, beds: 4, baths: 2, sqft: 1920, yearBuilt: 2007, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 26, agentRepresented: false, property: { address: "11234 W Yuma Rd", city: "Avondale", zip: "85323", county: "Maricopa", lat: 33.4350, lng: -112.3200 } },
  { id: "FSBO-014", address: "3890 W Arrowhead Lakes Dr", city: "Glendale", zip: "85308", price: 675000, beds: 4, baths: 3, sqft: 2900, yearBuilt: 2016, propertyType: "Single Family", listingType: "unrepresented_buyer", status: "active", daysOnMarket: 15, agentRepresented: true, property: { address: "3890 W Arrowhead Lakes Dr", city: "Glendale", zip: "85308", county: "Maricopa", lat: 33.6500, lng: -112.1900 } },
  { id: "FSBO-015", address: "8234 E Posada Ave", city: "Mesa", zip: "85212", price: 412000, beds: 3, baths: 2, sqft: 1780, yearBuilt: 2004, propertyType: "Single Family", listingType: "fsbo", status: "active", daysOnMarket: 20, agentRepresented: false, property: { address: "8234 E Posada Ave", city: "Mesa", zip: "85212", county: "Maricopa", lat: 33.3450, lng: -111.6800 } },
];
export interface LiensByType { type: string; label: string; count: number; }
export interface PriceDistribution { range: string; count: number; }
export interface ActivityFeedItem {
  type: 'foreclosure'|'lien'|'fsbo'|'alert';
  title: string; description: string; amount?: string; timeAgo: string;
}
export const liensByType: LiensByType[] = [
  { type: 'tax', label: 'Tax', count: 3 },
  { type: 'mechanic', label: "Mechanic's", count: 4 },
  { type: 'hoa', label: 'HOA', count: 2 },
  { type: 'judgment', label: 'Judgment', count: 2 },
  { type: 'federal_tax', label: 'Federal Tax', count: 2 },
  { type: 'state_tax', label: 'State Tax', count: 1 },
];
export const priceDistribution: PriceDistribution[] = [
  { range: '<$200K', count: 0 },
  { range: '$200-300K', count: 0 },
  { range: '$300-400K', count: 0 },
  { range: '$400-500K', count: 0 },
  { range: '$500-600K', count: 0 },
  { range: '$600-800K', count: 0 },
  { range: '$800K+', count: 0 },
];
export const recentActivity: ActivityFeedItem[] = [];
export type FinancingType = 'cash'|'conventional'|'fha'|'va'|'other';
export type HomeType = 'single_family'|'condo'|'townhouse'|'multi_family'|'mobile';
export interface RecentSale {
  id: string; address: string; city: string; zip: string; saleDate: string;
  salePrice: number; buyerName: string; sellerName: string;
  buyerAgent: string; buyerBrokerage: string; sellerAgent: string; sellerBrokerage: string;
  financingType: FinancingType; sqft: number; beds: number; baths: number;
  propertyType: HomeType; yearBuilt: number; lat: number; lng: number;
}
export const recentSales: RecentSale[] = [];
export const luxurySales: RecentSale[] = [];
export const totalLuxurySales = luxurySales.length;
export const totalLuxuryVolume = luxurySales.reduce((sum, s) => sum + s.salePrice, 0);
export const avgLuxuryPrice = totalLuxurySales > 0 ? Math.round(totalLuxuryVolume / totalLuxurySales) : 0;
export const luxuryCashCount = luxurySales.filter((s) => s.financingType === 'cash').length;
export const totalRecentSales = recentSales.length;
export const totalSalesVolume = recentSales.reduce((sum, s) => sum + s.salePrice, 0);
export const avgSalePrice = totalRecentSales > 0 ? Math.round(totalSalesVolume / totalRecentSales) : 0;
export const cashSalesCount = recentSales.filter((s) => s.financingType === 'cash').length;
export type ListingStatus = 'for_sale'|'pending'|'withdrawn';
export interface ActiveListing {
  id: string; address: string; city: string; zip: string; listPrice: number;
  status: ListingStatus; listDate: string; daysOnMarket: number;
  sellerName: string; sellerAgent: string; sellerBrokerage: string;
  sqft: number; beds: number; baths: number; propertyType: HomeType;
  yearBuilt: number; lat: number; lng: number;
}
export const activeListingsUnder1M: ActiveListing[] = [
  { id: "AL-001", address: "201 S Greenfield Rd #124", city: "Mesa", zip: "85206", listPrice: 125000, status: "for_sale", listDate: "2026-03-01", daysOnMarket: 13, sellerName: "", sellerAgent: "Revinre", sellerBrokerage: "ARMLS", sqft: 1344, beds: 3, baths: 2, propertyType: "condo", yearBuilt: 2000, lat: 33.4150, lng: -111.7640 },
  { id: "AL-002", address: "7259 W St Charles Ave", city: "Laveen", zip: "85339", listPrice: 400000, status: "for_sale", listDate: "2026-03-05", daysOnMarket: 9, sellerName: "", sellerAgent: "Realty One Group", sellerBrokerage: "ARMLS", sqft: 2789, beds: 6, baths: 3, propertyType: "single_family", yearBuilt: 2018, lat: 33.3700, lng: -112.1700 },
  { id: "AL-003", address: "9311 E Milagro Ave", city: "Mesa", zip: "85209", listPrice: 500000, status: "for_sale", listDate: "2026-02-20", daysOnMarket: 22, sellerName: "", sellerAgent: "My Home Group Real Estate", sellerBrokerage: "ARMLS", sqft: 1924, beds: 4, baths: 2, propertyType: "single_family", yearBuilt: 2005, lat: 33.3800, lng: -111.6900 },
  { id: "AL-004", address: "25774 N 165th Ln", city: "Surprise", zip: "85387", listPrice: 320000, status: "for_sale", listDate: "2026-02-25", daysOnMarket: 17, sellerName: "", sellerAgent: "Orchard Brokerage", sellerBrokerage: "ARMLS", sqft: 1320, beds: 3, baths: 2, propertyType: "single_family", yearBuilt: 2010, lat: 33.7100, lng: -112.4200 },
  { id: "AL-005", address: "15329 W Catalina Ct", city: "Goodyear", zip: "85395", listPrice: 615000, status: "for_sale", listDate: "2026-03-01", daysOnMarket: 13, sellerName: "", sellerAgent: "PHX Pro Realty", sellerBrokerage: "ARMLS", sqft: 1886, beds: 2, baths: 2, propertyType: "single_family", yearBuilt: 2015, lat: 33.4700, lng: -112.3800 },
  { id: "AL-006", address: "3821 E Encanto St", city: "Mesa", zip: "85205", listPrice: 475000, status: "for_sale", listDate: "2026-02-15", daysOnMarket: 27, sellerName: "", sellerAgent: "Keller Williams Realty", sellerBrokerage: "ARMLS", sqft: 1650, beds: 3, baths: 2, propertyType: "single_family", yearBuilt: 2002, lat: 33.4300, lng: -111.7800 },
  { id: "AL-007", address: "4532 W Fallen Leaf Ln", city: "Glendale", zip: "85310", listPrice: 550000, status: "for_sale", listDate: "2026-03-08", daysOnMarket: 6, sellerName: "", sellerAgent: "Coldwell Banker Realty", sellerBrokerage: "ARMLS", sqft: 2100, beds: 4, baths: 2, propertyType: "single_family", yearBuilt: 2008, lat: 33.6500, lng: -112.1900 },
  { id: "AL-008", address: "18723 N 92nd Ave", city: "Peoria", zip: "85382", listPrice: 425000, status: "for_sale", listDate: "2026-02-28", daysOnMarket: 14, sellerName: "", sellerAgent: "HomeSmart", sellerBrokerage: "ARMLS", sqft: 1780, beds: 3, baths: 2, propertyType: "single_family", yearBuilt: 2006, lat: 33.6200, lng: -112.2600 },
  { id: "AL-009", address: "2134 S Martingale Rd", city: "Gilbert", zip: "85295", listPrice: 680000, status: "for_sale", listDate: "2026-03-03", daysOnMarket: 11, sellerName: "", sellerAgent: "RE/MAX Solutions", sellerBrokerage: "ARMLS", sqft: 2450, beds: 4, baths: 3, propertyType: "single_family", yearBuilt: 2014, lat: 33.3000, lng: -111.7500 },
  { id: "AL-010", address: "9743 E Isleta Ave", city: "Mesa", zip: "85209", listPrice: 389000, status: "for_sale", listDate: "2026-03-10", daysOnMarket: 4, sellerName: "", sellerAgent: "eXp Realty", sellerBrokerage: "ARMLS", sqft: 1580, beds: 3, baths: 2, propertyType: "single_family", yearBuilt: 2003, lat: 33.3600, lng: -111.6800 },
  { id: "AL-011", address: "7142 W Mercer Ln", city: "Peoria", zip: "85345", listPrice: 349000, status: "for_sale", listDate: "2026-02-18", daysOnMarket: 24, sellerName: "", sellerAgent: "West USA Realty", sellerBrokerage: "ARMLS", sqft: 1450, beds: 3, baths: 2, propertyType: "single_family", yearBuilt: 1999, lat: 33.5900, lng: -112.2400 },
  { id: "AL-012", address: "1847 E Desert Willow Dr", city: "Phoenix", zip: "85048", listPrice: 575000, status: "for_sale", listDate: "2026-03-06", daysOnMarket: 8, sellerName: "", sellerAgent: "Redfin", sellerBrokerage: "ARMLS", sqft: 2050, beds: 4, baths: 2, propertyType: "single_family", yearBuilt: 2011, lat: 33.3100, lng: -112.0100 },
  { id: "AL-013", address: "3456 W Roundhill Dr", city: "Chandler", zip: "85226", listPrice: 495000, status: "pending", listDate: "2026-01-15", daysOnMarket: 58, sellerName: "", sellerAgent: "DPR Realty", sellerBrokerage: "ARMLS", sqft: 1920, beds: 4, baths: 2, propertyType: "single_family", yearBuilt: 2007, lat: 33.3200, lng: -111.9100 },
  { id: "AL-014", address: "11034 W Seminole Dr", city: "Sun City", zip: "85373", listPrice: 265000, status: "for_sale", listDate: "2026-03-02", daysOnMarket: 12, sellerName: "", sellerAgent: "Arizona Best Real Estate", sellerBrokerage: "ARMLS", sqft: 1200, beds: 2, baths: 2, propertyType: "single_family", yearBuilt: 1978, lat: 33.6500, lng: -112.2900 },
  { id: "AL-015", address: "6234 S Gunner Way", city: "Gilbert", zip: "85298", listPrice: 750000, status: "for_sale", listDate: "2026-02-22", daysOnMarket: 20, sellerName: "", sellerAgent: "Compass", sellerBrokerage: "ARMLS", sqft: 2800, beds: 5, baths: 3, propertyType: "single_family", yearBuilt: 2017, lat: 33.2600, lng: -111.7400 },
];
export const activeListingsOver1M: ActiveListing[] = [
  { id: 'AH-001', address: '5525 E Lincoln Dr #104', city: 'Paradise Valley', zip: '85253', listPrice: 4750000, status: 'for_sale', listDate: '2026-02-01', daysOnMarket: 41, sellerName: '', sellerAgent: 'Engel & Volkers Scottsdale', sellerBrokerage: 'ARMLS', sqft: 3419, beds: 3, baths: 4, propertyType: 'single_family', yearBuilt: 2020, lat: 33.5190, lng: -111.9710 },
  { id: 'AH-002', address: '6602 E Cheney Dr', city: 'Paradise Valley', zip: '85253', listPrice: 4999000, status: 'for_sale', listDate: '2026-02-10', daysOnMarket: 32, sellerName: '', sellerAgent: 'Compass', sellerBrokerage: 'ARMLS', sqft: 4458, beds: 5, baths: 4, propertyType: 'single_family', yearBuilt: 2019, lat: 33.5230, lng: -111.9390 },
  { id: 'AH-003', address: '4836 E Moonlight Way', city: 'Paradise Valley', zip: '85253', listPrice: 2750000, status: 'for_sale', listDate: '2026-02-15', daysOnMarket: 27, sellerName: '', sellerAgent: 'Cambridge Properties', sellerBrokerage: 'ARMLS', sqft: 3165, beds: 5, baths: 4, propertyType: 'single_family', yearBuilt: 2018, lat: 33.5270, lng: -111.9420 },
  { id: 'AH-004', address: '5924 E North Ln', city: 'Paradise Valley', zip: '85253', listPrice: 1488888, status: 'for_sale', listDate: '2026-02-20', daysOnMarket: 22, sellerName: '', sellerAgent: 'Realty One Group', sellerBrokerage: 'ARMLS', sqft: 2167, beds: 4, baths: 2, propertyType: 'single_family', yearBuilt: 2015, lat: 33.5380, lng: -111.9440 },
  { id: 'AH-005', address: '4737 E Valley Vista Ln', city: 'Paradise Valley', zip: '85253', listPrice: 3300000, status: 'for_sale', listDate: '2026-01-28', daysOnMarket: 45, sellerName: '', sellerAgent: 'Retsy', sellerBrokerage: 'ARMLS', sqft: 4483, beds: 6, baths: 5, propertyType: 'single_family', yearBuilt: 2017, lat: 33.5290, lng: -111.9460 },
  { id: 'AH-006', address: '6524 N 61st St', city: 'Paradise Valley', zip: '85253', listPrice: 3300000, status: 'for_sale', listDate: '2026-02-05', daysOnMarket: 37, sellerName: '', sellerAgent: 'Compass', sellerBrokerage: 'ARMLS', sqft: 3239, beds: 4, baths: 3, propertyType: 'single_family', yearBuilt: 2016, lat: 33.5360, lng: -111.9360 },
  { id: 'AH-007', address: '6332 E Vista Dr', city: 'Paradise Valley', zip: '85253', listPrice: 3995000, status: 'for_sale', listDate: '2026-01-20', daysOnMarket: 53, sellerName: '', sellerAgent: 'Compass', sellerBrokerage: 'ARMLS', sqft: 5539, beds: 4, baths: 6, propertyType: 'single_family', yearBuilt: 2021, lat: 33.5310, lng: -111.9400 },
  { id: 'AH-008', address: '5676 E Cheney Dr', city: 'Paradise Valley', zip: '85253', listPrice: 4700000, status: 'for_sale', listDate: '2026-02-12', daysOnMarket: 30, sellerName: '', sellerAgent: 'Desert Dream Realty', sellerBrokerage: 'ARMLS', sqft: 5950, beds: 5, baths: 6, propertyType: 'single_family', yearBuilt: 2020, lat: 33.5240, lng: -111.9380 },
  { id: 'AH-009', address: '10201 N 58th Pl', city: 'Paradise Valley', zip: '85253', listPrice: 1625000, status: 'for_sale', listDate: '2026-02-25', daysOnMarket: 17, sellerName: '', sellerAgent: 'Local Luxury Christies International', sellerBrokerage: 'ARMLS', sqft: 2867, beds: 3, baths: 3, propertyType: 'single_family', yearBuilt: 2014, lat: 33.5420, lng: -111.9500 },
  { id: 'AH-010', address: '4800 E Clearwater Pkwy', city: 'Paradise Valley', zip: '85253', listPrice: 2450000, status: 'for_sale', listDate: '2026-03-01', daysOnMarket: 13, sellerName: '', sellerAgent: 'EXP Realty', sellerBrokerage: 'ARMLS', sqft: 2928, beds: 4, baths: 3, propertyType: 'single_family', yearBuilt: 2018, lat: 33.5260, lng: -111.9410 },
];
export interface UltraLuxuryListing {
  id: string; address: string; city: string; zip: string; listPrice: number;
  status: ListingStatus; listDate: string; daysOnMarket: number;
  sellerName: string; sellerAgent: string; sellerBrokerage: string;
  sqft: number; beds: number; baths: number; acreage: number;
  propertyType: string; yearBuilt: number; description: string;
  features: string[]; lat: number; lng: number;
}
export const ultraLuxuryListings: UltraLuxuryListing[] = [
  { id: 'UL-001', address: '7545 N Mockingbird Ln', city: 'Paradise Valley', zip: '85253', listPrice: 40000000, status: 'for_sale', listDate: '2026-01-01', daysOnMarket: 72, sellerName: '', sellerAgent: 'Griggs Group / Altman Brothers', sellerBrokerage: 'T.J. Farrier Corporation', sqft: 23082, beds: 11, baths: 15, acreage: 0, propertyType: 'Estate', yearBuilt: 2025, description: 'New construction estate with floor-to-ceiling marble fireplace.', features: ['New Construction', 'Marble Fireplace'], lat: 33.5350, lng: -111.9380 },
  { id: 'UL-002', address: '9071 N 53rd Pl', city: 'Paradise Valley', zip: '85253', listPrice: 6500000, status: 'for_sale', listDate: '2026-01-15', daysOnMarket: 58, sellerName: '', sellerAgent: 'Keller Williams Realty Sonoran Living', sellerBrokerage: 'ARMLS', sqft: 6176, beds: 5, baths: 7, acreage: 0, propertyType: 'Estate', yearBuilt: 2020, description: 'Stunning Paradise Valley estate with resort-style pool and mountain views.', features: ['Resort Pool', 'Mountain Views'], lat: 33.5380, lng: -111.9440 },
  { id: 'UL-003', address: '5432 E Via Del Cielo', city: 'Paradise Valley', zip: '85253', listPrice: 11950000, status: 'for_sale', listDate: '2026-01-10', daysOnMarket: 63, sellerName: '', sellerAgent: 'Silverleaf Realty', sellerBrokerage: 'ARMLS', sqft: 8543, beds: 5, baths: 6, acreage: 0, propertyType: 'Estate', yearBuilt: 2021, description: 'Contemporary masterpiece with expansive outdoor living and stunning mountain views.', features: ['Outdoor Living', 'Mountain Views', 'Pool'], lat: 33.5260, lng: -111.9410 },
  { id: 'UL-004', address: '8111 N 62nd Pl', city: 'Paradise Valley', zip: '85253', listPrice: 8490000, status: 'for_sale', listDate: '2026-02-01', daysOnMarket: 41, sellerName: '', sellerAgent: 'Keller Williams Realty Phoenix', sellerBrokerage: 'ARMLS', sqft: 8551, beds: 5, baths: 7, acreage: 0, propertyType: 'Estate', yearBuilt: 2019, description: 'Spacious estate with resort amenities and sparkling pool and spa.', features: ['Spacious Garage', 'Pool & Spa'], lat: 33.5420, lng: -111.9500 },
  { id: 'UL-005', address: '5815 N Saguaro Rd', city: 'Paradise Valley', zip: '85253', listPrice: 35000000, status: 'for_sale', listDate: '2025-10-01', daysOnMarket: 165, sellerName: '', sellerAgent: 'Russ Lyon Sothebys International Realty', sellerBrokerage: 'ARMLS', sqft: 22000, beds: 15, baths: 16, acreage: 0, propertyType: 'Mega-Estate', yearBuilt: 2023, description: 'One of Paradise Valleys most exclusive estates.', features: ['Sparkling Pool', 'Spa', 'Luxury Finishes'], lat: 33.5480, lng: -111.9360 },
  { id: 'UL-006', address: '4534 E Pebble Ridge Rd', city: 'Paradise Valley', zip: '85253', listPrice: 9985000, status: 'for_sale', listDate: '2026-02-10', daysOnMarket: 32, sellerName: '', sellerAgent: 'Compass', sellerBrokerage: 'ARMLS', sqft: 8321, beds: 6, baths: 8, acreage: 0, propertyType: 'Estate', yearBuilt: 2020, description: 'Stunning estate with open concept living and resort-style amenities.', features: ['Open Concept', 'Resort Pool'], lat: 33.5290, lng: -111.9470 },
  { id: 'UL-007', address: '5401 E Mockingbird Ln', city: 'Paradise Valley', zip: '85253', listPrice: 6385000, status: 'for_sale', listDate: '2026-02-15', daysOnMarket: 27, sellerName: '', sellerAgent: 'Compass', sellerBrokerage: 'ARMLS', sqft: 7790, beds: 5, baths: 6, acreage: 0, propertyType: 'Estate', yearBuilt: 2018, description: 'Elegant estate with mountain views and resort-style outdoor living.', features: ['Mountain Views', 'Outdoor Living'], lat: 33.5310, lng: -111.9420 },
  { id: 'UL-008', address: '6610 N Mountain View Dr', city: 'Paradise Valley', zip: '85253', listPrice: 10500000, status: 'for_sale', listDate: '2026-01-20', daysOnMarket: 53, sellerName: '', sellerAgent: 'Compass', sellerBrokerage: 'ARMLS', sqft: 8363, beds: 5, baths: 8, acreage: 0, propertyType: 'Estate', yearBuilt: 2022, description: 'Breathtaking mountain view estate with resort-style pool.', features: ['Mountain Views', 'Resort Pool'], lat: 33.5400, lng: -111.9350 },
  { id: 'UL-009', address: '6824 E Hummingbird Ln', city: 'Paradise Valley', zip: '85253', listPrice: 16995000, status: 'for_sale', listDate: '2025-12-01', daysOnMarket: 103, sellerName: '', sellerAgent: 'Compass', sellerBrokerage: 'ARMLS', sqft: 7850, beds: 5, baths: 7, acreage: 0, propertyType: 'Estate', yearBuilt: 2022, description: 'Ultra-luxury estate with top-tier finishes and panoramic views.', features: ['Panoramic Views', 'Smart Home'], lat: 33.5270, lng: -111.9390 },
  { id: 'UL-010', address: '6611 N 64th Pl', city: 'Paradise Valley', zip: '85253', listPrice: 6997000, status: 'for_sale', listDate: '2026-01-25', daysOnMarket: 48, sellerName: '', sellerAgent: 'Engel & Volkers Scottsdale', sellerBrokerage: 'ARMLS', sqft: 12021, beds: 6, baths: 12, acreage: 0, propertyType: 'Estate', yearBuilt: 2021, description: 'Stately Paradise Valley estate with exceptional craftsmanship.', features: ['Stately Views', 'Resort Living', 'Wine Cellar'], lat: 33.5360, lng: -111.9460 },
];
export const totalUltraLuxury = ultraLuxuryListings.length;
export const totalUltraLuxuryValue = ultraLuxuryListings.reduce((sum, l) => sum + l.listPrice, 0);
export const avgUltraLuxuryPrice = totalUltraLuxury > 0 ? Math.round(totalUltraLuxuryValue / totalUltraLuxury) : 0;
export const ultraLuxuryAvgAcreage = totalUltraLuxury > 0 ? +(ultraLuxuryListings.reduce((sum, l) => sum + l.acreage, 0) / totalUltraLuxury).toFixed(1) : 0;
export const ultraLuxuryAvgSqft = totalUltraLuxury > 0 ? Math.round(ultraLuxuryListings.reduce((sum, l) => sum + l.sqft, 0) / totalUltraLuxury) : 0;
export const totalForeclosures = foreclosureRecords.length;
export const activeForeclosures = foreclosureRecords.filter(r => ['pre_foreclosure','notice_of_default','auction_scheduled'].includes(r.status)).length;
export const totalLiens = lienRecords.length;
export const activeLiens = lienRecords.filter(r => r.status === 'active').length;
export const totalFSBO = fsboListings.length;
export const unrepresentedParties = fsboListings.filter(l => l.listingType === 'unrepresented_buyer' || l.listingType === 'unrepresented_seller').length;




