import Link from "next/link";

export default function Header() {
  return (
    <header style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="Digitart Logo" width={40} />
          <h1>Digitart</h1>
        </div>

        <nav style={{ display: "flex", gap: "20px" }}>
          <Link href="/">ホーム</Link>
          <Link href="/about">サークル紹介</Link>
          <Link href="/activities">活動内容</Link>
          <Link href="/work">作品</Link>
          <Link href="/members">メンバー</Link>
          <Link href="/contact">お問い合わせ</Link>
        </nav>
      </div>
    </header>
  );
}