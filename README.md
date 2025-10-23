# webmd-cli

[English](#english) | [日本語](#日本語)

---

## English

Convert web pages to Markdown files with preserved structure.

### Features

- 🚀 Single page conversion
- 📦 Full site crawling via sitemap.xml
- 🔗 Converts relative URLs to absolute URLs
- 📁 Preserves directory structure (optional)
- 🎯 Maintains HTML structure in Markdown (h1 → #, h2 → ##, etc.)

### Installation

```bash
npx webmd <URL>
```

Or install globally:

```bash
npm install -g webmd-cli
```

### Usage

#### Single Page Conversion

Convert a single web page to Markdown:

```bash
npx webmd https://example.com/page
```

Output: `example-com/page.md`

#### Full Site Crawling

Crawl entire site using sitemap.xml:

```bash
npx webmd -f https://example.com
```

This will:
1. Fetch `https://example.com/sitemap.xml`
2. Download all pages listed in the sitemap
3. Save them to `example-com/` directory

#### Preserve Directory Structure

Use the `-d` flag to maintain the original URL structure:

```bash
npx webmd -f -d https://example.com
```

- Without `-d`: `example-com/about-team.md`
- With `-d`: `example-com/about/team.md`

### Examples

```bash
# Single page
npx webmd https://example.com/

# Full site (flat structure)
npx webmd -f https://example.com/

# Full site (preserve directory structure)
npx webmd -f -d https://example.com/
```

### Output

- Images: `![alt](https://example.com/image.png)`
- Links: `[text](https://example.com/link)`
- All relative URLs are converted to absolute URLs

### Requirements

- Node.js 14 or higher
- Site must have sitemap.xml for full site crawling

### License

MIT

---

## 日本語

WebページをMarkdownファイルに変換するCLIツール。HTML構造を維持したまま変換します。

### 機能

- 🚀 単一ページの変換
- 📦 sitemap.xmlを使ったサイト全体のクロール
- 🔗 相対URLを絶対URLに自動変換
- 📁 ディレクトリ構造の保持（オプション）
- 🎯 HTML構造をMarkdownで維持（h1 → #、h2 → ##など）

### インストール

```bash
npx webmd <URL>
```

グローバルインストールする場合：

```bash
npm install -g webmd-cli
```

### 使い方

#### 単一ページの変換

1つのWebページをMarkdownに変換：

```bash
npx webmd https://example.com/page
```

出力: `example-com/page.md`

#### サイト全体のクロール

sitemap.xmlを使ってサイト全体をクロール：

```bash
npx webmd -f https://example.com
```

以下の処理を実行します：
1. `https://example.com/sitemap.xml` を取得
2. sitemapに記載された全ページをダウンロード
3. `example-com/` ディレクトリに保存

#### ディレクトリ構造の保持

`-d` フラグを使うと、元のURL構造を維持します：

```bash
npx webmd -f -d https://example.com
```

- `-d` なし: `example-com/about-team.md`
- `-d` あり: `example-com/about/team.md`

### 使用例

```bash
# 単一ページ
npx webmd https://example.com/

# サイト全体（フラット構造）
npx webmd -f https://example.com/

# サイト全体（ディレクトリ構造を保持）
npx webmd -f -d https://example.com/
```

### 出力形式

- 画像: `![alt](https://example.com/image.png)`
- リンク: `[text](https://example.com/link)`
- すべての相対URLは絶対URLに変換されます

### 必要環境

- Node.js 14以上
- サイト全体のクロールにはsitemap.xmlが必要

### ライセンス

MIT
