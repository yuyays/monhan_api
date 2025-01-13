# Monster Hunter API
#### 日本語での説明は下にあります。
A RESTful API service built with Hono that provides access to Monster Hunter game data.
## Features
- Monster, endemic life, and quests data retrieval
- OpenAPI/Swagger documentation
- Fetch data with some filter
- Static file serving

## Tech Stack
- [Deno](https://deno.com/) - Runtime environment
- [Hono](https://hono.dev/) - Web framework
- [Zod for HonoOpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) - TypeScript-first schema validation
- [OpenAPI/Swagger for Hono](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) - API documentation
- [Pino Logger for hono](https://github.com/maou-shonen/hono-pino) - logger
- [Upstash](https://upstash.com/) - rate limit
  
I use deno but you can run this on most of JS runtime. Check out [hono document](https://hono.dev/docs/getting-started/basic)
## Data Source
- I use all the data and image from [https://github.com/CrimsonNynja/monster-hunter-DB](https://github.com/CrimsonNynja/monster-hunter-DB).
- This API is read only so if you want to add more monster data, plese make a pull request to the repo above.
- Thank you for [CrimsonNynja](https://github.com/CrimsonNynja)
## Getting Started

1. install deno
```
curl -fsSL https://deno.land/x/install/install.sh | sh
```
2. Clone the repository:
```
git clone https://github.com/yuyays/monhan_api.git
cd monster-hunter-api
```

3. set up envf
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
LOG_LEVEL="debug"
DENO_ENV="development"
```   
4. run web sever with deno
```
deno task start
```
# upcoming feacture
- [ ] host data on database and server static image from bucket such as s3, r2 then query from there.

# Clinet code example
- I have client side code build with Next.js but currently not calling this repo backend.
- Check out [https://monhan.vercel.app/](https://monhan.vercel.app/) [repo](https://github.com/yuyays/monhan)

# モンスターハンターAPI

モンスターハンターのゲームデータへのアクセスを提供する、DenoとHonoで構築されたRESTful APIサービスです。

## 特徴

- モンスター、環境生物、クエストデータ検索
- モンスターの名前、タイプ、エレメント、病気、弱点による検索
- モンスターのエレメントや弱点などによるフィルターする機能
- OpenAPI/Swaggerドキュメント
- 静的ファイルサービング

## 技術スタック
- [Deno](https://deno.com/) - ランタイム環境
- [Hono](https://hono.dev/) - ウェブフレームワーク
- [Zod for HonoOpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) - TypeScriptファーストのスキーマ検証
- [OpenAPI/Swagger for Hono](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) - APIドキュメンテーション
- [Pino Logger for hono](https://github.com/maou-shonen/hono-pino) - ログ
- [Upstash](https://upstash.com/)　- rate limit

私はdenoを使用していますが、他のJSランタイムで実行できます。[honoドキュメント](https://hono.dev/docs/getting-started/basic)をチェックしてください。

## データ
- このプロジェクトは、[https://github.com/CrimsonNynja/monster-hunter-DB](https://github.com/CrimsonNynja/monster-hunter-DB)のデータを基に構築されています。貴重なリソースを提供してくださった[CrimsonNynja](https://github.com/CrimsonNynja)に感謝します！
- このAPIは読み込み専用なので、モンスターのデータを追加したい場合は、上記のレポにプルリクエストしてください。
## はじめに
1. denoをインストールする。
```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

2. リポジトリをクローンする：
```
git clone https://github.com/yuyays/monhan_api.git
cd monster-hunter-api
```

3. set up env
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
LOG_LEVEL="debug"
DENO_ENV="development"
```

4. deno でウェブサーバを実行する。
```
deno task start
```
# クライエントコードの例
- Next.js を使用したクライエント側のコードがありますが、現在バックエンドはこちらのhonoで作られたものよりデータをフェッチしていません。
- [https://monhan.vercel.app/](https://monhan.vercel.app/) , 
- [レポジトリ](https://github.com/yuyays/monhan)
# 今後の機能
データと画像をどこかにのせてクエリする。
