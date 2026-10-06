import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getBylaws } from "@/features/bylaws/bylaws";
import { getCustomMetadata } from "@/lib/metadata";

export const metadata = getCustomMetadata({
  title: "Bylaws",
  description: "Digitartサークル規約",
  path: "/bylaws",
});

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-8 pt-24 pb-16 md:pt-32">
      <BreadcrumbJsonLd path="/bylaws" />
      <article>
        <MarkdownRenderer content={getBylaws()} variant="document" />
      </article>
    </div>
  );
}
