# astral-calendar

## Usage

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
