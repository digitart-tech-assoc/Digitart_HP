import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { IFRAME_ALLOW } from "@/components/markdown/sanitizeSchema";

function render(content: string, variant?: "article" | "document") {
  return renderToStaticMarkup(<MarkdownRenderer content={content} variant={variant} />);
}

describe("MarkdownRenderer のサニタイズ", () => {
  it("script と style は中身ごと描画しない", () => {
    const html = render("本文\n\n<script>alert(1)</script>\n\n<style>body{display:none}</style>");

    expect(html).toContain("本文");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(1)");
    expect(html).not.toContain("<style");
    expect(html).not.toContain("display:none");
  });

  it("イベントハンドラーと style 属性は取り除く", () => {
    const html = render('<img src="/images/a.png" onerror="alert(1)" style="position:fixed">');

    expect(html).toContain('src="/images/a.png"');
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("position:fixed");
  });

  it("javascript: のリンクは href を付けない", () => {
    const html = render('[リンク](javascript:alert(1))\n\n<a href="javascript:alert(2)">HTML</a>');

    expect(html).toContain("リンク");
    expect(html).not.toContain("javascript:");
  });

  it("許可した URL の iframe だけを描画し、allow は固定の値にする", () => {
    const html = render(
      [
        '<iframe src="https://open.spotify.com/embed/track/abc" allow="camera; geolocation"></iframe>',
        '<iframe src="https://example.com/embed/"></iframe>',
        // 接頭辞が一致するように見せかけた別のホスト
        '<iframe src="https://open.spotify.com.example.com/embed/"></iframe>',
      ].join("\n\n"),
    );

    expect(html.match(/<iframe/g)).toHaveLength(1);
    expect(html).toContain('src="https://open.spotify.com/embed/track/abc"');
    expect(html).toContain(`allow="${IFRAME_ALLOW}"`);
    expect(html).not.toContain("camera");
    expect(html).not.toContain("example.com");
  });

  it("id には接頭辞を付け、ページ内リンクの飛び先もそれに合わせる", () => {
    const html = render('<p id="title">段落</p>\n\n[上へ](#title)');

    expect(html).toContain('id="user-content-title"');
    expect(html).toContain('href="#user-content-title"');
  });
});

describe("MarkdownRenderer の見出し", () => {
  it("記事では、本文の # を h2 から始まるレベルに詰めて出力する", () => {
    const html = render("# 大見出し\n\n### 小見出し");

    expect(html).not.toContain("<h1");
    expect(html).toMatch(/<h2[^>]*>大見出し<\/h2>/);
    expect(html).toMatch(/<h3[^>]*>.*小見出し<\/h3>/);
    expect(html).not.toContain("data-heading-level");
  });

  it("記事の HTML から見出しのレベルを指定できない", () => {
    const html = render('<h3 data-heading-level="1">見出し</h3>');

    expect(html).not.toContain("<h1");
    expect(html).toMatch(/<h2[^>]*>.*見出し<\/h2>/);
  });

  it("文書では、Markdown のレベルのまま出力する", () => {
    const html = render("# 規約\n\n#### 第 1 条", "document");

    expect(html).toMatch(/<h1[^>]*>規約<\/h1>/);
    expect(html).toMatch(/<h4[^>]*>第 1 条<\/h4>/);
  });
});
