// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'
import { get_year_and_month, update_calendar_and_report } from './utils'

function month() {
  const left_arrow = document.querySelector(
    '#calendar .calendar .header .arrow.left'
  )
  const right_arrow = document.querySelector(
    '#calendar .calendar .header .arrow.right'
  )
  const event_node_list = document.querySelectorAll(
    '#calendar .event-list .event'
  )
  const event_list = Array.from(event_node_list)
  const year_and_month = get_year_and_month()

  if (year_and_month === false || left_arrow === null || right_arrow === null) {
    return
  }

  let [year, calendar_month] = year_and_month

  update.report(event_list, calendar_month, year)

  left_arrow.addEventListener('click', () => {
    if (calendar_month === 1) return
    calendar_month = (calendar_month - 1) as Month
    update_calendar_and_report(event_list, calendar_month, year)
  })

  right_arrow.addEventListener('click', () => {
    if (calendar_month === 12) return
    calendar_month = (calendar_month + 1) as Month
    update_calendar_and_report(event_list, calendar_month, year)
  })
}

month()
