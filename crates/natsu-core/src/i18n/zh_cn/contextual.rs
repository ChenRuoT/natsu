//! Chinese text that depends on where the English word is used. `tr_ctx` looks
//! these up by (context, text) before falling back to the plain table.

pub(super) const ENTRIES: &[(&str, &str, &str)] = &[
    // The old and new sides of a diff, as column headings.
    ("diff side", "Old", "旧"),
    ("diff side", "New", "新"),
    // "Next" as a schedule property is the next run; as a button it is the next step.
    ("schedule", "Next", "下次"),
    // "Thinking" as a model setting is the feature; as a status it is in progress.
    ("setting", "Thinking", "思考"),
];
