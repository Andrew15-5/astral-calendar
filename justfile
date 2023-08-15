alias i := install
alias s := server
alias c := client
alias b := build
alias sa := sass

default: server

install:
  pnpm install

run script:
  pnpm run {{script}}

server: (run "dev:server")
client: (run "dev:client")
build: (run "build")
sass: (run "sass")
