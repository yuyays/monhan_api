# Monster Hunter API
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
