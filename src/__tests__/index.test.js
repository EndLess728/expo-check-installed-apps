const mockCheckInstalledApps = jest.fn();

jest.mock("../ExpoCheckInstalledAppsModule", () => ({
  __esModule: true,
  default: {
    checkInstalledApps: mockCheckInstalledApps,
  },
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
}));

const { Platform } = require("react-native");

const { checkInstalledApps } = require("../index");

describe("checkInstalledApps", () => {
  beforeEach(() => {
    mockCheckInstalledApps.mockReset();
    mockCheckInstalledApps.mockResolvedValue({ "com.android.chrome": true });
    Platform.OS = "android";
  });

  it("normalizes inputs before calling native code", async () => {
    await checkInstalledApps([" com.android.chrome ", "com.android.chrome"]);

    expect(mockCheckInstalledApps).toHaveBeenCalledWith(["com.android.chrome"]);
  });

  it("returns an empty object without calling native code for empty input", async () => {
    await expect(checkInstalledApps([])).resolves.toEqual({});
    expect(mockCheckInstalledApps).not.toHaveBeenCalled();
  });

  it("normalizes iOS schemes before calling native code", async () => {
    Platform.OS = "ios";

    await checkInstalledApps(["fb://", "fb"]);

    expect(mockCheckInstalledApps).toHaveBeenCalledWith(["fb"]);
  });
});
