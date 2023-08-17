// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'

function month() {
  const path = window.location.pathname
  const regex_list = path.match(/\d+/g)
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

  if (
    regex_list === null ||
    regex_list.length < 2 ||
    left_arrow === null ||
    right_arrow === null
  ) {
    return
  }

  const [year, month_test] = regex_list.map((value) => parseInt(value))

  if (month_test < 1 || month_test > 12 || isNaN(year)) return
  let calendar_month = month_test as Month

  update.report(event_list, calendar_month, year)

  left_arrow.addEventListener('click', () => {
    if (calendar_month === 1) return
    calendar_month = (calendar_month - 1) as Month
    update.calendar(calendar_month, year)
    update.report(event_list, calendar_month, year)
  })

  right_arrow.addEventListener('click', () => {
    if (calendar_month === 12) return
    calendar_month = (calendar_month + 1) as Month
    update.calendar(calendar_month, year)
    update.report(event_list, calendar_month, year)
  })
}

month()
