// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'

export function update_calendar_and_report(
  event_list: Element[],
  month: Month,
  year: number
) {
  update.calendar(month, year)
  update.report(event_list, month, year)
}

export function get_year_and_month() {
  const path = window.location.pathname
  const regex_list = path.match(/\d+/g)
  if (regex_list === null || regex_list.length < 2) return false

  const [year, month_test] = regex_list.map((value) => parseInt(value))
  if (month_test < 1 || month_test > 12 || isNaN(year)) return false

  return [year, month_test] as [number, Month]
}