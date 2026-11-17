const test = require("node:test");
const assert = require("node:assert/strict");
const { adToBs, bsToAd, toDevanagari } = require("../dist/index.cjs");

test("CommonJS: require() and functions work", () => {
  const bs = adToBs("2024-04-13");
  assert.equal(bs.toString(), "2081-01-01");

  const ad = bsToAd("2081-01-01");
  assert.equal(ad.toISOString().split("T")[0], "2024-04-13");

  assert.equal(toDevanagari(2081), "२०८१");
});
