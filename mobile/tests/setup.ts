// The app picks its language from the phone (Intl) until the user chooses one.
// Tests assert the English text, so pin the detected language; otherwise they
// would fail on machines whose OS language is not English.
const resolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
Intl.DateTimeFormat.prototype.resolvedOptions = function () {
  return { ...resolvedOptions.call(this), locale: "en-US" };
};
