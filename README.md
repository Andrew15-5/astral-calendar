# astral-calendar

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

- `PORT` --- port on which the server will be started (default: `3000`)
- `DATA_DIR` --- directory where all the spreadsheet files go (default: `data`)
  - Automatically created (with `775`) if missing.
- `SPREADSHEET_TO_CSV_DOCKER_IMAGE` (default: `andrew1555/ssconvert`)
  - Spreadsheet file's content is passed to stdin of container and CSV
    data is received in stdout.
- `SPREADSHEET_FILE_REGEX_PATTERN` (default: `.(ods|gnumeric|xlsx?)$`)
  - Most popular formats are included which can be processed by `ssconvert`.
- `SPREADSHEET_FILE_REGEX_FLAGS` (default: `i`)
  - Upper and lower case letters in the spreadsheet file format
    are treated as identical.
