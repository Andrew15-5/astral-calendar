// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'
import { add_logic_for_year_changer, get_year_and_quarter } from './utils'

function change_quarter_in_url(new_quarter: Quarter) {
  const base = window.location.origin
  const path = window.location.pathname
  // Pattern:
  // (anything/)number
  const pattern = /(.*)(?<=\/)\d+/
  const new_url = base + path.replace(pattern, `$1${new_quarter}`)
  window.history.replaceState({}, '', new_url)
}

function get_default_option(element: HTMLSelectElement) {
  const default_option_list = Array.from(element.options).filter((option) =>
    option.hasAttribute('selected')
  )
  if (default_option_list.length !== 1) return null
  return default_option_list[0]
}

function add_logic_for_quarter_changer(
  report_text_list: Element[],
  event_list_list: Element[][],
  calendars: Element[],
  year: number
) {
  const change_quarter_select = document.getElementById(
    'change-quarter'
  ) as HTMLSelectElement | null
  if (change_quarter_select === null) return
  const default_option = get_default_option(change_quarter_select)
  if (default_option === null) return
  change_quarter_select.value = default_option.value
  change_quarter_select.addEventListener('change', function () {
    const options = (this as HTMLSelectElement).options
    if (options.selectedIndex === -1) return
    const selected_option = options.item(
      options.selectedIndex
    ) as HTMLOptionElement
    const selected_quarter = selected_option.getAttribute('data-quarter')!
    const new_quarter_test = parseInt(selected_quarter)
    if (
      isNaN(new_quarter_test) ||
      new_quarter_test < 1 ||
      new_quarter_test > 4
    ) {
      return
    }
    const new_quarter = new_quarter_test as Quarter
    update.calendar.quarter(event_list_list, calendars, new_quarter, year)
    update.report.quarter(report_text_list, event_list_list, new_quarter, year)
    change_quarter_in_url(new_quarter)
  })
}

const calendars_test = document.querySelectorAll('#calendar .calendar')
const report_text_list = Array.from(
  document.querySelectorAll('#calendar .report-period')
)
const event_list_list = Array.from(
  document.querySelectorAll('#calendar .event-list')
).map((event_list) => Array.from(event_list.querySelectorAll('.event')))
const year_and_quarter = get_year_and_quarter()

if (
  calendars_test.length === 3 &&
  report_text_list.length === 3 &&
  event_list_list.length === 3 &&
  year_and_quarter !== false
) {
  const calendars = Array.from(calendars_test)
  const [year, quarter] = year_and_quarter
  update.calendar.quarter(event_list_list, calendars, quarter, year)
  update.report.quarter(report_text_list, event_list_list, quarter, year)
  add_logic_for_quarter_changer(
    report_text_list,
    event_list_list,
    calendars,
    year
  )
}

add_logic_for_year_changer()
