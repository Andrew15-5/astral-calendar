// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'
import { get_year_and_month, update_calendar_and_report } from './utils'

function month_top_level_function() {
  const left_arrow = document.querySelector(
    '#calendar .calendar .header .arrow.left'
  )
  const right_arrow = document.querySelector(
    '#calendar .calendar .header .arrow.right'
  )
  const event_list = Array.from(
    document.querySelectorAll('#calendar .event-list .event')
  )
  const year_and_month = get_year_and_month()

  if (year_and_month === false || left_arrow === null || right_arrow === null) {
    return
  }

  let [year, month] = year_and_month

  update.report(event_list, month, year)

  left_arrow.addEventListener('click', () => {
    if (month === 1) return
    month = (month - 1) as Month
    update_calendar_and_report(event_list, month, year)
  })

  right_arrow.addEventListener('click', () => {
    if (month === 12) return
    month = (month + 1) as Month
    update_calendar_and_report(event_list, month, year)
  })
}

month_top_level_function()
