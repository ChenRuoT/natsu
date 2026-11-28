//! Interface language for the native app.
//!
//! English is the source and the key: call sites pass the English text to
//! [`tr`] and, in Chinese, get the entry from `zh_cn`. Text with values goes
//! through [`tr_fmt`] with `{name}` placeholders, so a translation can reorder
//! them. Text that is sent to a model, stored, or compared never goes through
//! here.
//!
//! The language is chosen once at startup ([`detect_locale`]); it follows the
//! desktop app's choice when that can be read, then the system.

mod zh_cn;

use std::collections::HashMap;
use std::fmt::Display;
use std::sync::atomic::{AtomicU8, Ordering};
use std::sync::OnceLock;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Locale {
    En,
    ZhCn,
}

impl Locale {
    /// Maps a language tag such as `zh-Hans-CN`, `zh_CN.UTF-8` or `en-GB`.
    pub fn from_tag(tag: &str) -> Self {
        if tag
            .trim()
            .trim_matches('"')
            .to_ascii_lowercase()
            .starts_with("zh")
        {
            Self::ZhCn
        } else {
            Self::En
        }
    }
}

static LOCALE: AtomicU8 = AtomicU8::new(0);

pub fn set_locale(locale: Locale) {
    LOCALE.store(locale as u8, Ordering::Relaxed);
}

pub fn locale() -> Locale {
    match LOCALE.load(Ordering::Relaxed) {
        1 => Locale::ZhCn,
        _ => Locale::En,
    }
}

/// The language to start in: `NATSU_LANGUAGE`, then the desktop app's saved
/// choice (`natsu.language`), then the system language.
pub fn detect_locale(desktop_choice: Option<&str>) -> Locale {
    if let Ok(tag) = std::env::var("NATSU_LANGUAGE") {
        if !tag.trim().is_empty() {
            return Locale::from_tag(&tag);
        }
    }
    match desktop_choice {
        Some(tag) => Locale::from_tag(tag),
        None => system_locale(),
    }
}

/// What the language setting resolves to: an explicit language wins, anything
/// else (`system`) means the language the app started in.
fn resolve_preference(preference: &str, startup: Locale) -> Locale {
    match preference {
        "en" => Locale::En,
        "zh-CN" => Locale::ZhCn,
        _ => startup,
    }
}

static STARTUP: OnceLock<Locale> = OnceLock::new();

/// Picks the language for this run (see [`detect_locale`]) and remembers it as
/// what the `system` setting means. Called once at startup.
pub fn init_locale(desktop_choice: Option<&str>) {
    let locale = detect_locale(desktop_choice);
    let _ = STARTUP.set(locale);
    set_locale(locale);
}

/// Applies the Settings language choice: `en`, `zh-CN`, or `system` for the
/// language the app started in. Safe to call on every preference change.
pub fn apply_preference(preference: &str) {
    set_locale(resolve_preference(
        preference,
        STARTUP.get().copied().unwrap_or(Locale::En),
    ));
}

fn system_locale() -> Locale {
    for key in ["LC_ALL", "LC_MESSAGES", "LANG", "LANGUAGE"] {
        if let Ok(value) = std::env::var(key) {
            if !value.trim().is_empty() {
                return Locale::from_tag(&value);
            }
        }
    }
    #[cfg(target_os = "macos")]
    if let Ok(output) = std::process::Command::new("defaults")
        .args(["read", "-g", "AppleLanguages"])
        .output()
    {
        // The first language of `("zh-Hans-CN", "en-CN")` is the preferred one.
        let text = String::from_utf8_lossy(&output.stdout);
        if let Some(first) = text
            .split(|c: char| !(c.is_ascii_alphanumeric() || c == '-'))
            .find(|token| !token.is_empty())
        {
            return Locale::from_tag(first);
        }
    }
    Locale::En
}

fn zh() -> &'static HashMap<&'static str, &'static str> {
    static MAP: OnceLock<HashMap<&'static str, &'static str>> = OnceLock::new();
    MAP.get_or_init(|| {
        zh_cn::TABLES
            .iter()
            .flat_map(|table| table.iter().copied())
            .collect()
    })
}

fn lookup(locale: Locale, text: &'static str) -> &'static str {
    match locale {
        Locale::En => text,
        Locale::ZhCn => zh().get(text).copied().unwrap_or(text),
    }
}

fn zh_contextual() -> &'static HashMap<(&'static str, &'static str), &'static str> {
    static MAP: OnceLock<HashMap<(&'static str, &'static str), &'static str>> = OnceLock::new();
    MAP.get_or_init(|| {
        zh_cn::CONTEXTUAL
            .iter()
            .map(|(context, text, chinese)| ((*context, *text), *chinese))
            .collect()
    })
}

/// Like [`tr`], for a word whose translation depends on where it is used (for
/// example "New" as a diff column heading versus a "New" button). Falls back
/// to the plain translation of `text` when there is no entry for `context`.
pub fn tr_ctx(context: &'static str, text: &'static str) -> &'static str {
    match locale() {
        Locale::En => text,
        Locale::ZhCn => zh_contextual()
            .get(&(context, text))
            .copied()
            .unwrap_or_else(|| lookup(Locale::ZhCn, text)),
    }
}

