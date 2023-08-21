// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { add_logic_for_year_changer } from './utils'

type MonthReport = {
  self: HTMLElement
  dropdown_button: HTMLElement
}

const month_report_list = Array.from(document.querySelectorAll('.month-report'))
  .map((month_report) => {
    const new_month_report = {
      self: month_report,
      dropdown_button: month_report.querySelector('.month-dropdown-toggle'),
    }
    if (new_month_report.dropdown_button === null) return null
    return new_month_report as MonthReport
  })
  .filter((month_report) => month_report !== null) as MonthReport[]

for (const month_report of month_report_list) {
  const dropdown_button = month_report.dropdown_button
  dropdown_button.addEventListener('click', () => {
    if (dropdown_button.getAttribute('aria-expanded') === 'true') {
      month_report.self.classList.remove('opened')
      dropdown_button.setAttribute('aria-expanded', 'false')
    } else {
      month_report.self.classList.add('opened')
      dropdown_button.setAttribute('aria-expanded', 'true')
    }
  })
}

add_logic_for_year_changer()
