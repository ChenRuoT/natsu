import { Fragment, type ReactNode } from "react";

/**
 * Renders a translated message that embeds markup, e.g.
 * `"Open <b>settings</b> to edit this."`, by mapping each `<tag>text</tag>` to
 * a React node. Tags may not nest. Unknown tags render as their plain text.
 * Keeping the whole sentence in one message lets translators reorder it.
 */
export function richText(
  message: string,
  tags: Record<string, (chunk: string) => ReactNode>,
): ReactNode {
  const parts: ReactNode[] = [];
  const pattern = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let last = 0;
  let index = 0;
  for (const match of message.matchAll(pattern)) {
    const [whole, tag, chunk] = match;
    if (match.index > last) parts.push(message.slice(last, match.index));
    const render = tags[tag];
    parts.push(
      <Fragment key={index++}>{render ? render(chunk) : chunk}</Fragment>,
    );
    last = match.index + whole.length;
  }
  if (last < message.length) parts.push(message.slice(last));
  return parts;
}
