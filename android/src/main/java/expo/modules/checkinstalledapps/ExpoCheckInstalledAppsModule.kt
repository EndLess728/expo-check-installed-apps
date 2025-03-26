package expo.modules.checkinstalledapps

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.pm.PackageManager
import expo.modules.kotlin.Promise

class ExpoCheckInstalledAppsModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoCheckInstalledApps')` in JavaScript.
    Name("ExpoCheckInstalledApps")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! I am android👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent(
        "onChange", mapOf(
          "value" to value
        )
      )
    }

    // An asynchronous function that takes a list of package names and returns their installation status.
    AsyncFunction("checkAppsInstalled") { packageNames: Array<String>, promise: Promise ->
      // Call the function to check installed apps and return the result
      val result = checkAppsInstalled(packageNames)
      promise.resolve(result)
    }

    // A synchronous function that takes a list of package names and returns their installation status.
    Function("checkAppsInstalledSync") { packageNames: Array<String> ->
      // Call the function to check installed apps and return the result
      checkAppsInstalled(packageNames)
    }
  }

  private val context
    get() = requireNotNull(appContext.reactContext)

  // Function to check if multiple apps are installed and resolve the promise with the result
  private fun checkAppsInstalled(packageNames: Array<String>): MutableMap<String, Boolean> {
    val pm: PackageManager = context.packageManager
    val result = mutableMapOf<String, Boolean>()

    // Iterate through the package names and check if each app is installed
    for (packageName in packageNames) {
      try {
        pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES)
        result[packageName] = true // App is installed
      } catch (e: PackageManager.NameNotFoundException) {
        result[packageName] = false // App is not installed
      }
    }

    return result;
  }
}
