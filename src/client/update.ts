// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { month_names } from './i18n/default/calendar/strings'
import { get_day_elements } from './utils'

function update_calendar_text(calendar: Element, month: Month, year: number) {
  const text = calendar.querySelector('.header .month-year-text')
  if (text === null) return
  text.innerHTML = `${month_names[month - 1]} ${year}`
}

function update_calendar_arrows(calendar: Element, month: Month) {
  const left_arrow = calendar.querySelector('.header .arrow.left')
  const right_arrow = calendar.querySelector('.header .arrow.right')
  if (left_arrow === null || right_arrow === null) return

  const class_name = 'transparent'
  const hide_arrow = (arrow: Element) => arrow.classList.add(class_name)
  const show_arrow = (arrow: Element) => arrow.classList.remove(class_name)

  switch (month) {
    case 1:
      hide_arrow(left_arrow)
      break
    case 2:
      show_arrow(left_arrow)
      break
    case 11:
      show_arrow(right_arrow)
      break
    case 12:
      hide_arrow(right_arrow)
      break
  }
}

function update_calendar_days(calendar: Element, month: Month, year: number) {
  const day_elements = get_day_elements(calendar, '.cell')
  if (day_elements === null) return

  const start_of_the_month = new Date(`${year}-${month}`)
  let first_week_day = start_of_the_month.getDay()
  if (first_week_day === 0) first_week_day = 7 // [Sunday;Saturday] -> [0;6]

  // 0 days if current month starts from Monday.
  const days_from_previous_month = first_week_day === 1 ? 0 : first_week_day - 1

  // 0th day changes to the last day of the previous month (month is 0-based).
  const days_in_current_month = new Date(year, month, 0).getDate()
  const days_in_previous_month = new Date(year, month - 1, 0).getDate()

  day_elements.forEach((day_element, i) => {
    let day_number = i + 1
    if (day_number <= days_from_previous_month) {
      // Offset for days in previous month
      day_number =
        days_in_previous_month - days_from_previous_month + day_number
    } else {
      // Offset 1st day for days in current month
      day_number -= days_from_previous_month
      if (day_number > days_in_current_month) {
        // Offset 1st day again for days in next month
        day_number -= days_in_current_month
      }
    }
    day_element.innerHTML = day_number.toString()
  })
}

function update_calendar_deadlines(
  event_list: Element[],
  calendar: Element,
  month: Month,
  year: number
) {
  const day_elements = get_day_elements(calendar, '.cell-wrapper')
  if (day_elements === null) return

  const start_of_the_month = new Date(`${year}-${month}`)
  let first_week_day = start_of_the_month.getDay()
  if (first_week_day === 0) first_week_day = 7 // [Sunday;Saturday] -> [0;6]

  // 0 days if current month starts from Monday.
  const days_from_previous_month = first_week_day === 1 ? 0 : first_week_day - 1

  // 0th day changes to the last day of the previous month (month is 0-based).
  const days_in_current_month = new Date(year, month, 0).getDate()

  day_elements.forEach((day_element) =>
    day_element.classList.remove('deadline')
  )

  // 1. Extract month & day info from event elements
  // 2. Leave only info with current month
  const event_deadline_info_list = event_list
    .map((event) => {
      return {
        // name: event.querySelector('.name')!,
        month: parseInt(event.getAttribute('data-deadline-month')!) as Month,
        day: parseInt(event.getAttribute('data-deadline-day')!),
      }
    })
    .filter((event) => event.month === month)

  for (
    let days_offset = 0;
    days_offset < days_in_current_month;
    days_offset++
  ) {
    const index = days_from_previous_month + days_offset
    const day_of_month = days_offset + 1
    const found = event_deadline_info_list.find(
      (event) => event.day === day_of_month
    )
    if (found) {
      day_elements[index].classList.add('deadline')
    }
  }
}

function update_report_period_for_month(
  report_period_text: Element,
  month: Month,
  year: number
) {
  report_period_text.innerHTML = `Отчётность за ${
    month_names[month - 1]
  } ${year} г.`
}

function hide(li_list: Element[]) {
  li_list.forEach((li) => li.classList.add('hide'))
}

function show(li_list: Element[]) {
  li_list.forEach((li) => li.classList.remove('hide'))
}

function update_visible_events_for_month(event_list: Element[], month: Month) {
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

function get_month_list_for_quarter(quarter: Quarter) {
  const months_in_quarter = 3
  const first_month = (quarter - 1) * months_in_quarter + 1
  const months: Month[] = []
  for (let i = 0; i < months_in_quarter; i++) {
    months.push((first_month + i) as Month)
  }
  return months
}

namespace update {
  export namespace calendar {
    export function month(
      event_list: Element[],
      calendar: Element,
      month: Month,
      year: number
    ) {
      update_calendar_arrows(calendar, month)
      update_calendar_text(calendar, month, year)
      update_calendar_days(calendar, month, year)
      update_calendar_deadlines(event_list, calendar, month, year)
    }
    export function quarter(
      event_list_list: Element[][],
      calendars: Element[],
      quarter: Quarter,
      year: number
    ) {
      const months_in_quarter = 3
      const months = get_month_list_for_quarter(quarter)
      for (let i = 0; i < months_in_quarter; i++) {
        update_calendar_text(calendars[i], months[i], year)
        update_calendar_days(calendars[i], months[i], year)
        update_calendar_deadlines(
          event_list_list[i],
          calendars[i],
          months[i],
          year
        )
      }
    }
  }
  export namespace report {
    export function month(
      report_period_text: Element,
      event_list: Element[],
      month: Month,
      year: number
    ) {
      update_report_period_for_month(report_period_text, month, year)
      update_visible_events_for_month(event_list, month)
    }
    export function quarter(
      report_text_list: Element[],
      quarter: Quarter,
      year: number
    ) {
      const months_in_quarter = 3
      const months = get_month_list_for_quarter(quarter)
      for (let i = 0; i < months_in_quarter; i++) {
        update_report_period_for_month(report_text_list[i], months[i], year)
      }
    }
  }
}

export default update
