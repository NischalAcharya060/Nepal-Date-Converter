export type FormatLocale = "en" | "ne";

export interface BsDateObject {
  year: number;
  month: number; // 1-12
  day: number;   // 1-32
}

export type BsDateInput =
  | string
  | BsDateObject
  | [number, number, number];

export type AdDateInput =
  | Date
  | string
  | number
  | { year: number; month: number; day: number };

export interface NepaliDateInfo {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  yearEn: string;
  yearNe: string;
  monthEn: string;
  monthNe: string;
  dayOfWeekEn: string;
  dayOfWeekNe: string;
  format: (pattern?: string, locale?: FormatLocale) => string;
  toString: () => string;
  toJsDate: () => Date;
}

export interface AdDateInfo {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  date: Date;
  toString: () => string;
}
