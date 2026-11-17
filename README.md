# nepal-date-converter 🇳🇵

[![npm version](https://img.shields.io/npm/v/nepal-date-converter.svg?color=crimson)](https://www.npmjs.com/package/nepal-date-converter)
[![license](https://img.shields.io/npm/l/nepal-date-converter.svg)](https://github.com/NischalAcharya060/nepal-date-converter/blob/master/LICENSE)
[![types](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.npmjs.com/package/nepal-date-converter)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/nepal-date-converter)

A ultra-fast, accurate, and **zero-dependency** npm package for bi-directional conversion between Nepali **Bikram Sambat (BS)** and Gregorian **(AD)** dates. Includes full **Devanagari script support**, custom date formatting, date arithmetic, and native TypeScript types.

---

## ✨ Features

- ⚡ **Zero Runtime Dependencies**: Ultra lightweight (< 10 KB).
- 🎯 **100% Conversion Accuracy**: Verified month length tables spanning **1970 BS to 2099 BS** (1913 AD to 2043 AD).
- 🇳🇵 **Devanagari & English Localization**: Format dates in Nepali (`२०८१ बैशाख ०१, शनिबार`) or English (`2081 Baishakh 01, Saturday`).
- 🔄 **Flexible Inputs**: Accepts ISO strings (`"2024-04-13"`), Date objects, numbers, tuples (`[2081, 1, 1]`), or Devanagari numerals (`"२०८१-०१-०१"`).
- ➕ **Date Arithmetic**: Built-in `addDays`, `subDays`, and `diffInDays` calculations.
- 📦 **Dual Module Format**: Works seamlessly with both **ESM** (`import`) and **CommonJS** (`require`).
- 🛡️ **Full TypeScript Support**: Includes strictly typed declaration files (`.d.ts`).

---

## 🚀 Installation

```bash
npm install nepal-date-converter
```

Or using Yarn / pnpm:

```bash
yarn add nepal-date-converter
# or
pnpm add nepal-date-converter
```

---

## 📖 Quick Start

### 1. Convert Gregorian (AD) to Nepali (BS)

```typescript
import { adToBs } from "nepal-date-converter";

// From a string or Date object
const bsDate = adToBs("2024-04-13");

console.log(bsDate.toString()); // "2081-01-01"
console.log(bsDate.year);       // 2081
console.log(bsDate.month);      // 1 (Baishakh)
console.log(bsDate.day);        // 1
console.log(bsDate.dayOfWeekEn); // "Saturday"
console.log(bsDate.dayOfWeekNe); // "शनिबार"
```

### 2. Convert Nepali (BS) to Gregorian (AD)

```typescript
import { bsToAd } from "nepal-date-converter";

// Using formatted string
const adDate1 = bsToAd("2081-01-01");
console.log(adDate1.toISOString().split("T")[0]); // "2024-04-13"

// Using numbers (year, month, day)
const adDate2 = bsToAd(2081, 1, 1);

// Using object notation
const adDate3 = bsToAd({ year: 2081, month: 1, day: 1 });

// Using Devanagari digits
const adDate4 = bsToAd("२०८१-०१-०१");
```

---

## 🎨 Date Formatting & Localization

Use `.format()` with customizable tokens and choose between English (`en`) and Nepali (`ne`) locales.

```typescript
import { adToBs } from "nepal-date-converter";

const date = adToBs("2024-04-13");

// English formatting (default)
date.format("YYYY-MM-DD");                 // "2081-01-01"
date.format("MMMM DD, YYYY");             // "Baishakh 01, 2081"
date.format("dddd, MMMM DD, YYYY");       // "Saturday, Baishakh 01, 2081"
date.format("D MMM YY");                  // "1 Bai 81"

// Nepali Devanagari formatting
date.format("YYYY-MM-DD", "ne");          // "२०८१-०१-०१"
date.format("YYYY MMMM DD, dddd", "ne");  // "२०८१ बैशाख ०१, शनिबार"
date.format("D MMMM YYYY", "ne");         // "१ बैशाख २०८१"

// Escaping custom text with square brackets
date.format("[Miti:] YYYY-MM-DD");        // "Miti: 2081-01-01"
```

### Available Tokens

| Token | Description | Example (en) | Example (ne) |
|---|---|---|---|
| `YYYY` | 4-digit year | `2081` | `२०८१` |
| `YY` | 2-digit year | `81` | `८१` |
| `MMMM` | Full month name | `Baishakh` | `बैशाख` |
| `MMM` | Short month name | `Bai` | `बैशाख` |
| `MM` | 2-digit month | `01` | `०१` |
| `M` | 1-digit month | `1` | `१` |
| `DD` | 2-digit day | `05` | `०५` |
| `D` | 1-digit day | `5` | `५` |
| `dddd` | Full weekday name | `Saturday` | `शनिबार` |
| `ddd` | Short weekday name | `Sat` | `शनि` |
| `d` | Day of week index (0-6) | `6` | `६` |
| `[...]` | Escaped literal text | `[Date]` | `Date` |

---

## 🧮 Date Arithmetic & Utilities

### Add & Subtract Days

```typescript
import { addDays, subDays, getCurrentBsDate } from "nepal-date-converter";

// Today in BS
const today = getCurrentBsDate();

// Add 10 days
const future = addDays("2081-01-01", 10);
console.log(future.toString()); // "2081-01-11"

// Subtract 1 day (handles year/month rollovers automatically)
const yesterday = subDays("2081-01-01", 1);
console.log(yesterday.toString()); // "2080-12-30"
```

### Difference Between Dates

```typescript
import { diffInDays } from "nepal-date-converter";

const days = diffInDays("2081-01-11", "2081-01-01");
console.log(days); // 10
```

### Validation & Calendar Lookup

```typescript
import { isValidBsDate, getDaysInBsMonth } from "nepal-date-converter";

// Check if a date is valid
isValidBsDate(2081, 1, 31); // true
isValidBsDate(2081, 1, 32); // false (Baishakh 2081 has 31 days)

// Get total days in a specific BS month
const daysCount = getDaysInBsMonth(2081, 1); // 31
```

### Digit Conversion

```typescript
import { toDevanagari, toEnglishDigits } from "nepal-date-converter";

toDevanagari("2081-01-15");     // "२०८१-०१-१५"
toEnglishDigits("२०८१-०१-१५");  // "2081-01-15"
```

---

## 🛠️ CommonJS Usage

If you are using CommonJS (`require`):

```javascript
const { adToBs, bsToAd } = require("nepal-date-converter");

const bs = adToBs("2024-04-13");
console.log(bs.toString()); // 2081-01-01
```

---

## 📅 Supported Range

- **Bikram Sambat (BS)**: `1970-01-01 BS` to `2099-12-30 BS`
- **Gregorian (AD)**: `1913-04-13 AD` to `2043-04-13 AD`

Dates outside this 130-year span will throw a descriptive `RangeError`.

---

## 🧪 Testing

Run the automated test suite:

```bash
npm test
```

---

## 📄 License

MIT © [Nischal Acharya](https://github.com/NischalAcharya060)
