// Pre-foreclosure and distressed property data
// Sources: public records, county clerk filings, Notice of Default filings

export interface DistressedProperty {
  id: string;
  address: string;
  zip: string;
  submarket: string;
  type: "pre-foreclosure" | "notice-of-default" | "tax-delinquent" | "pre-bankruptcy" | "absentee-owner";
  status: string;
  estimatedValue: number | null;
  estimatedEquity: number | null;
  daysDelinquent: number | null;
  ownerName: string | null;
  lastSaleDate: string | null;
  lastSalePrice: number | null;
  yearBuilt: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  arv: number | null; // After-repair value estimate
  repairCost: number | null; // Estimated repairs needed
  score: number | null; // 0-100 lead quality score
  source: string;
  dateAdded: string;
}

// Sample distressed properties for the filter demo
// In production, this would pull from real county data
export const SAMPLE_DISTRESSED: DistressedProperty[] = [
  {
    id: "dist-001",
    address: "7818 Carverdale Dr, Houston, TX 77041",
    zip: "77041",
    submarket: "Carverdale / NW Houston",
    type: "notice-of-default",
    status: "NOD Filed — 30 days to auction",
    estimatedValue: 310000,
    estimatedEquity: 62000,
    daysDelinquent: 120,
    ownerName: null,
    lastSaleDate: "2019-03",
    lastSalePrice: 215000,
    yearBuilt: 1985,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    arv: 365000,
    repairCost: 35000,
    score: 82,
    source: "Harris County Clerk",
    dateAdded: "2026-06-26",
  },
  {
    id: "dist-002",
    address: "4314 N Wayside Dr, Houston, TX 77020",
    zip: "77020",
    submarket: "Denver Harbor / Fifth Ward",
    type: "pre-foreclosure",
    status: "Pre-foreclosure — 90 days behind",
    estimatedValue: 195000,
    estimatedEquity: 35000,
    daysDelinquent: 95,
    ownerName: null,
    lastSaleDate: "2017-08",
    lastSalePrice: 135000,
    yearBuilt: 1962,
    bedrooms: 3,
    bathrooms: 1,
    sqft: 1400,
    arv: 245000,
    repairCost: 40000,
    score: 88,
    source: "Harris County Clerk",
    dateAdded: "2026-06-26",
  },
  {
    id: "dist-003",
    address: "9210 Mesa Dr, Houston, TX 77033",
    zip: "77033",
    submarket: "South Houston",
    type: "tax-delinquent",
    status: "Tax Delinquent — 3 years unpaid",
    estimatedValue: 145000,
    estimatedEquity: 85000,
    daysDelinquent: 1095,
    ownerName: null,
    lastSaleDate: "2004-11",
    lastSalePrice: 72000,
    yearBuilt: 1970,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1550,
    arv: 220000,
    repairCost: 50000,
    score: 91,
    source: "Harris County Tax Office",
    dateAdded: "2026-06-26",
  },
  {
    id: "dist-004",
    address: "11843 Aldine Westfield Rd, Houston, TX 77093",
    zip: "77093",
    submarket: "Aldine / North",
    type: "pre-bankruptcy",
    status: "Pre-bankruptcy — attorney retained",
    estimatedValue: 175000,
    estimatedEquity: 25000,
    daysDelinquent: 60,
    ownerName: null,
    lastSaleDate: "2020-01",
    lastSalePrice: 155000,
    yearBuilt: 1978,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1800,
    arv: 230000,
    repairCost: 30000,
    score: 75,
    source: "Harris County Civil Court",
    dateAdded: "2026-06-26",
  },
  {
    id: "dist-005",
    address: "5518 Southland St, Houston, TX 77033",
    zip: "77033",
    submarket: "South Houston",
    type: "notice-of-default",
    status: "NOD Filed — auction in 45 days",
    estimatedValue: 160000,
    estimatedEquity: 40000,
    daysDelinquent: 150,
    ownerName: null,
    lastSaleDate: "2016-05",
    lastSalePrice: 110000,
    yearBuilt: 1965,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1350,
    arv: 215000,
    repairCost: 45000,
    score: 85,
    source: "Harris County Clerk",
    dateAdded: "2026-06-26",
  },
  {
    id: "dist-006",
    address: "3414 Deerfield St, Houston, TX 77026",
    zip: "77026",
    submarket: "Kashmere Gardens",
    type: "pre-foreclosure",
    status: "Pre-foreclosure — 120 days behind",
    estimatedValue: 125000,
    estimatedEquity: 30000,
    daysDelinquent: 120,
    ownerName: null,
    lastSaleDate: "2018-10",
    lastSalePrice: 88000,
    yearBuilt: 1958,
    bedrooms: 3,
    bathrooms: 1,
    sqft: 1200,
    arv: 180000,
    repairCost: 45000,
    score: 79,
    source: "Harris County Clerk",
    dateAdded: "2026-06-26",
  },
  {
    id: "dist-007",
    address: "6014 Fairdale Ln, Houston, TX 77051",
    zip: "77051",
    submarket: "Sunnyside / South Park",
    type: "absentee-owner",
    status: "Absentee Owner — out of state",
    estimatedValue: 220000,
    estimatedEquity: 110000,
    daysDelinquent: null,
    ownerName: null,
    lastSaleDate: "2012-06",
    lastSalePrice: 95000,
    yearBuilt: 1972,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    arv: 275000,
    repairCost: 35000,
    score: 72,
    source: "Property Records",
    dateAdded: "2026-06-26",
  },
  {
    id: "dist-008",
    address: "12626 Carriage Way Dr, Houston, TX 77044",
    zip: "77044",
    submarket: "Generation Park / Lake Houston",
    type: "notice-of-default",
    status: "NOD Filed — 60 days to auction",
    estimatedValue: 265000,
    estimatedEquity: 45000,
    daysDelinquent: 90,
    ownerName: null,
    lastSaleDate: "2021-09",
    lastSalePrice: 235000,
    yearBuilt: 2005,
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2400,
    arv: 310000,
    repairCost: 25000,
    score: 77,
    source: "Harris County Clerk",
    dateAdded: "2026-06-26",
  },
];

export const DISTRESSED_TYPES = [
  { value: "notice-of-default", label: "Notice of Default", icon: "📋" },
  { value: "pre-foreclosure", label: "Pre-Foreclosure", icon: "🔴" },
  { value: "tax-delinquent", label: "Tax Delinquent", icon: "💰" },
  { value: "pre-bankruptcy", label: "Pre-Bankruptcy", icon: "⚖️" },
  { value: "absentee-owner", label: "Absentee Owner", icon: "🏠" },
];

export function getTypeLabel(type: string): string {
  return DISTRESSED_TYPES.find((t) => t.value === type)?.label || type;
}

export function getTypeIcon(type: string): string {
  return DISTRESSED_TYPES.find((t) => t.value === type)?.icon || "📌";
}