/// Whether the (context, text) pair has its own Chinese entry.
pub fn has_chinese_ctx(context: &str, text: &str) -> bool {
    zh_contextual().contains_key(&(context, text))
}

/// Whether Chinese text exists for `text`; lets tests catch a missing entry.
pub fn has_chinese(text: &str) -> bool {
    zh().contains_key(text)
}

/// The text in the current language; the English itself when untranslated.
pub fn tr(text: &'static str) -> &'static str {
    lookup(locale(), text)
}

/// Translates `template` and fills its `{name}` placeholders from `args`.
/// Unknown placeholders are left as written.
pub fn tr_fmt(template: &'static str, args: &[(&str, &dyn Display)]) -> String {
    fill(tr(template), args)
}

fn fill(template: &str, args: &[(&str, &dyn Display)]) -> String {
    let mut out = String::with_capacity(template.len() + 16);
    let mut rest = template;
    while let Some(open) = rest.find('{') {
        out.push_str(&rest[..open]);
        let tail = &rest[open + 1..];
        let named = tail.find('}').and_then(|close| {
            let name = &tail[..close];
            args.iter()
                .find(|(arg, _)| *arg == name)
                .map(|(_, value)| (close, value.to_string()))
        });
        match named {
            Some((close, value)) => {
                out.push_str(&value);
                rest = &tail[close + 1..];
            }
            None => {
                out.push('{');
                rest = tail;
            }
        }
    }
    out.push_str(rest);
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn placeholders(text: &str) -> Vec<&str> {
        let mut names: Vec<&str> = text
            .split('{')
            .skip(1)
            .filter_map(|part| part.split_once('}').map(|(name, _)| name))
            .collect();
        names.sort_unstable();
        names
    }

    #[test]
    fn tags_select_chinese() {
        assert_eq!(Locale::from_tag("zh-Hans-CN"), Locale::ZhCn);
        assert_eq!(Locale::from_tag("zh_CN.UTF-8"), Locale::ZhCn);
        assert_eq!(Locale::from_tag("en_US.UTF-8"), Locale::En);
        assert_eq!(Locale::from_tag("C"), Locale::En);
    }

    #[test]
    fn an_explicit_language_beats_the_startup_language() {
        assert_eq!(resolve_preference("en", Locale::ZhCn), Locale::En);
        assert_eq!(resolve_preference("zh-CN", Locale::En), Locale::ZhCn);
        assert_eq!(resolve_preference("system", Locale::ZhCn), Locale::ZhCn);
        assert_eq!(resolve_preference("", Locale::En), Locale::En);
        assert_eq!(resolve_preference("klingon", Locale::ZhCn), Locale::ZhCn);
    }

    #[test]
    fn english_is_the_text_itself() {
        assert_eq!(lookup(Locale::En, "Anything at all"), "Anything at all");
        assert_eq!(lookup(Locale::ZhCn, "Not in any table"), "Not in any table");
    }

    #[test]
    fn tables_have_no_duplicate_keys_and_no_empty_text() {
        let entries: Vec<_> = zh_cn::TABLES.iter().flat_map(|t| t.iter()).collect();
        assert_eq!(entries.len(), zh().len(), "a key appears in two tables");
        for (english, chinese) in entries {
            assert!(!english.trim().is_empty() && !chinese.trim().is_empty());
        }
    }

    #[test]
    fn translations_keep_the_placeholders() {
        for (english, chinese) in zh_cn::TABLES.iter().flat_map(|t| t.iter()) {
            assert_eq!(placeholders(english), placeholders(chinese), "{english}");
        }
    }

    #[test]
    fn contextual_entries_differ_from_the_plain_word() {
        assert!(has_chinese_ctx("diff side", "New"));
        assert_eq!(lookup(Locale::ZhCn, "New"), "新建");
        for (context, text, chinese) in zh_cn::CONTEXTUAL {
            assert!(!context.is_empty() && !text.is_empty() && !chinese.is_empty());
        }
        assert_eq!(
            zh_cn::CONTEXTUAL.len(),
            zh_contextual().len(),
            "a (context, text) pair appears twice"
        );
    }

    #[test]
    fn every_access_mode_label_is_translated() {
        use crate::agent::AccessMode;
        for mode in [
            AccessMode::ReadOnly,
            AccessMode::Supervised,
            AccessMode::AutoAcceptEdits,
            AccessMode::Auto,
            AccessMode::FullAccess,
        ] {
            assert!(
                has_chinese(mode.label()),
                "no Chinese text for {:?}",
                mode.label()
            );
        }
    }

    #[test]
    fn fill_replaces_named_placeholders_once() {
        let count = 3;
        assert_eq!(
            fill(
                "{count} files in {dir}",
                &[("count", &count), ("dir", &"src")]
            ),
            "3 files in src"
        );
        assert_eq!(fill("keep {unknown} here", &[]), "keep {unknown} here");
        // A value that looks like a placeholder is not expanded again.
        assert_eq!(fill("{a}", &[("a", &"{b}"), ("b", &"x")]), "{b}");
    }
}
