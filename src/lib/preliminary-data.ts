import { ZipData, SUBMARKETS } from "./types";

// Static snapshot (RentCast, June 26, 2026) — loads instantly, overwritten by live API
export const PRELIMINARY_ZIP_DATA: ZipData[] = [
  { zip: "77041", submarket: "Carverdale / NW Houston", medDOM: 23, avgDOM: 53.0, medPrice: 399000, medPPS: 163.85, medRent: 2200, grossYield: 6.62, totalListings: 175, newListings: 51, avgSqFt: 2730 },
  { zip: "77040", submarket: "NW Houston / Carverdale", medDOM: 24, avgDOM: 53.5, medPrice: 300000, medPPS: 152.97, medRent: 1750, grossYield: 7.00, totalListings: 176, newListings: 43, avgSqFt: 2265 },
  { zip: "77065", submarket: "N Eldridge / Cypress", medDOM: 25, avgDOM: 52.9, medPrice: 299990, medPPS: 151.79, medRent: 1895, grossYield: 7.58, totalListings: 121, newListings: 34, avgSqFt: 2148 },
  { zip: "77043", submarket: "Brittmoore / Spring Branch W", medDOM: 25, avgDOM: 57.4, medPrice: 450000, medPPS: 197.42, medRent: 1875, grossYield: 5.00, totalListings: 197, newListings: 43, avgSqFt: 2398 },
  { zip: "77079", submarket: "Westbranch / Memorial W", medDOM: 22, avgDOM: 42.7, medPrice: 565000, medPPS: 213.22, medRent: 1831, grossYield: 3.89, totalListings: 247, newListings: 73, avgSqFt: 2347 },
  { zip: "77044", submarket: "Generation Park / Lake Houston", medDOM: 26, avgDOM: 68.5, medPrice: 315785, medPPS: 140.64, medRent: 1830, grossYield: 6.95, totalListings: 339, newListings: 60, avgSqFt: 2435 },
  { zip: "77009", submarket: "Heights North / Near Northside", medDOM: 26, avgDOM: 70.2, medPrice: 435000, medPPS: 255.95, medRent: 1850, grossYield: 5.10, totalListings: 612, newListings: 136, avgSqFt: 1982 },
  { zip: "77020", submarket: "Denver Harbor / Fifth Ward", medDOM: 27, avgDOM: 74.2, medPrice: 265000, medPPS: 192.50, medRent: 2082, grossYield: 9.43, totalListings: 336, newListings: 70, avgSqFt: 1875 },
  { zip: "77087", submarket: "Gulfgate / Park Place", medDOM: 26, avgDOM: 61.0, medPrice: 265900, medPPS: 170.17, medRent: 1299, grossYield: 5.86, totalListings: 88, newListings: 19, avgSqFt: 1721 },
  { zip: "77051", submarket: "Sunnyside / South Park", medDOM: 26, avgDOM: 80.6, medPrice: 269999, medPPS: 168.32, medRent: 1895, grossYield: 8.42, totalListings: 313, newListings: 68, avgSqFt: 1855 },
  { zip: "77003", submarket: "East End / EaDo", medDOM: 73, avgDOM: 87.1, medPrice: 399900, medPPS: 211.47, medRent: 1936, grossYield: 5.81, totalListings: 217, newListings: 36, avgSqFt: 2248 },
  { zip: "77004", submarket: "Third Ward / Midtown S", medDOM: 67, avgDOM: 86.4, medPrice: 399900, medPPS: 210.34, medRent: 2000, grossYield: 6.00, totalListings: 579, newListings: 105, avgSqFt: 2208 },
  { zip: "77011", submarket: "Magnolia Park / East End", medDOM: 70, avgDOM: 90.5, medPrice: 349999, medPPS: 194.14, medRent: 1450, grossYield: 4.97, totalListings: 164, newListings: 31, avgSqFt: 1950 },
  { zip: "77012", submarket: "Harrisburg", medDOM: 63, avgDOM: 74.7, medPrice: 219500, medPPS: 163.34, medRent: 1350, grossYield: 7.38, totalListings: 71, newListings: 11, avgSqFt: 1680 },
  { zip: "77033", submarket: "South Houston", medDOM: 57, avgDOM: 87.5, medPrice: 185000, medPPS: 149.17, medRent: 1775, grossYield: 11.51, totalListings: 358, newListings: 75, avgSqFt: 1650 },
  { zip: "77093", submarket: "Aldine / North", medDOM: 63, avgDOM: 84.1, medPrice: 229000, medPPS: 157.96, medRent: 1600, grossYield: 8.38, totalListings: 144, newListings: 25, avgSqFt: 1735 },
  { zip: "77026", submarket: "Kashmere Gardens", medDOM: 79, avgDOM: 100.5, medPrice: 168000, medPPS: 186.62, medRent: 1350, grossYield: 9.64, totalListings: 449, newListings: 69, avgSqFt: 1440 },
];
