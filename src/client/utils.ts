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

function change_year(new_year: number) {
  const base = window.location.origin
  const path = window.location.pathname
  // Pattern:
  // /number/
  // /number$
  const pattern = /(?<=\/)\d+(?=\/|$)/
  const new_url = base + path.replace(pattern, new_year.toString())
  window.location.href = new_url
}

function get_default_option(element: HTMLSelectElement) {
  const default_option_list = Array.from(element.options).filter((option) =>
    option.hasAttribute('selected')
  )
  if (default_option_list.length !== 1) return null
  return default_option_list[0]
}

export function add_logic_for_year_changer() {
  const change_year_select = document.getElementById(
    'change-year'
  ) as HTMLSelectElement | null
  if (change_year_select === null) return
  const default_option = get_default_option(change_year_select)
  if (default_option === null) return
  change_year_select.value = default_option.value
  change_year_select.addEventListener('change', function () {
    const new_year = parseInt((this as HTMLSelectElement).value)
    if (isNaN(new_year)) return
    change_year(new_year)
  })
}
