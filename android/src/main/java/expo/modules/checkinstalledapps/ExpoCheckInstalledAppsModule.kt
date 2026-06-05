package expo.modules.checkinstalledapps

import android.content.pm.PackageManager
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoCheckInstalledAppsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoCheckInstalledApps")

    AsyncFunction("checkInstalledApps") { packageNames: List<String> ->
      val packageManager = requireNotNull(appContext.reactContext).packageManager
      packageNames.associateWith { packageName ->
        isPackageInstalled(packageManager, packageName)
      }
    }
  }

  private fun isPackageInstalled(packageManager: PackageManager, packageName: String): Boolean {
    return try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        packageManager.getPackageInfo(packageName, PackageManager.PackageInfoFlags.of(0))
      } else {
        @Suppress("DEPRECATION")
        packageManager.getPackageInfo(packageName, 0)
      }

      true
    } catch (_: PackageManager.NameNotFoundException) {
      false
    }
  }
}
