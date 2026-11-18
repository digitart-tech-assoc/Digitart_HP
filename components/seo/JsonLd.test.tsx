import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/JsonLd";

describe("JsonLd", () => {
  it("値に </script> が含まれていても script タグが途中で閉じない", () => {
    const html = renderToStaticMarkup(
      <JsonLd data={{ name: '</script><script>alert("x")</script>' }} />,
    );

    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html).toContain("\\u003c/script>");
  });

  it("エスケープしても JSON として元の値に戻る", () => {
    const data = { name: "<b>太字</b> & 'quote'" };
    const html = renderToStaticMarkup(<JsonLd data={data} />);
    const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");

    expect(JSON.parse(json)).toEqual(data);
  });
});
