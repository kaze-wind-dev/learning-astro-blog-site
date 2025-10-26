---
title: 'Astro.js ページネーション実装ガイド'
date: 2025-10-24
---
## 1. URL設計の選択

ページネーションのURL形式には主に2種類あります：

### パターン比較

| パターン | URL例 | SEO評価 | 推奨度 |
| --- | --- | --- | --- |
| パスベース | `/blog/page/2` | ⭐⭐⭐ | 推奨 |
| クエリパラメータ | `/blog/?page=2` | ⭐⭐ | 可 |

### 推奨：`/blog/page/2` 形式

**理由：**

- URLの階層構造が明確
- GoogleのJohn Mueller氏も推奨
- 共有しやすく、ユーザーフレンドリー
- パンくずリストとの整合性が良い

---

## 2. Astro.jsでの実装方法

Astro.jsには2つの主要なページネーション実装方法があります。

### 方法1：paginate()を使う方法

### ファイル構造

```
src/pages/blog/
├── index.astro          # /blog (1ページ目)
└── page/
    └── [page].astro     # /blog/page/2, /blog/page/3, ...

```

### 実装例：`page/[page].astro`

```
---
import type { GetStaticPathsOptions } from "astro";
import { BLOG_LIMIT } from "../../../constants";
import Layout from "../../../layout/Layout.astro";
import { getBlogList } from "../../../libs/api/microcms";
import BlogList from "../../../components/BlogList.astro";

export async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
  // 全記事を取得
  const response = await getBlogList();

  // paginate()が自動的に複数ページを生成
  return paginate(response.contents, { pageSize: BLOG_LIMIT });
}

// paginate()から渡されるpageオブジェクトを取得
const { page } = Astro.props;
---

<Layout pageTitle="ブログ一覧">
  <main>
    <h1>ブログ一覧</h1>

    <!-- 現在のページの記事を表示 -->
    <BlogList blogList={page.data} />

    <!-- ページネーション -->
    <ul class="c-pagination">
      {page.url.prev && (
        <li class="c-pagination__item">
          <a href={page.url.prev} class="c-pagination__link">前へ</a>
        </li>
      )}

      {Array.from({ length: page.lastPage }, (_, i) => i + 1).map((num) => (
        <li class="c-pagination__item">
          <a
            href={num === 1 ? '/blog' : `/blog/page/${num}`}
            class:list={[
              "c-pagination__link",
              { active: num === page.currentPage }
            ]}
          >
            {num}
          </a>
        </li>
      ))}

      {page.url.next && (
        <li class="c-pagination__item">
          <a href={page.url.next} class="c-pagination__link">次へ</a>
        </li>
      )}
    </ul>
  </main>
</Layout>

```

### pageオブジェクトの構造

```jsx
{
  data: [記事1, 記事2, ..., 記事10],  // 現在のページの記事
  currentPage: 2,                      // 現在のページ番号
  lastPage: 5,                         // 最後のページ番号
  url: {
    prev: '/blog/page/1',              // 前のページのURL
    next: '/blog/page/3'               // 次のページのURL
  }
}

```

### メリット・デメリット

**メリット：**

- ✅ コードがシンプル
- ✅ Astroが自動的にページを生成
- ✅ `page`オブジェクトで必要な情報がすべて揃う

**デメリット：**

- ❌ ビルド時に全記事を取得する必要がある
- ❌ 記事数が多いとビルドが遅くなる
- ❌ microCMS SDKは1回のAPI呼び出しで最大100件まで（全件取得メソッドを使えば回避可能）

---

### 方法2：手動実装（推奨）

### ファイル構造

```
src/pages/blog/
└── page/
    └── [page].astro     # /blog/page/1, /blog/page/2, ...

```

### 実装例：`page/[page].astro`

