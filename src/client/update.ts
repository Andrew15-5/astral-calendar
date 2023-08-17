// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { month_names } from './i18n/default/calendar/strings'

function update_calendar_text(calendar: Element, month: Month, year: number) {
  const text = calendar.querySelector('.header .month-year-text')
  if (text === null) return
  text.innerHTML = `${month_names[month - 1]} ${year}`
}

function update_calendar_days(calendar: Element, month: Month, year: number) {
  const total_days_on_calendar = 6 * 7 // 6 rows/weeks = 42
  const day_rows = calendar.querySelectorAll('.row.with-digits') // 6 rows/weeks

  if (day_rows.length !== 6) return

  const day_elements = Array.from(day_rows)
    .map((row) => Array.from(row.querySelectorAll('.cell')))
    .flat()

  if (day_elements.length !== total_days_on_calendar) return

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

function update_report_period_for_month(month: Month, year: number) {
  const text = document.querySelector('#calendar .report-period')
  if (text === null) return
  text.innerHTML = `Отчётность за ${month_names[month - 1]} ${year} г.`
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

namespace update {
  export namespace calendar {
    export function month(calendar: Element, month: Month, year: number) {
      update_calendar_text(calendar, month, year)
      update_calendar_days(calendar, month, year)
    }
    export function quarter(
      calendars: QuarterCalendarList,
      quarter: Quarter,
      year: number
    ) {
      const months_in_quarter = 3
      const months = Array.from(
        { length: months_in_quarter },
        (_, i) => ((quarter - 1) * months_in_quarter + 1 + i) as Month
      )
      for (let i = 0; i < months_in_quarter; i++) {
        update_calendar_text(calendars[i], months[i], year)
        update_calendar_days(calendars[i], months[i], year)
      }
    }
  }
  export namespace report {
    export function month(event_list: Element[], month: Month, year: number) {
      update_report_period_for_month(month, year)
      update_visible_events_for_month(event_list, month)
    }
  }
}

export default update
