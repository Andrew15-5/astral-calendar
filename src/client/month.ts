// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { month_names } from './i18n/default/calendar/strings'

function hide(li_list: Element[]) {
  li_list.forEach((li) => li.classList.add('hide'))
}

function show(li_list: Element[]) {
  li_list.forEach((li) => li.classList.remove('hide'))
}

function update_calendar(month: Month, year: number) {
  const text = document.querySelector(
    '#calendar .calendar .header .month-year-text'
  )
  if (text === null) return
  text.innerHTML = `${month_names[month - 1]} ${year}`
}

function update_report_period(month: Month, year: number) {
  const text = document.querySelector('#calendar .report-period')
  if (text === null) return
  text.innerHTML = `Отчётность за ${month_names[month - 1]} ${year} г.`
}

function show_only_events_for_month(event_list: Element[], month: Month) {
  const month_event_list = event_list.filter((li) => {
    const event_month = li.getAttribute('data-deadline-month')
    if (event_month === null) return false
    return parseInt(event_month) === month
  })
  const other_months_event_list = event_list.filter(
    (element) => !month_event_list.includes(element)
  )
  show(month_event_list)
  hide(other_months_event_list)
}

function month() {
  const path = window.location.pathname
  console.log(path)
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

  console.log('regex_list:', regex_list)

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

  console.log('Current month:', calendar_month)

  show_only_events_for_month(event_list, calendar_month)

  left_arrow.addEventListener('click', () => {
    console.log('click')
    if (calendar_month === 1) return
    calendar_month = (calendar_month - 1) as Month
    console.log('previous month', calendar_month)
    update_calendar(calendar_month, year)
    update_report_period(calendar_month, year)
    show_only_events_for_month(event_list, calendar_month)
  })

  right_arrow.addEventListener('click', () => {
    console.log('click')
    if (calendar_month === 12) return
    calendar_month = (calendar_month + 1) as Month
    console.log('next month', calendar_month)
    update_calendar(calendar_month, year)
    update_report_period(calendar_month, year)
    show_only_events_for_month(event_list, calendar_month)
  })

  // console.log(other_months_event_list)
}

month()
