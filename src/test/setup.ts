// The UI picks its language from `navigator.language` until the user chooses
// one. Tests assert the English text, so pin the detected language; otherwise
// they would fail on machines whose OS language is not English.
//
// Node before 21 has no global `navigator`; there the language already falls
// back to English, so there is nothing to pin.
if (typeof globalThis.navigator === "object" && globalThis.navigator) {
  Object.defineProperty(globalThis.navigator, "language", {
    value: "en-US",
    configurable: true,
  });
}
