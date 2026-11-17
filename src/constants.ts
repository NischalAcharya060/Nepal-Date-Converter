export const MIN_BS_YEAR = 1970;
export const MAX_BS_YEAR = 2099;

export const EPOCH_BS_YEAR = 1970;
export const EPOCH_BS_MONTH = 1;
export const EPOCH_BS_DAY = 1;

// 1970-01-01 BS corresponds to 1913-04-13 AD
export const EPOCH_AD_YEAR = 1913;
export const EPOCH_AD_MONTH = 4; // April (1-indexed)
export const EPOCH_AD_DAY = 13;

export const EPOCH_AD_UTC_TIMESTAMP = Date.UTC(1913, 3, 13); // UTC milliseconds (1913-04-13)
export const MS_PER_DAY = 86_400_000;

export const MONTH_NAMES_EN = [
  "Baishakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

export const MONTH_NAMES_EN_SHORT = [
  "Bai",
  "Jes",
  "Ash",
  "Shr",
  "Bhd",
  "Ash",
  "Kar",
  "Man",
  "Pou",
  "Mag",
  "Fal",
  "Cha",
] as const;

export const MONTH_NAMES_NE = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुन",
  "चैत",
] as const;

export const DAY_NAMES_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_NAMES_EN_SHORT = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const DAY_NAMES_NE = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहीबार",
  "शुक्रबार",
  "शनिबार",
] as const;

export const DAY_NAMES_NE_SHORT = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिही",
  "शुक्र",
  "शनि",
] as const;

export const DEVANAGARI_DIGITS = [
  "०",
  "१",
  "२",
  "३",
  "४",
  "५",
  "६",
  "७",
  "८",
  "९",
] as const;
