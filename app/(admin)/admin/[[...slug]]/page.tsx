import { notFound } from "next/navigation";

import { requireAdminSession } from "@/features/auth/requireAdminSession";

/** ページのない /admin 配下の URL。未ログインならログインページへ移動させ、ログイン済みなら 404 にする */
export default async function Page() {
  await requireAdminSession();
  notFound();
}
