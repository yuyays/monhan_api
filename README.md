# Monster Hunter API
#### 日本語での説明は下にあります。
A RESTful API service built with Deno and Hono that provides access to Monster Hunter game data.
## Features
- Monster data retrieval with pagination
- Search monsters by name, type, element, ailment, and weakness
- OpenAPI/Swagger documentation(coming soon)
- CORS enabled
- Response caching
- Static file serving

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
3. run web sever with deno
```
deno task start
```
# upcoming feacture
- [ ] more routes such as endemic life and quest.
- [ ] openAPI hono standard
- [ ] Sentry logging, rate limit



# モンスターハンターAPI

モンスターハンターのゲームデータへのアクセスを提供する、DenoとHonoで構築されたRESTful APIサービスです。

## 特徴

- ページネーションによるモンスターデータ検索

- モンスターの名前、タイプ、エレメント、病気、弱点による検索

- OpenAPI/Swaggerドキュメント(近日公開)

- CORS対応

- レスポンスのキャッシュ

- 静的ファイルサービング


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

3. deno でウェブサーバを実行する。

```
deno task start
```

# 今後の機能

- [ ] 風土記やクエストなどのルートを増やす。

- [ ] openAPI hono標準

- [ ] sentryロギング、レート制限
