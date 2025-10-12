# necord-bullmq-example

このリポジトリはnecordとbullmqを使用したDiscord botの例です。クリーンアーキテクチャを意識した構成にしていますが、Discord.jsの依存から逃れられないため、テスタビリティは高くありません。あくまでキューを使ったbotを簡単に作るためのボイラープレートとして参考にしてください。

> [!WARNING]
> リポジトリ所有者は、このサンプルを使用したことによる如何なる損害の責任も負いかねます

## 環境

- Node.js 22
- NestJS 11

## リポジトリ構成

### ルート

- biome.json: フォーマッタ・Linter
- Dockerfile.bot: プロダクション用Dockerfile
- Dockerfile.bot.dev: E2Eテスト用Dockerfile
- lefthook.yml: コミットフック
- Makefile: Redis起動用コマンドを記載
- mise.toml: モノレポ全体のNode.jsバージョン
- turbo.json: モノレポタスクの管理

### apps/bot

```
bot/
├── fly.<staging|production>.toml: デプロイ設定
├── Makefile: コマンドの短縮
├── mise.toml: Mise設定ファイル
├── nest-cli.json: Nest CLI設定ファイル
├── package.json: パッケージマネージャ設定ファイル
├── src
│   ├── cli.ts: CLIのエントリーポイント
│   ├── main.ts: コンテナのエントリポイント (Node.jsのデーモンとして起動)
│   ├── domain
│   │   ├── interfaces
│   │   │   └── jobs
│   │   │       └── <dto-name>.dto.ts: DTO定義
│   │   └── use-cases
│   │       ├── base-use-case.interface.ts: ベースユースケースインターフェース定義
│   │       └── <category>
│   │           ├── <use-case-name>.usecase.ts: ユースケース定義
│   │           └── <category>-use-cases.module.ts: ユースケースモジュール定義
│   ├── frameworks
│   │   ├── discord-bot
│   │   │   ├── discord-bot.module.ts: Discord botモジュール定義
│   │   │   └── discord-bot.service.ts: Discord botライフサイクル定義
│   │   ├── discord-channel
│   │   │   ├── discord-channel.module.ts: Discordチャンネルモジュール定義
│   │   │   └── discord-channel.service.ts: Discordチャンネルサービス定義
│   │   ├── jest
│   │   │   └── jest-setup.ts: Jestの設定ファイル
│   │   ├── nest
│   │   │   ├── constants.ts: 依存注入用のシンボル定義
│   │   │   └── debug.ts: デバッグ用ユーティリティ
│   │   ├── config.ts: コンフィグの定義
│   ├── gateways
│   │   ├── commands
│   │   │   ├── <category>
│   │   │   │   └── <command-name>.command.ts: CLIコマンド定義
│   │   │   └── commands.module.ts: CLIコマンドモジュール定義
│   │   ├── controllers
│   │   │   ├── <category>
│   │   │   │   ├── <controller-name>.controller.ts: コントローラー定義 (Webサーバーのルートに対応する)
│   │   │   │   └── dtos
│   │   │   │       └── <dto-name>.dto.ts: DTO定義
│   │   │   └── controllers.module.ts: コントローラーモジュール定義
│   │   ├── cron: (@nestjs/scheduleを使用する場合はここらへんを想定)
│   │   ├── discord-events
│   │   │   ├── <event-name>.command.ts: Discordイベントリスナー定義
│   │   │   └── discord-events.module.ts: Discordイベントモジュール定義
│   │   └── queues
│   │       ├── <queue-name>.consumer.ts: キューコンシューマー (`@Processor` デコレータをつけたClass)
│   │       └── queues.module.ts: キューモジュール定義
│   └── roles
│       ├── bot.module.ts: bot・Webサーバーモジュール定義 (Discord.jsの設定)
│       ├── cli.module.ts: CLIモジュール定義
│       └── shared.module.ts: 共有モジュール
├── test
│   ├── app.e2e-spec.ts: E2Eテスト定義
│   └── jest-e2e.json: E2Eテスト設定ファイル
├── tsconfig.build.json: ビルド設定ファイル
└── tsconfig.json: TypeScriptの設定ファイル
```