```
---
import { BLOG_LIMIT } from "../../../constants";
import Layout from "../../../layout/Layout.astro";
import { getBlogList } from "../../../libs/api/microcms";
import BlogList from "../../../components/BlogList.astro";

const pageTitle = "ブログ一覧";

export async function getStaticPaths() {
  // 総件数だけ取得（軽い）
  const { totalCount } = await getBlogList({ limit: 1 });
  const totalPages = Math.ceil(totalCount / BLOG_LIMIT);

  // 必要なページ数分のパスを生成
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i + 1) }
  }));
}

// 現在のページ番号を取得
const pageNum = Number(Astro.params.page);

// 現在のページに必要な記事だけ取得
const { contents: blogList, totalCount } = await getBlogList({
  limit: BLOG_LIMIT,
  offset: (pageNum - 1) * BLOG_LIMIT
});

const totalPages = Math.ceil(totalCount / BLOG_LIMIT);
---

<Layout pageTitle={pageTitle}>
  <main>
    <h1>ブログ一覧</h1>

    <BlogList blogList={blogList} />

    <ul class="c-pagination">
      <!-- 前へ -->
      {pageNum > 1 && (
        <li class="c-pagination__item">
          <a
            href={`/blog/page/${pageNum - 1}`}
            class="c-pagination__link"
          >
            前へ
          </a>
        </li>
      )}

      <!-- ページ番号 -->
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <li class="c-pagination__item">
          <a
            href={`/blog/page/${num}`}
            class:list={[
              "c-pagination__link",
              { active: num === pageNum }
            ]}
          >
            {num}
          </a>
        </li>
      ))}

      <!-- 次へ -->
      {pageNum < totalPages && (
        <li class="c-pagination__item">
          <a
            href={`/blog/page/${pageNum + 1}`}
            class="c-pagination__link"
          >
            次へ
          </a>
        </li>
      )}
    </ul>
  </main>
</Layout>

```

### メリット・デメリット

**メリット：**

- ✅ ビルドが速い（総件数の取得のみ）
- ✅ 各ページで必要な分だけAPIを呼び出す
- ✅ microCMSの`limit`/`offset`仕様に合致
- ✅ 記事数が増えてもパフォーマンスが安定
- ✅ メモリ使用量が最小限

**デメリット：**

- ❌ コード量がやや多い
- ❌ ページネーション部分を自分で実装する必要がある

---

## 3. microCMS連携時の推奨実装

### microCMS SDKの制限

microCMS SDKは1回のAPI呼び出しで最大100件までしか取得できません：

```jsx
// ❌ 101件以上は取得できない
const response = await getBlogList({ limit: 100 });

```

### 推奨：手動実装

記事数が100件を超える可能性がある場合、または将来的な拡張を考慮する場合は、**手動実装を強く推奨**します。

### 理由：

1. **スケーラビリティ**：記事数が増えてもビルド時間が安定
2. **API効率**：必要なデータだけを取得
3. **microCMS仕様**：`limit`/`offset`による段階的取得に最適
4. **メモリ効率**：全件をメモリに保持する必要がない

---

## 4. 実装の選択基準

### paginate()を選ぶべきケース

- 記事数が少ない（〜50件程度）
- シンプルな実装を優先したい
- 全件取得メソッドが利用可能

### 手動実装を選ぶべきケース

- 記事数が多い、または今後増える予定（100件〜）
- ビルドパフォーマンスを重視
- microCMSなどの外部APIを使用
- スケーラビリティが重要

---

## 5. SEOとアクセシビリティ

### 必須実装

どちらの方法を選んでも、以下は必ず実装してください：

### 1. canonicalタグ

```
<head>
  <link rel="canonical" href={`https://yoursite.com/blog/page/${pageNum}`} />
</head>

```

### 2. XMLサイトマップへの登録

すべてのページネーションページをサイトマップに含める

### 3. 一貫性のあるURL構造

途中でURL形式を変更しないこと

---

## まとめ

### 推奨構成

```
✅ URL形式: /blog/page/2
✅ 実装方法: 手動実装
✅ API呼び出し: limit/offsetで段階的取得

```

この構成により、スケーラブルで保守性の高いページネーションを実現できます。

---
