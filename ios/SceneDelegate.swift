import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?
  var reactNativeDelegate: ReactNativeDelegate?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = (scene as? UIWindowScene) else { return }

    // 1. Initialize dependencies
    let delegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()
    self.reactNativeDelegate = delegate
    
    let factory = RCTReactNativeFactory(delegate: delegate)
    self.reactNativeFactory = factory

    // 2. Create the window using the WindowScene (Mandatory for SceneDelegate)
    let window = UIWindow(windowScene: windowScene)
    self.window = window

    // 3. Start React Native
    // Note: launchOptions are nil here; deep links are handled in openURLContexts
    factory.startReactNative(
      withModuleName: "AstronomyShopRN",
      in: window,
      launchOptions: nil
    )
  }
}