---

## Discord botの用意

```sh
cp apps/bot/.env.local.example .env
```

botトークンを取得して `apps/bot/.env` に記載してください。

プライベートかつ以下のようなIntents全有効botを想定しています。Intentsを変更する際は、 `bot.module.ts` をあわせて変更してください。

- Public bot: false
- Intents:
  - Presence
  - Server members
  - Message content

---

## ローカル開発

```sh
make up
pnpm dev --filter=bot
```

### コマンドの動作確認

devコマンド使用中、`dist/cli.js`を直接叩けば動作確認できます。

```sh
cd apps/bot
node dist/cli "notification:deploy" "--pre"
```

### 単体テスト

```sh
pnpm test
```

## E2Eテスト

テスト用コンテナを立ちげるためMakefileを使います(自動で終了)。

```sh
make bot-e2e
```

---

## デプロイ方法

### アプリの作成 (Fly.io)

まずデプロイなしでアプリとRedisを作成し、シークレットをセットします。

> [!WARNING]
> 以下のコマンドでは `necordbullmqbot-<staging|production>` というアプリ名にしていますが、これはグローバルでユニークにする必要があります。このリポジトリのTOMLファイルをそのまま使用せず、各自でアプリ名を決定してください。

#### ステージング環境

```sh
fly launch --copy-config -c apps/bot/fly.staging.toml \
    --no-deploy \
    --no-github-workflow

fly redis create -r nrt \
    --enable-eviction --no-replicas \
    -n necordbullmqbot-staging-redis

# configの都合でダブルアンダースコアになっているため注意
fly secrets set --stage -c apps/bot/fly.staging.toml \
    DISCORD__TOKEN="<botトークン>" \
    REDIS__URL="<redis createコマンドで表示されたURL>"
```

#### プロダクション環境の用意

上記の`staging` を `production` に読み替えてください。

### ロールアウト

ロールアウト時に `COMMIT_SHA` 環境変数をセットします。

#### ステージング環境のロールアウト

```sh
fly deploy -c apps/bot/fly.staging.toml --ha=false \
    --env COMMIT_SHA="$(git rev-parse HEAD)"
```

### プロダクション環境のロールアウト

上記の`staging` を `production` に読み替えてください。

### GitHub Actions

`staging` `production` ブランチでデプロイをトリガーするようにしています。

#### リポジトリシークレット

| キー | 値 |
| --- | --- |
| `FLY_API_TOKEN` | fly.ioのOrganization単位で取得するトークン |

## 参考

- [peterkracik/nestjs-clean-architecture](https://github.com/peterkracik/nestjs-clean-architecture)
  - クリーンアーキテクチャによるNest.jsのアプリケーション実装例。テスト時に `useExisting` を使ってモジュールをモックする
- [Optimized multi-stage Docker builds with TurboRepo and PNPM for NodeJS microservices in a monorepo](https://fintlabs.medium.com/optimized-multi-stage-docker-builds-with-turborepo-and-pnpm-for-nodejs-microservices-in-a-monorepo-c686fdcf051f)
  - turborepoによるモノレポ構成時、turbo prune, pnpm pruneを活用したDockerマルチステージビルドのベストプラクティス
- [NestJSのConfigurationプラクティス：.envと環境変数, バリデーション, 独自の環境変数読み出しサービス](https://zenn.dev/waddy/articles/nestjs-configuration-service)
  - class-validatorを活用した環境変数のバリデーション

## ライブラリ

- [necordjs/necord](https://github.com/necordjs/necord)
- [gremo/nest-winston](https://github.com/gremo/nest-winston)
- [Nikaple/nest-typed-config](https://github.com/Nikaple/nest-typed-config)
