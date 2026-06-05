jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
}));

const { Platform } = require("react-native");

const { normalizeTargets } = require("../normalizeTargets");

describe("normalizeTargets", () => {
  afterEach(() => {
    Platform.OS = "android";
  });

  it("deduplicates and trims Android package names", () => {
    Platform.OS = "android";

    expect(
      normalizeTargets([" com.android.chrome ", "com.android.chrome"]),
    ).toEqual(["com.android.chrome"]);
  });

  it("normalizes iOS URL schemes", () => {
    Platform.OS = "ios";

    expect(normalizeTargets(["fb://", " twitter ", "fb"])).toEqual([
      "fb",
      "twitter",
    ]);
  });

  it("rejects empty targets", () => {
    expect(() => normalizeTargets([" "])).toThrow("cannot be empty");
  });

  it("rejects invalid Android package names", () => {
    Platform.OS = "android";

    expect(() => normalizeTargets(["not a package"])).toThrow(
      "Invalid Android package name",
    );
  });

  it("rejects invalid iOS schemes", () => {
    Platform.OS = "ios";

    expect(() => normalizeTargets(["://broken"])).toThrow(
      "Invalid iOS URL scheme",
    );
  });
});
