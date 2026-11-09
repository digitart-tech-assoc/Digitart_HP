import { requireAdminSession } from "@/features/auth/requireAdminSession";
import { ArticleEditor } from "@/features/news/editor/components/ArticleEditor";

export default async function Page() {
  await requireAdminSession();
  return <ArticleEditor />;
}
