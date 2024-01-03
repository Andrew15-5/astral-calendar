# astral-calendar

## Description

Calendar for accountants.

Features:

- view events and their deadlines
- filter by year, quarter and month
- interactive calendars (hover and click)
- hot-load spreadsheet data (auto extraction of data from spreadsheet files in `data/`)

## Usage

##### Notes:

- You have to add spreadsheet file(s) to project (although it works without them).
- For convenience `alias j=just` can be used when using `just` command.
  - To install `just` with `cargo` (Rust package manager) run `cargo install just`.

### Production (not optimized)

For a quick production-like test using `just` and `pnpm`:

```shell
just i # Install
just b # Build
just st # Start
```

`pnpm` (default):

```shell
pnpm install --frozen-lockfile
just b
NODE_ENV=production pnpm install --frozen-lockfile
just st # files are in build/
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
just i # Install all dependencies
just   # Watch TS & HBS files for server
just c # Watch TS & SASS files for client
```

## Environment variables

- `PORT` — port on which the server will be started (default: `3000`)
- `DATA_DIR` — directory where all the spreadsheet files go (default: `data`)
  - Automatically created (with `775`) if missing.
- `SPREADSHEET_TO_CSV_DOCKER_IMAGE` (default: `andrew1555/ssconvert`)
  - Spreadsheet file's content is passed to stdin of container and CSV
    data is received in stdout.
- `SPREADSHEET_FILE_REGEX_PATTERN` — JavaScript regex pattern
  (default: `.(ods|gnumeric|xlsx?)$`)
  - Most popular formats are included which can be processed by `ssconvert`.
- `SPREADSHEET_FILE_REGEX_FLAGS` — JavaScript regex flags (default: `i`)
  - Upper and lower case letters in the spreadsheet file format
    are treated as identical.
- `SPREADSHEET_COLUMN_NAME` — column number with event name (default: `1`)
- `SPREADSHEET_COLUMN_BEGIN` — column number with event begin date (default: `6`)
- `SPREADSHEET_COLUMN_END` — column number with event end date (default: `7`)
