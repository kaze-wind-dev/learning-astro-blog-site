---
layout: '../../layout/Layout.astro'
title: '【Astro.js】インテグレーション'
date: 2025-10-25
---

## そもそもインテグレーションとは

「統合」「統一」「一体化」を意味する言葉。

IT分野では複数の異なるシステムやソフトウェア・ハードウェアなどを連携して、一つのシステムとして機能させること。

つまり、Astro.jsにおけるインテグレーションとはほかのフレームワークやライブラリ、独自機能などと連携を行うことを指す。

Astroに機能を追加するプラグイン

- UIフレームワーク: React、Vue、Svelte
- その他: Tailwind、microCMS等

## 使用できるインテグレーション

AstroはReact、Preact、Svelte、Vue、SolidJS、AlpineJS、Litのインテグレーションをオプションとして提供。

1つまたは複数をAstroインテグレーションとしてプロジェクトにインストール・設定できる

## まずはReact.jsのインストール

いかにCLIが乗っているよ

インストール:

```bash
pnpm astro add react
```

https://docs.astro.build/ja/guides/integrations-guide/react/#options

## インタラクティブなコンポーネントを作成する

フレームワークコンポーネントはclient:ディレクティブを使用して、インタラクティブ（ハイドレーションした状態）にできる

```tsx
import { useState } from "react";

export const CountButton = () => {
  const [count, setCount] = useState<number>(0);
  const handleClick = () => {
    setCount((prev: number) => prev + 1);
  };
  return (
    <>
      <button onClick={handleClick}>ボタンを押してください！</button>
      <p>現在押された回数は{count}回です！</p>
    </>
  );
};

<CountButton client:visible/>
```

## クライアントディレクティブ

https://docs.astro.build/ja/reference/directives-reference/#%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96

| ディレクティブ | 読み込むタイミング | 読み込み優先度 |  |
| --- | --- | --- | --- |
| client:load | ページ読み込みと同時で | 高 |  |
| client:idle | ページの初期読み込みが終わり、ブラウザが待機状態になったとき。`requestIdleCallback`イベントが発生したタイミング | 中 |  |
| client:visible | コンポーネントが画面内に表示されたタイミング。IntersectionObserverを使用している | 低 |  |
| client:media | 指定したCSSメディアクエリの条件と一致したとき |  |  |
| client:only | クライアント側でレンダリング。サーバー側では行わない |  |  |

※client:idle　**requestIdleCallback() メソッド**

https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback

### Next.jsとのアプローチの違い

client:loadはnext.jsのuseclientと似ている、というかほぼ同じ。

ただし、設計思想の違いがあるため、以下の点には注意

Next.js (App Router)

デフォルト: すべてServer Component
use clientを付けると: Client Component（ブラウザでも実行される）

Astro

デフォルト: すべて静的HTML（JSを送らない）
client:*を付けると: JSを送ってブラウザで実行

アプローチとしては逆

## ハイドレーションとは？

静的HTML → JS読み込み → インタラクティブ化

ハイドレーション（Hydration）は、**静的HTMLに命を吹き込む処理のこと**

1. Networkタブを開く
2. `client:load`のページを読み込む
3. 最初の0.1秒でHTMLが表示される
4. JSファイルが読み込まれる
5. ボタンがクリック可能になる

この一連の流れが「ハイドレーション」

通常、reactではクライアント動作なので、一瞬表示されないときがあるが、これはreactがJSでHTMLを追加している（クライアント側でJSで実行されている）からである。