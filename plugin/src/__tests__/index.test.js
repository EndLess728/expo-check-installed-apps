const {
  applyAndroidQueries,
  applyIosSchemes,
  normalizeAndroidPackageNames,
  normalizeIosSchemes,
} = require("../index");

describe("plugin helpers", () => {
  it("deduplicates Android package names", () => {
    expect(
      normalizeAndroidPackageNames([" com.android.chrome ", "com.android.chrome"])
    ).toEqual(["com.android.chrome"]);
  });

  it("normalizes iOS schemes", () => {
    expect(normalizeIosSchemes(["fb://", " twitter ", "fb"])).toEqual(["fb", "twitter"]);
  });

  it("rejects invalid iOS schemes", () => {
    expect(() => normalizeIosSchemes(["://broken"])).toThrow("Invalid iOS URL scheme");
  });

  it("adds Android queries without removing existing ones", () => {
    const manifest = {
      queries: [
        {
          package: [{ $: { "android:name": "com.existing.app" } }],
        },
      ],
    };

    applyAndroidQueries(manifest, ["com.new.app"]);

    expect(manifest.queries[0].package).toEqual([
      { $: { "android:name": "com.existing.app" } },
      { $: { "android:name": "com.new.app" } },
    ]);
  });

  it("adds normalized iOS schemes without duplicates", () => {
    const plist = {
      LSApplicationQueriesSchemes: ["twitter"],
    };

    applyIosSchemes(plist, ["fb://", "twitter"]);

    expect(plist.LSApplicationQueriesSchemes).toEqual(["twitter", "fb"]);
  });
});
