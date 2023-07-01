# [geckos.io](https://github.com/geckosio/geckos.io) server network adapter for nengi v2

> **Warning**
> This adapter is written and tested only on nengi v2.0.0-alpha.133, this is an unstable version, the api of which may change in the future

### Install

```bash
npm i nengi-geckos-server-adapter
```

### Usage

#### Server-side

```ts
import { Instance, Context } from "nengi";
import { GeckosServerAdapter } from "nengi-geckos-server-adapter";

const ctx = new Context();
// <...>
const instance = new Instance(ctx);

const geckos = new GeckosServerAdapter(instance.network);
geckos.listen(PORT);
```

If you want to pass additional options for the geckos.io server you can pass them as the second argument

```ts
const geckosOptions = {};
const geckos = new GeckosServerAdapter(instance.network, geckosOptions);
```

All available server options is described here https://github.com/geckosio/geckos.io#server-1

#### Client-side

For client-side you need [nengi-geckos-client-adapter](https://github.com/RealPeha/nengi-geckos-client-adapter)
