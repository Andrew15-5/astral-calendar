// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import update from './update'
import { get_year_and_quarter } from './utils'

function quarter_top_level_function() {
  const calendars_test = document.querySelectorAll('#calendar .calendar')
  const report_text_list = Array.from(
    document.querySelectorAll('#calendar .report-period')
  )
  const year_and_quarter = get_year_and_quarter()
  if (
    calendars_test.length !== 3 ||
    report_text_list.length !== 3 ||
    year_and_quarter === false
  ) {
    return
  }
  const calendars = Array.from(calendars_test)
  const [year, quarter] = year_and_quarter
  update.calendar.quarter(calendars, quarter, year)
  update.report.quarter(report_text_list, quarter, year)
}

quarter_top_level_function()
