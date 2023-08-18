// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'
import { get_year_and_month } from './utils'

export function update_calendar_and_report(
  report_text: Element,
  calendar: Element,
  event_list: Element[],
  month: Month,
  year: number
) {
  update.calendar.month(event_list, calendar, month, year)
  update.report.month(report_text, event_list, month, year)
}

function month_top_level_function() {
  const calendar = document.querySelector('#calendar .calendar')
  const report_text = document.querySelector('#calendar .report-period')
  if (calendar === null || report_text === null) return

  const left_arrow = calendar.querySelector('.header .arrow.left')
  const right_arrow = calendar.querySelector('.header .arrow.right')
  const event_list = Array.from(
    document.querySelectorAll('#calendar .event-list .event')
  )
  const year_and_month = get_year_and_month()

  if (year_and_month === false || left_arrow === null || right_arrow === null) {
    return
  }

  let [year, month] = year_and_month

  update_calendar_and_report(report_text, calendar, event_list, month, year)

  left_arrow.addEventListener('click', () => {
    if (month === 1) return
    month = (month - 1) as Month
    update_calendar_and_report(report_text, calendar, event_list, month, year)
  })

  right_arrow.addEventListener('click', () => {
    if (month === 12) return
    month = (month + 1) as Month
    update_calendar_and_report(report_text, calendar, event_list, month, year)
  })
}

month_top_level_function()
