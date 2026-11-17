import {
  EPOCH_AD_UTC_TIMESTAMP,
  MS_PER_DAY,
  MIN_BS_YEAR,
  MAX_BS_YEAR,
  MONTH_NAMES_EN,
  MONTH_NAMES_NE,
  DAY_NAMES_EN,
  DAY_NAMES_NE,
} from "./constants";
import { BS_CALENDAR_DATA, YEAR_OFFSET_DAYS } from "./calendar-data";
import { formatBsDate } from "./format";
import {
  AdDateInput,
  BsDateInput,
  FormatLocale,
  NepaliDateInfo,
} from "./types";
import {
  isValidBsDate,
  padZero,
  parseAdDateInput,
  parseBsDateInput,
  toDevanagari,
} from "./utils";

const TOTAL_SUPPORTED_DAYS = YEAR_OFFSET_DAYS[YEAR_OFFSET_DAYS.length - 1];

/**
 * Creates a rich NepaliDateInfo object with localized names, formatting, and conversion helpers.
 */
function createNepaliDateInfo(
  year: number,
  month: number,
  day: number,
  dayOfWeek: number
): NepaliDateInfo {
  const mIndex = month - 1;
  const dIndex = dayOfWeek;

  return {
    year,
    month,
    day,
    dayOfWeek,
    yearEn: String(year),
    yearNe: toDevanagari(year),
    monthEn: MONTH_NAMES_EN[mIndex],
    monthNe: MONTH_NAMES_NE[mIndex],
    dayOfWeekEn: DAY_NAMES_EN[dIndex],
    dayOfWeekNe: DAY_NAMES_NE[dIndex],

    format(pattern: string = "YYYY-MM-DD", locale: FormatLocale = "en"): string {
      return formatBsDate({ year, month, day, dayOfWeek }, pattern, locale);
    },

    toString(): string {
      return `${year}-${padZero(month)}-${padZero(day)}`;
    },

    toJsDate(): Date {
      return bsToAd({ year, month, day });
    },
  };
}

/**
 * Converts a Gregorian (AD) date to Nepali Bikram Sambat (BS) date.
 *
 * @param date - Can be a JavaScript Date instance, ISO date string ("2024-04-13"), timestamp, or { year, month, day }
 * @returns NepaliDateInfo containing year, month, day, localized strings, and formatting methods.
 *
 * @example
 * ```ts
 * const bs = adToBs(new Date("2024-04-13"));
 * console.log(bs.toString()); // "2081-01-01"
 * console.log(bs.format("YYYY MMMM DD, dddd", "ne")); // "२०८१ बैशाख ०१, शनिबार"
 * ```
 */
export function adToBs(date: AdDateInput = new Date()): NepaliDateInfo {
  const adUtcDate = parseAdDateInput(date);
  const targetUtcMs = adUtcDate.getTime();

  const daysDiff = Math.round((targetUtcMs - EPOCH_AD_UTC_TIMESTAMP) / MS_PER_DAY);

  if (daysDiff < 0 || daysDiff >= TOTAL_SUPPORTED_DAYS) {
    throw new RangeError(
      `AD Date "${adUtcDate.toISOString().split("T")[0]}" is out of supported range (1913-04-13 AD to 2043-04-13 AD).`
    );
  }

  // Find the BS year using cumulative offsets
  let curYear = MIN_BS_YEAR;
  for (let y = MIN_BS_YEAR; y <= MAX_BS_YEAR; y++) {
    const nextOffset = YEAR_OFFSET_DAYS[y - MIN_BS_YEAR + 1];
    if (daysDiff < nextOffset) {
      curYear = y;
      break;
    }
  }

  let remainingDays = daysDiff - YEAR_OFFSET_DAYS[curYear - MIN_BS_YEAR];

  // Find the BS month
  const monthLengths = BS_CALENDAR_DATA[curYear];
  let curMonth = 1;
  for (let m = 0; m < 12; m++) {
    const daysInThisMonth = monthLengths[m];
    if (remainingDays < daysInThisMonth) {
      curMonth = m + 1;
      break;
    }
    remainingDays -= daysInThisMonth;
  }

  const curDay = remainingDays + 1;
  const dayOfWeek = adUtcDate.getUTCDay();

  return createNepaliDateInfo(curYear, curMonth, curDay, dayOfWeek);
}

/**
 * Converts a Nepali Bikram Sambat (BS) date to a JavaScript Date object (Gregorian AD).
 *
 * @param input - Can be a string ("2081-01-01", "२०८१-०१-०१"), object ({ year: 2081, month: 1, day: 1 }), tuple, or year number.
 * @param month - Optional 1-indexed month number if input is year.
 * @param day - Optional day number if input is year.
 * @returns Native JavaScript Date instance representing the Gregorian date in UTC midnight.
 *
 * @example
 * ```ts
 * const adDate = bsToAd("2081-01-01");
 * console.log(adDate.toISOString()); // "2024-04-13T00:00:00.000Z"
 *
 * const adDate2 = bsToAd(2081, 1, 1);
 * ```
 */
export function bsToAd(
  input: BsDateInput | number,
  month?: number,
  day?: number
): Date {
  const { year: bsYear, month: bsMonth, day: bsDay } = parseBsDateInput(input, month, day);

  if (!isValidBsDate(bsYear, bsMonth, bsDay)) {
    throw new RangeError(
      `Invalid BS Date: ${bsYear}-${padZero(bsMonth)}-${padZero(bsDay)}. ` +
      `Ensure year is between ${MIN_BS_YEAR} and ${MAX_BS_YEAR}, month is 1-12, and day exists in that month.`
    );
  }

  let days = YEAR_OFFSET_DAYS[bsYear - MIN_BS_YEAR];
  const monthLengths = BS_CALENDAR_DATA[bsYear];

  for (let m = 0; m < bsMonth - 1; m++) {
    days += monthLengths[m];
  }

  days += bsDay - 1;

  const targetUtcMs = EPOCH_AD_UTC_TIMESTAMP + days * MS_PER_DAY;
  return new Date(targetUtcMs);
}

/**
 * Returns today's current date in Bikram Sambat (BS).
 */
export function getCurrentBsDate(): NepaliDateInfo {
  return adToBs(new Date());
}

/**
 * Adds a given number of days to a Nepali (BS) date.
 *
 * @param bsDate - Starting BS date
 * @param days - Number of days to add (can be negative)
 * @returns New NepaliDateInfo
 */
export function addDays(bsDate: BsDateInput, days: number): NepaliDateInfo {
  const adDate = bsToAd(bsDate);
  const shiftedMs = adDate.getTime() + days * MS_PER_DAY;
  return adToBs(new Date(shiftedMs));
}

/**
 * Subtracts a given number of days from a Nepali (BS) date.
 *
 * @param bsDate - Starting BS date
 * @param days - Number of days to subtract
 * @returns New NepaliDateInfo
 */
export function subDays(bsDate: BsDateInput, days: number): NepaliDateInfo {
  return addDays(bsDate, -days);
}

/**
 * Calculates the difference in full days between two BS dates (date1 - date2).
 *
 * @param date1 - First BS date
 * @param date2 - Second BS date
 * @returns Number of days (positive if date1 > date2, negative if date1 < date2)
 */
export function diffInDays(date1: BsDateInput, date2: BsDateInput): number {
  const ad1 = bsToAd(date1);
  const ad2 = bsToAd(date2);
  return Math.round((ad1.getTime() - ad2.getTime()) / MS_PER_DAY);
}

