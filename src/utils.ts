import {
  DEVANAGARI_DIGITS,
  MIN_BS_YEAR,
  MAX_BS_YEAR,
} from "./constants";
import { BS_CALENDAR_DATA } from "./calendar-data";
import { BsDateInput, BsDateObject, AdDateInput } from "./types";

/**
 * Converts English numbers or digits into Devanagari numerals (e.g. 2081 -> "२०८१")
 */
export function toDevanagari(input: string | number): string {
  const str = String(input);
  return str.replace(/\d/g, (d) => DEVANAGARI_DIGITS[parseInt(d, 10)]);
}

/**
 * Converts Devanagari numerals to standard ASCII English digits (e.g. "२०८१" -> "2081")
 */
export function toEnglishDigits(input: string): string {
  return input.replace(/[०-९]/g, (ch) => {
    const idx = DEVANAGARI_DIGITS.indexOf(ch as (typeof DEVANAGARI_DIGITS)[number]);
    return idx !== -1 ? String(idx) : ch;
  });
}

/**
 * Left-pads a number with zeros
 */
export function padZero(num: number, len: number = 2): string {
  return String(num).padStart(len, "0");
}

/**
 * Returns the exact number of days in a given BS month for a given BS year.
 */
export function getDaysInBsMonth(year: number, month: number): number {
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    throw new RangeError(
      `BS Year ${year} is out of supported range (${MIN_BS_YEAR} - ${MAX_BS_YEAR} BS)`
    );
  }
  if (month < 1 || month > 12) {
    throw new RangeError(`BS Month ${month} must be between 1 and 12`);
  }
  return BS_CALENDAR_DATA[year][month - 1];
}

/**
 * Validates whether a given BS year, month, and day represent a valid calendar date.
 */
export function isValidBsDate(year: number, month: number, day: number): boolean {
  if (
    typeof year !== "number" ||
    typeof month !== "number" ||
    typeof day !== "number" ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
    return false;
  }
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    return false;
  }
  if (month < 1 || month > 12) {
    return false;
  }
  const maxDays = BS_CALENDAR_DATA[year][month - 1];
  return day >= 1 && day <= maxDays;
}

/**
 * Normalizes various BS date input representations into a clean BsDateObject.
 */
export function parseBsDateInput(
  input: BsDateInput | number,
  monthArg?: number,
  dayArg?: number
): BsDateObject {
  // Case 1: Called with 3 numerical arguments: (year, month, day)
  if (typeof input === "number" && monthArg !== undefined && dayArg !== undefined) {
    return { year: input, month: monthArg, day: dayArg };
  }

  // Case 2: Array tuple [year, month, day]
  if (Array.isArray(input)) {
    if (input.length !== 3) {
      throw new TypeError("Date array must contain [year, month, day]");
    }
    return { year: input[0], month: input[1], day: input[2] };
  }

  // Case 3: Object with year, month, day
  if (typeof input === "object" && input !== null) {
    const { year, month, day } = input as BsDateObject;
    if (
      typeof year === "number" &&
      typeof month === "number" &&
      typeof day === "number"
    ) {
      return { year, month, day };
    }
    throw new TypeError(
      "Input object must contain numerical 'year', 'month', and 'day' properties"
    );
  }

  // Case 4: String e.g. "2081-01-01", "2081/1/1", "२०८१-०१-०१"
  if (typeof input === "string") {
    const cleaned = toEnglishDigits(input.trim());
    const match = cleaned.match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})$/);
    if (!match) {
      throw new Error(
        `Invalid BS date string format: "${input}". Expected "YYYY-MM-DD" or "YYYY/MM/DD"`
      );
    }
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    return { year, month, day };
  }

  throw new TypeError(
    `Unsupported BS date input: ${String(input)}. Must be string, object, array, or (year, month, day)`
  );
}

/**
 * Normalizes various AD date inputs into a UTC-normalized Date object.
 */
export function parseAdDateInput(input: AdDateInput): Date {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      throw new TypeError("Provided Date instance is Invalid Date");
    }
    return new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()));
  }

  if (typeof input === "number") {
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) {
      throw new TypeError(`Invalid timestamp: ${input}`);
    }
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  if (typeof input === "string") {
    // If format like "YYYY-MM-DD"
    const match = input.trim().match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})/);
    if (match) {
      const y = parseInt(match[1], 10);
      const m = parseInt(match[2], 10) - 1;
      const d = parseInt(match[3], 10);
      return new Date(Date.UTC(y, m, d));
    }
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Cannot parse AD date string: "${input}"`);
    }
    return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
  }

  if (typeof input === "object" && input !== null) {
    const { year, month, day } = input;
    if (
      typeof year === "number" &&
      typeof month === "number" &&
      typeof day === "number"
    ) {
      return new Date(Date.UTC(year, month - 1, day));
    }
  }

  throw new TypeError(
    `Unsupported AD date input: ${String(input)}. Must be Date, string, timestamp, or { year, month, day }`
  );
}
