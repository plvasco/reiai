export interface ZipData {
  zip: string;
  submarket: string;
  medDOM: number | null;
  avgDOM: number | null;
  medPrice: number | null;
  medPPS: number | null;
  medRent: number | null;
  grossYield: number | null;
  totalListings: number | null;
  newListings: number | null;
  avgSqFt: number | null;
}

export const SUBMARKETS: Record<string, string> = {
  "77002": "Downtown",
  "77003": "East End / EaDo",
  "77004": "Third Ward / Midtown S",
  "77007": "Rice Military / Washington",
  "77009": "Heights North / Near Northside",
  "77011": "Magnolia Park / East End",
  "77012": "Harrisburg",
  "77015": "East Houston",
  "77019": "River Oaks / Montrose",
  "77020": "Denver Harbor / Fifth Ward",
  "77024": "Memorial / Hunters Creek",
  "77026": "Kashmere Gardens",
  "77027": "Greenway / Upper Kirby",
  "77033": "South Houston",
  "77040": "NW Houston / Carverdale",
  "77041": "Carverdale / NW Houston",
  "77043": "Brittmoore / Spring Branch W",
  "77044": "Generation Park / Lake Houston",
  "77051": "Sunnyside / South Park",
  "77065": "N Eldridge / Cypress",
  "77078": "NE Houston",
  "77079": "Westbranch / Memorial W",
  "77087": "Gulfgate / Park Place",
  "77093": "Aldine / North",
  "77530": "Channelview",
  "77058": "Clear Lake / NASA",
  "77057": "West Houston",
  "77056": "Uptown / Galleria",
  "77005": "West University / Southside",
  "77006": "Montrose / Neartown",
  "77008": "Heights / Timbergrove",
  "77010": "East Downtown",
};

export const FOCUS_ZIPS = [
  "77041","77040","77065","77043","77079","77044","77009","77020",
  "77087","77051","77003","77004","77011","77012","77033","77093","77026"
];
