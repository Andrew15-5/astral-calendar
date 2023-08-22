// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'
import { add_logic_for_year_changer, get_year_and_quarter } from './utils'

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
}

add_logic_for_year_changer()
