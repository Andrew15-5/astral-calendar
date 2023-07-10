# astral-calendar

## Usage

Note: You have to add [`DATA_CSV`](#environment-variables) file to project.

### Production (not optimized)

```shell
npm run build
node . # files are in build/ & public/
```

### Development

```shell
npm run dev:server # watch TS files for server
npm run dev:client # watch TS files for client
npm run sass # watch SASS files
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
