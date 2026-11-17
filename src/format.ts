import {
  MONTH_NAMES_EN,
  MONTH_NAMES_EN_SHORT,
  MONTH_NAMES_NE,
  DAY_NAMES_EN,
  DAY_NAMES_EN_SHORT,
  DAY_NAMES_NE,
  DAY_NAMES_NE_SHORT,
} from "./constants";
import { FormatLocale } from "./types";
import { padZero, toDevanagari } from "./utils";

export interface FormatDateSource {
  year: number;
  month: number;
  day: number;
  dayOfWeek?: number;
}

/**
 * Formats a Nepali (BS) date object using customizable tokens.
 *
 * Supported Tokens:
 * - `YYYY`: 4-digit year (e.g. 2081 / २०८१)
 * - `YY`: 2-digit year (e.g. 81 / ८१)
 * - `MMMM`: Full month name (e.g. Baishakh / बैशाख)
 * - `MMM`: Short month name (e.g. Bai / बैशाख)
 * - `MM`: 2-digit month (01-12 / ०१-१२)
 * - `M`: 1-digit month (1-12 / १-१२)
 * - `DD`: 2-digit day (01-32 / ०१-३२)
 * - `D`: 1-digit day (1-32 / १-३२)
 * - `dddd`: Full day of week (e.g. Sunday / आइतबार)
 * - `ddd`: Short day of week (e.g. Sun / आइत)
 * - `d`: Day index 0-6 (0 = Sunday)
 * - `[...]`: Text inside square brackets is preserved without token replacement
 */
export function formatBsDate(
  date: FormatDateSource,
  pattern: string = "YYYY-MM-DD",
  locale: FormatLocale = "en"
): string {
  const { year, month, day, dayOfWeek = 0 } = date;
  const isNe = locale === "ne";

  // Pre-calculate localized values
  const yyyy = isNe ? toDevanagari(year) : String(year);
  const yy = isNe ? toDevanagari(padZero(year % 100)) : padZero(year % 100);

  const mIndex = Math.max(0, Math.min(11, month - 1));
  const mmmm = isNe ? MONTH_NAMES_NE[mIndex] : MONTH_NAMES_EN[mIndex];
  const mmm = isNe ? MONTH_NAMES_NE[mIndex] : MONTH_NAMES_EN_SHORT[mIndex];
  const mm = isNe ? toDevanagari(padZero(month)) : padZero(month);
  const m = isNe ? toDevanagari(month) : String(month);

  const dd = isNe ? toDevanagari(padZero(day)) : padZero(day);
  const d = isNe ? toDevanagari(day) : String(day);

  const dIndex = Math.max(0, Math.min(6, dayOfWeek));
  const dddd = isNe ? DAY_NAMES_NE[dIndex] : DAY_NAMES_EN[dIndex];
  const ddd = isNe ? DAY_NAMES_NE_SHORT[dIndex] : DAY_NAMES_EN_SHORT[dIndex];
  const dayIdx = isNe ? toDevanagari(dIndex) : String(dIndex);

  // Escaped strings placeholder mapping using null-byte delimiters
  const escapes: string[] = [];
  const withEscapesReplaced = pattern.replace(/\[([^\]]+)\]/g, (_, text) => {
    escapes.push(text);
    return `\u0000${escapes.length - 1}\u0000`;
  });

  const replaced = withEscapesReplaced.replace(
    /(YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|d)/g,
    (match) => {
      switch (match) {
        case "YYYY":
          return yyyy;
        case "YY":
          return yy;
        case "MMMM":
          return mmmm;
        case "MMM":
          return mmm;
        case "MM":
          return mm;
        case "M":
          return m;
        case "DD":
          return dd;
        case "D":
          return d;
        case "dddd":
          return dddd;
        case "ddd":
          return ddd;
        case "d":
          return dayIdx;
        default:
          return match;
      }
    }
  );

  // Restore escaped text
  return replaced.replace(/\u0000(\d+)\u0000/g, (_, idx) => escapes[parseInt(idx, 10)]);
}

