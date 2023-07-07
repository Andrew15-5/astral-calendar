// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
export namespace make_url {
  export namespace no_params {
    export function main() {
      return '/calendar'
    }
    export function month() {
      return make_url.month(':year', ':month')
    }
    export function quater() {
      return make_url.quater(':year', ':quater')
    }
  }
  export function month(year: number | string, month: number | string) {
    return `${no_params.main()}/${year}/month/${month}`
  }
  export function quater(year: number | string, quater: number | string) {
    return `${no_params.main()}/${year}/quater/${quater}`
  }
}
