/** イントロを表示済みかどうかを、ブラウザのタブ（セッション）ごとに覚えておくキー */
export const INTRO_SEEN_STORAGE_KEY = "digitart:intro-seen";

/**
 * <html> に data-intro-seen を付け、CSS でイントロを隠す。
 * 最初の描画より前に実行する必要があるため、ルートレイアウトの <head> にインラインで埋め込む。
 * sessionStorage が使えない環境（プライベートブラウズの一部など）では毎回イントロを表示する。
 */
export const INTRO_SEEN_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_STORAGE_KEY)}))document.documentElement.dataset.introSeen=""}catch(e){}`;
