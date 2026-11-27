// @vitest-environment happy-dom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { richText } from "./rich";

const html = (message: string) =>
  renderToStaticMarkup(
    createElement(
      "p",
      null,
      richText(message, {
        code: (chunk) => createElement("code", null, chunk),
      }),
    ),
  );

describe("richText", () => {
  it("maps tags to nodes and keeps surrounding text", () => {
    expect(html("Open <code>a.json</code> now")).toBe(
      "<p>Open <code>a.json</code> now</p>",
    );
  });

  it("lets a translation reorder the tagged part", () => {
    expect(html("<code>a.json</code>を開く")).toBe(
      "<p><code>a.json</code>を開く</p>",
    );
  });

  it("renders unknown tags as plain text", () => {
    expect(html("a <b>bold</b> b")).toBe("<p>a bold b</p>");
  });

  it("passes plain messages through", () => {
    expect(html("nothing special")).toBe("<p>nothing special</p>");
  });
});
