package expo.modules.natsulink

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NatsuLinkModule : Module() {
  companion object { init { System.loadLibrary("natsu_mobile_link") } }
  private external fun nativeCall(input: String): String
  override fun definition() = ModuleDefinition {
    Name("NatsuLink")
    AsyncFunction("execute") { input: String -> nativeCall(input) }
  }
}
