// publicディレクトリのHTMLファイルをスキャン対象から除外
export default {
  optimizeDeps: {
    entries: ['index.html', '!public/**/*.html']
  }
}