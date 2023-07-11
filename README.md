# astral-calendar

## Usage

Note: You have to add [`DATA_CSV`](#environment-variables) file to project.

### Production (not optimized)

`pnpm` (default):

```shell
pnpm install --frozen-lockfile
pnpm build
NODE_ENV=production pnpm install --frozen-lockfile
pnpm start # files are in build/ & public/
```

`yarn`:

```shell
yarn
yarn build
NODE_ENV=production yarn --frozen-lockfile
yarn start
```

`npm`:

```shell
npm install
npm run build
NODE_ENV=production npm ci
npm start
```

### Development

```shell
pnpm install # You can also use yarn/npm
pnpm run dev:server # watch TS files for server
pnpm run dev:client # watch TS files for client
pnpm run sass # watch SASS files
```

You can also add auto update when developing styles:

```html
<html>
  <head>
    <!-- Only for development -->
    <script type="text/javascript" src="https://livejs.com/live.js"></script>
  </head>
</html>
```

## Environment variables

- `PORT` --- port on which the server will be started (default: `3000`)
- `DATA_CSV` --- file (in root dir) which holds reports data (default: `data.csv`)
