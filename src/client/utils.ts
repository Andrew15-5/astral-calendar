// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
export function get_year_and_month() {
  const path = window.location.pathname
  const regex_list = path.match(/\d+/g)
  if (regex_list === null || regex_list.length < 2) return false

  const [year, month_test] = regex_list.map((value) => parseInt(value))
  if (month_test < 1 || month_test > 12 || isNaN(year)) return false

  return [year, month_test] as [number, Month]
}

export function get_year_and_quarter() {
  const path = window.location.pathname
  const regex_list = path.match(/\d+/g)
  if (regex_list === null || regex_list.length < 2) return false

  const [year, quarter_test] = regex_list.map((value) => parseInt(value))
  if (quarter_test < 1 || quarter_test > 4 || isNaN(year)) return false

  return [year, quarter_test] as [number, Quarter]
}

export function get_day_elements(
  calendar: Element,
  which_layer: '.cell' | '.cell-wrapper'
) {
  const total_days_on_calendar = 6 * 7 // 6 rows/weeks = 42
  const day_rows = calendar.querySelectorAll('.row.with-digits') // 6 rows/weeks

  if (day_rows.length !== 6) return null

  const day_elements = Array.from(day_rows)
    .map((row) => Array.from(row.querySelectorAll(which_layer)))
    .flat()

  if (day_elements.length !== total_days_on_calendar) return null
  return day_elements
}
