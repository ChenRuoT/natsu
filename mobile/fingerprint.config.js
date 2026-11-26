/** @type {import('@expo/fingerprint').Config} */
module.exports = {
  // Native folders and compiled libraries are regenerated on EAS. Hash their
  // source inputs so local OTA publishing matches a clean cloud build.
  ignorePaths: [
    "ios",
    "ios/**/*",
    "android",
    "android/**/*",
    "modules/natsu-link/ios/*.xcframework",
    "modules/natsu-link/ios/*.xcframework/**/*",
    "modules/natsu-link/android/src/main/jniLibs",
    "modules/natsu-link/android/src/main/jniLibs/**/*",
  ],
  extraSources: [
    { type: "file", filePath: "../Cargo.toml", reasons: ["natsuRust"] },
    { type: "file", filePath: "../Cargo.lock", reasons: ["natsuRust"] },
    {
      type: "dir",
      filePath: "../crates/mobile-link",
      reasons: ["natsuRust"],
    },
    {
      type: "file",
      filePath: "scripts/build-native-link.mjs",
      reasons: ["natsuRust"],
    },
    {
      type: "file",
      filePath: "scripts/eas-build-pre-install.mjs",
      reasons: ["natsuRust"],
    },
  ],
};
