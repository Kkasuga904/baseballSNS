// PWAアイコンのキャッシュを更新するユーティリティ
export const updatePWAIcon = () => {
  // マニフェストファイルを再読み込みしてアイコンを更新
  const link = document.querySelector("link[rel=\"manifest\"]");
  if (link) {
    const href = link.getAttribute("href");
    link.setAttribute("href", "");
    setTimeout(() => {
      link.setAttribute("href", href + "?v=" + Date.now());
    }, 10);
  }

  // Apple Touch Iconを更新
  const appleIcons = document.querySelectorAll("link[rel=\"apple-touch-icon\"]");
  appleIcons.forEach(icon => {
    const href = icon.getAttribute("href");
    if (href) {
      icon.setAttribute("href", href + "?v=" + Date.now());
    }
  });

  // Faviconを更新
  const favicon = document.querySelector("link[rel=\"icon\"]");
  if (favicon) {
    const href = favicon.getAttribute("href");
    favicon.setAttribute("href", href + "?v=" + Date.now());
  }
}
