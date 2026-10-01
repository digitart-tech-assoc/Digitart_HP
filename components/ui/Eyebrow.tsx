type EyebrowProps = {
  children: React.ReactNode;
  /** 余白など、呼び出し側で調整したいクラス */
  className?: string;
};

/** 見出しの上に添える英字の小さなラベル（例: "Latest News"） */
export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <p
      className={`text-[10px] font-bold tracking-[0.3em] text-brand uppercase md:text-xs ${className}`}
    >
      {children}
    </p>
  );
}
