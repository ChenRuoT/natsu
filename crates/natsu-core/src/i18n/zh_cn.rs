//! Simplified Chinese text, keyed by the exact English text passed to `tr`.
//! One file per area so screens can be translated independently. Follow
//! `src/shared/i18n/glossary.md` for terminology.

mod changes;
mod contextual;
mod conversation;
mod monos;
mod settings;
mod shell;
mod workspace;

/// Text whose translation depends on where the word is used.
pub(super) const CONTEXTUAL: &[(&str, &str, &str)] = contextual::ENTRIES;

pub(super) const TABLES: &[&[(&str, &str)]] = &[
    settings::ENTRIES,
    workspace::ENTRIES,
    monos::ENTRIES,
    shell::ENTRIES,
    conversation::ENTRIES,
    changes::ENTRIES,
];
