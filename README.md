# Monster Hunter API
#### 日本語での説明は下にあります。
A RESTful API service built with Deno and Hono that provides access to Monster Hunter game data.
## Features
- Monster, endemic life, and quests data retrieval
- OpenAPI/Swagger documentation
- CORS enabled
- Response caching
- Static file serving
- Upstash redis to rate limit

## Tech Stack
- Deno - Runtime environment
- Hono - Web framework
- Zod - TypeScript-first schema validation
- OpenAPI/Swagger - API documentation
  
I use deno but you can run this on most of JS runtime. Check out [hono document](https://hono.dev/docs/getting-started/basic)

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

3. set up env
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
- [ ] filter on the server side. eg. by types

# モンスターハンターAPI

モンスターハンターのゲームデータへのアクセスを提供する、DenoとHonoで構築されたRESTful APIサービスです。

## 特徴

- モンスター、環境生物、クエストデータ検索

- モンスターの名前、タイプ、エレメント、病気、弱点による検索

- OpenAPI/Swaggerドキュメント

- CORS対応

- レスポンスのキャッシュ

- 静的ファイルサービング
- Upstash redisによるrate limit機能

## 技術スタック

- Deno - ランタイム環境

- Hono - ウェブフレームワーク

- Zod - TypeScriptファーストのスキーマ検証

- OpenAPI/Swagger - APIドキュメンテーション

  

私はdenoを使用していますが、他のJSランタイムで実行できます。[honoドキュメント](https://hono.dev/docs/getting-started/basic)をチェックしてください。


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

# 今後の機能

- [ ] サーバーの方でクエリをフィルターする機能　例えばタイプ。
