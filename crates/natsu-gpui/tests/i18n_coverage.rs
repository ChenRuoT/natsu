//! Every English text the UI passes to `tr` / `tr_fmt` needs a Chinese entry;
//! otherwise it silently stays English in the Chinese interface.

use std::{fs, path::Path};

fn rust_files(dir: &Path, out: &mut Vec<std::path::PathBuf>) {
    for entry in fs::read_dir(dir).expect("read source directory") {
        let path = entry.expect("directory entry").path();
        if path.is_dir() {
            rust_files(&path, out);
        } else if path.extension().is_some_and(|ext| ext == "rs") {
            out.push(path);
        }
    }
}

/// Resolves the escapes a Rust string literal can carry in UI text.
fn unescape(literal: &str) -> String {
    let mut out = String::new();
    let mut chars = literal.chars();
    while let Some(c) = chars.next() {
        if c != '\\' {
            out.push(c);
            continue;
        }
        match chars.next() {
            Some('n') => out.push('\n'),
            Some('t') => out.push('\t'),
            Some('u') => {
                let hex: String = chars.by_ref().skip(1).take_while(|c| *c != '}').collect();
                if let Some(ch) = u32::from_str_radix(&hex, 16).ok().and_then(char::from_u32) {
                    out.push(ch);
                }
            }
            Some(other) => out.push(other),
            None => {}
        }
    }
    out
}

/// The first string literal after each `tr(` / `tr_fmt(` call in `source`.
fn translated_literals(source: &str) -> Vec<String> {
    let mut found = Vec::new();
    for marker in ["tr(", "tr_fmt("] {
        let mut rest = source;
        while let Some(at) = rest.find(marker) {
            let before = rest[..at].chars().next_back();
            rest = &rest[at + marker.len()..];
            // Skip `fn tr(`, `str(`, `entr(` and similar longer names.
            if before.is_some_and(|c| c.is_alphanumeric() || c == '_') {
                continue;
            }
            let trimmed = rest.trim_start();
            if !trimmed.starts_with('"') {
                continue;
            }
            let body = &trimmed[1..];
            let mut end = 0;
            let mut escaped = false;
            for (index, c) in body.char_indices() {
                if escaped {
                    escaped = false;
                } else if c == '\\' {
                    escaped = true;
                } else if c == '"' {
                    end = index;
                    break;
                }
            }
            found.push(unescape(&body[..end]));
        }
    }
    found
}

/// The file up to its test module: `#[cfg(test)]` on a single item (a helper
/// or an import) does not end the UI code, only `#[cfg(test)] mod ...` does.
fn ui_source(source: &str) -> &str {
    let mut from = 0;
    while let Some(at) = source[from..].find("#[cfg(test)]") {
        let start = from + at;
        let after = source[start + "#[cfg(test)]".len()..].trim_start();
        // `#[cfg(test)] mod name;` only declares a test file; an inline
        // `mod name { ... }` is the test module that ends the UI code.
        if after.starts_with("mod ") {
            let header = &after[..after.find(['{', ';']).unwrap_or(after.len())];
            let inline = after[header.len()..].starts_with('{');
            if inline {
                return &source[..start];
            }
        }
        from = start + 1;
    }
    source
}

#[test]
fn every_translated_text_has_a_chinese_entry() {
    let mut files = Vec::new();
    rust_files(
        &Path::new(env!("CARGO_MANIFEST_DIR")).join("src"),
        &mut files,
    );
    let mut missing = Vec::new();
    let mut total = 0;
    for file in files {
        let source = fs::read_to_string(&file).expect("read source");
        // Test modules are not UI.
        let source = ui_source(&source);
        for text in translated_literals(source) {
            total += 1;
            if !natsu_core::i18n::has_chinese(&text) {
                missing.push(format!("{}: {text:?}", file.display()));
            }
        }
        // `tr(SOME_CONST)`: every string literal in the constant needs an entry
        // (platform variants such as "(⌘`)" and "(Ctrl+`)" are separate texts).
        for (at, _) in source.match_indices("tr(") {
            if source[..at]
                .chars()
                .next_back()
                .is_some_and(|c| c.is_alphanumeric() || c == '_')
            {
                continue;
            }
            let name: String = source[at + 3..]
                .chars()
                .take_while(|c| c.is_ascii_uppercase() || c.is_ascii_digit() || *c == '_')
                .collect();
            if name.len() < 2 || !source[at + 3 + name.len()..].starts_with(')') {
                continue;
            }
            let Some(def) = source.find(&format!("const {name}:")) else {
                continue;
            };
            let initializer =
                &source[def..source[def..].find(";\n").map_or(source.len(), |e| def + e)];
            let mut rest = initializer.split_once('=').map_or("", |(_, value)| value);
            while let Some((_, after)) = rest.split_once('"') {
                let Some((text, next)) = after.split_once('"') else {
                    break;
                };
                total += 1;
                // `cfg!(target_os = "macos")` names a platform, not UI text.
                let platform = matches!(text, "macos" | "windows" | "linux");
                if !text.is_empty() && !platform && !natsu_core::i18n::has_chinese(&unescape(text))
                {
                    missing.push(format!("{}: const {name} = {text:?}", file.display()));
                }
                rest = next;
            }
        }
        // `tr_ctx("context", "text")`: the pair needs its own entry.
        for (at, _) in source.match_indices("tr_ctx(\"") {
            let rest = &source[at + "tr_ctx(\"".len()..];
            let Some((context, rest)) = rest.split_once('"') else {
                continue;
            };
            let Some((_, rest)) = rest.split_once('"') else {
                continue;
            };
            let Some((text, _)) = rest.split_once('"') else {
                continue;
            };
            total += 1;
            if !natsu_core::i18n::has_chinese_ctx(context, text) {
                missing.push(format!("{}: ({context:?}, {text:?})", file.display()));
            }
        }
    }
    assert!(total > 500, "expected many translated texts, found {total}");
    assert!(
        missing.is_empty(),
        "no Chinese entry for:\n{}",
        missing.join("\n")
    );
}
