// Core converters
export {
  adToBs,
  bsToAd,
  getCurrentBsDate,
  addDays,
  subDays,
  diffInDays,
} from "./converter";

// Formatter
export { formatBsDate, type FormatDateSource } from "./format";

// Calendar data & constants
export {
  MIN_BS_YEAR,
  MAX_BS_YEAR,
  EPOCH_BS_YEAR,
  EPOCH_BS_MONTH,
  EPOCH_BS_DAY,
  EPOCH_AD_YEAR,
  EPOCH_AD_MONTH,
  EPOCH_AD_DAY,
  MONTH_NAMES_EN,
  MONTH_NAMES_EN_SHORT,
  MONTH_NAMES_NE,
  DAY_NAMES_EN,
  DAY_NAMES_EN_SHORT,
  DAY_NAMES_NE,
  DAY_NAMES_NE_SHORT,
  DEVANAGARI_DIGITS,
} from "./constants";

export { BS_CALENDAR_DATA } from "./calendar-data";

// Utilities
export {
  getDaysInBsMonth,
  isValidBsDate,
  toDevanagari,
  toEnglishDigits,
  padZero,
  parseBsDateInput,
  parseAdDateInput,
} from "./utils";

// Types
export type {
  BsDateInput,
  BsDateObject,
  AdDateInput,
  NepaliDateInfo,
  AdDateInfo,
  FormatLocale,
} from "./types";

// Default export bundle
import {
  adToBs,
  bsToAd,
  getCurrentBsDate,
  addDays,
  subDays,
  diffInDays,
} from "./converter";
import { formatBsDate } from "./format";
import {
  getDaysInBsMonth,
  isValidBsDate,
  toDevanagari,
  toEnglishDigits,
} from "./utils";

const nepalDateConverter = {
  adToBs,
  bsToAd,
  getCurrentBsDate,
  addDays,
  subDays,
  diffInDays,
  format: formatBsDate,
  getDaysInBsMonth,
  isValidBsDate,
  toDevanagari,
  toEnglishDigits,
};

export default nepalDateConverter;
