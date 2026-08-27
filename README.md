# ECG Reading Lab Web

ECG Reading Lab iOS 0.1.5の資料をもとに作った、スマートフォン優先の学習用Webアプリ。平均電気軸ラボに加え、Web版独自のWPW・ケント束ラボを収録している。

## ローカル起動

Node.js 22.13以上とpnpmを使う。

```powershell
pnpm install
pnpm dev
```

既定の確認先は `http://localhost:3000/`。

## 公開版

GitHub Pagesの公開先は `https://meko1984.github.io/ECG-Reading-Lab/`。`main` ブランチへ反映すると、GitHub Actionsがテストと静的ビルドを行ってPagesへ公開する。

GitHubへ含めるのはこのWeb版フォルダの内容だけで、元の参考ZIPやXcodeプロジェクトは含めない。

## 品質確認

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

設計と確認項目は `docs/basic-design.md`、`docs/acceptance-tests.md` を参照。iOS版との意図した差分は `docs/known-differences.md` に記録している。

## 注意

これは心電図の学習補助ツールであり、判読や診断を行うものではない。現段階では公開とデータ保存を行わない。お問い合わせ画面にはXアカウントへの外部リンクがあるが、アプリ内の入力・送信機能はない。
