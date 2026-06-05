import ExpoModulesCore
import UIKit

public class ExpoCheckInstalledAppsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoCheckInstalledApps")

    AsyncFunction("checkInstalledApps") { (schemes: [String]) -> [String: Bool] in
      var result: [String: Bool] = [:]

      for scheme in schemes {
        guard let url = URL(string: "\(scheme)://") else {
          result[scheme] = false
          continue
        }

        result[scheme] = UIApplication.shared.canOpenURL(url)
      }

      return result
    }
  }
}
