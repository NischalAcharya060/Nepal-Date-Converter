import test from "node:test";
import assert from "node:assert/strict";

// We test against the compiled ESM bundle in dist
import nepalDate, {
  adToBs,
  bsToAd,
  getCurrentBsDate,
  addDays,
  subDays,
  diffInDays,
  formatBsDate,
  getDaysInBsMonth,
  isValidBsDate,
  toDevanagari,
  toEnglishDigits,
} from "../dist/index.mjs";

test("Conversion: AD to BS accuracy", () => {
  // Historical epoch: 1913-04-13 -> 1970-01-01 BS
  const epochBs = adToBs("1913-04-13");
  assert.equal(epochBs.year, 1970);
  assert.equal(epochBs.month, 1);
  assert.equal(epochBs.day, 1);

  // Modern New Year 2081 BS (April 13, 2024)
  const ny2081 = adToBs("2024-04-13");
  assert.equal(ny2081.year, 2081);
  assert.equal(ny2081.month, 1);
  assert.equal(ny2081.day, 1);
  assert.equal(ny2081.dayOfWeek, 6); // Saturday
  assert.equal(ny2081.dayOfWeekEn, "Saturday");
  assert.equal(ny2081.dayOfWeekNe, "शनिबार");

  // Previous day: 2024-04-12 -> 2080-12-30 BS (last day of 2080 BS has 30 days)
  const end2080 = adToBs("2024-04-12");
  assert.equal(end2080.year, 2080);
  assert.equal(end2080.month, 12);
  assert.equal(end2080.day, 30);
});

test("Conversion: BS to AD accuracy", () => {
  // Epoch: 1970-01-01 BS -> 1913-04-13 AD
  const epochAd = bsToAd("1970-01-01");
  assert.equal(epochAd.toISOString().split("T")[0], "1913-04-13");

  // Modern 2081-01-01 BS -> 2024-04-13 AD
  const ad2081 = bsToAd("2081-01-01");
  assert.equal(ad2081.toISOString().split("T")[0], "2024-04-13");

  // Multiple input formats
  const fromObj = bsToAd({ year: 2081, month: 1, day: 1 });
  assert.equal(fromObj.toISOString().split("T")[0], "2024-04-13");

  const fromArgs = bsToAd(2081, 1, 1);
  assert.equal(fromArgs.toISOString().split("T")[0], "2024-04-13");

  const fromTuple = bsToAd([2081, 1, 1]);
  assert.equal(fromTuple.toISOString().split("T")[0], "2024-04-13");

  // Devanagari string input
  const fromDev = bsToAd("२०८१-०१-०१");
  assert.equal(fromDev.toISOString().split("T")[0], "2024-04-13");
});

test("Conversion: Round-trip consistency", () => {
  const testDates = [
    "1970-01-01",
    "1990-05-15",
    "2000-01-01",
    "2050-06-20",
    "2072-01-12",
    "2080-12-30",
    "2081-01-01",
    "2090-10-15",
    "2099-12-30",
  ];

  for (const bsStr of testDates) {
    const ad = bsToAd(bsStr);
    const backToBs = adToBs(ad);
    assert.equal(backToBs.toString(), bsStr);
  }
});

test("Formatting: English and Nepali (Devanagari)", () => {
  const bs = adToBs("2024-04-13"); // 2081-01-01 (Saturday)

  // Default format
  assert.equal(bs.format(), "2081-01-01");
  assert.equal(bs.toString(), "2081-01-01");

  // Custom English tokens
  assert.equal(bs.format("YYYY/MM/DD"), "2081/01/01");
  assert.equal(bs.format("MMMM DD, YYYY (dddd)"), "Baishakh 01, 2081 (Saturday)");
  assert.equal(bs.format("D MMM YY"), "1 Bai 81");

  // Localized Nepali tokens
  assert.equal(bs.format("YYYY-MM-DD", "ne"), "२०८१-०१-०१");
  assert.equal(bs.format("YYYY MMMM DD, dddd", "ne"), "२०८१ बैशाख ०१, शनिबार");
  assert.equal(bs.format("D MMMM YYYY", "ne"), "१ बैशाख २०८१");

  // Escaping square brackets
  assert.equal(
    bs.format("[Miti:] YYYY-MM-DD [in Nepal]", "en"),
    "Miti: 2081-01-01 in Nepal"
  );
});

test("Date Math: addDays, subDays, and diffInDays", () => {
  // Adding days within month
  const plus10 = addDays("2081-01-01", 10);
  assert.equal(plus10.toString(), "2081-01-11");

  // Adding across year boundary: 2080-12-30 + 1 day = 2081-01-01
  const nextYear = addDays("2080-12-30", 1);
  assert.equal(nextYear.toString(), "2081-01-01");

  // Subtracting across year boundary
  const prevYear = subDays("2081-01-01", 1);
  assert.equal(prevYear.toString(), "2080-12-30");

  // Difference in days
  assert.equal(diffInDays("2081-01-11", "2081-01-01"), 10);
  assert.equal(diffInDays("2081-01-01", "2081-01-11"), -10);
  assert.equal(diffInDays("2081-01-01", "2081-01-01"), 0);
});

test("Utilities: Days in month and validation", () => {
  // 2081 Baishakh has 31 days
  assert.equal(getDaysInBsMonth(2081, 1), 31);
  assert.equal(isValidBsDate(2081, 1, 31), true);
  assert.equal(isValidBsDate(2081, 1, 32), false);

  // Invalid months or days
  assert.equal(isValidBsDate(2081, 0, 1), false);
  assert.equal(isValidBsDate(2081, 13, 1), false);
  assert.equal(isValidBsDate(2081, 1, 0), false);
  assert.equal(isValidBsDate(2150, 1, 1), false); // Out of range
});

test("Digit conversion utilities", () => {
  assert.equal(toDevanagari(2081), "२०८१");
  assert.equal(toDevanagari("2081-01-15"), "२०८१-०१-१५");
  assert.equal(toEnglishDigits("२०८१-०१-१५"), "2081-01-15");
});

test("Error handling for out-of-range & invalid formats", () => {
  assert.throws(() => bsToAd("2081-01-35"), /Invalid BS Date/);
  assert.throws(() => bsToAd("invalid-date"), /Invalid BS date string/);
  assert.throws(() => adToBs("1800-01-01"), /out of supported range/);
  assert.throws(() => getDaysInBsMonth(2150, 1), /out of supported range/);
});

test("Default export contains all primary methods", () => {
  assert.equal(typeof nepalDate.adToBs, "function");
  assert.equal(typeof nepalDate.bsToAd, "function");
  assert.equal(typeof nepalDate.getCurrentBsDate, "function");
  assert.equal(typeof nepalDate.addDays, "function");
  assert.equal(typeof nepalDate.subDays, "function");
  assert.equal(typeof nepalDate.diffInDays, "function");
  assert.equal(typeof nepalDate.format, "function");
  assert.equal(typeof nepalDate.isValidBsDate, "function");
});
