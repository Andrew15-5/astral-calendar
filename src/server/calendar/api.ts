// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { month_names, week_days } from '../i18n/default/calendar/strings'
import { quarter_names, selector_text } from '../i18n/default/selectors/strings'

import { Request, Response } from 'express'

import { make_url, report } from './index'

const years = [2020, 2021, 2022]

const selector_names: SelectorName[] = ['month', 'quarter', 'year']
const selector_data = [month_names, quarter_names, years]

function make_url_of_selector_item(
  selector: SelectorName,
  element_index: number
) {
  const current_year = new Date().getFullYear()
  let index: number
  switch (selector) {
    case 'month':
      index = element_index + 1 // 1 -> January, ..., 12 -> December
      return make_url.month(current_year, index)
    case 'quarter':
      index = element_index + 1 // [1; 4]
      return make_url.quarter(current_year, index)
    case 'year':
      return 'javascript: alert("Not yet implemented")'
  }
}

function get_selectors_data() {
  return selector_names.map((name, index) => ({
    name: name,
    text: selector_text[index],
    items: selector_data[index].map((item_name, item_index) => ({
      name: item_name,
      url: make_url_of_selector_item(name, item_index),
    })),
  }))
}

export namespace api {
  export namespace get {
    export function main(_request: Request, response: Response) {
      response.status(200).render('main', { selectors: get_selectors_data() })
    }
    export async function month(
      request: Request<{ year: string }>,
      response: Response
    ) {
      const { year: year_str } = request.params
      const year = Number.parseInt(year_str)

      // Param's value check
      if (isNaN(year)) {
        return response.redirect(make_url.no_params.main())
      }

      const calendar_data: CalendarData = {
        'show-arrows': true,
        'week-day-names': week_days,
      }

      response.status(200).render('month', {
        calendar: calendar_data,
        events: await report.for_render.month(year),
      })
    }

    export async function quarter(
      request: Request<{ year: string; quarter: string }>,
      response: Response
    ) {
      const { year: year_str, quarter: quarter_str } = request.params
      const [year_test, quarter_test] = [year_str, quarter_str].map((str) =>
        Number.parseInt(str)
      )

      // Params' values check
      if ([year_test, quarter_test].includes(NaN)) {
        return response.redirect(make_url.no_params.main())
      }
      if (quarter_test < 1) {
        return response.redirect(make_url.quarter(year_test, 1))
      } else if (quarter_test > 4) {
        return response.redirect(make_url.quarter(year_test, 4))
      }
      const [year, quarter] = [year_test, quarter_test as Quarter]

      // Making calendars_data
      const months_in_quarter = 3
      const calendars_data: CalendarData[] = []
      for (let i = 0; i < months_in_quarter; i++) {
        calendars_data.push({
          'show-arrows': false,
          'week-day-names': week_days,
        })
      }

      const first_month = (quarter - 1) * months_in_quarter + 1
      const months: Month[] = []
      for (let i = 0; i < months_in_quarter; i++) {
        months.push((first_month + i) as Month)
      }

      const events = await report.for_render.quarter(year, quarter)
      const grouped_events: ReportDataForRender[][] = Array.from(
        { length: 3 },
        () => []
      )
      for (const event of events) {
        for (let i = 0; i < months_in_quarter; i++) {
          if (event['deadline-month'] === months[i]) {
            grouped_events[i].push(event)
          }
        }
      }

      response.status(200).render('quarter', {
        calendars: calendars_data,
        grouped_events: grouped_events,
      })
    }
  }
}
