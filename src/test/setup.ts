// The UI picks its language from `navigator.language` until the user chooses
// one. Tests assert the English text, so pin the detected language; otherwise
// they would fail on machines whose OS language is not English.
Object.defineProperty(globalThis.navigator, "language", {
  value: "en-US",
  configurable: true,
});
