// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { month_names, week_days } from '../i18n/default/calendar/strings'
import { quarter_names, selector_text } from '../i18n/default/selectors/strings'

import { Request, Response } from 'express'

import { make_url, report } from './index'

const first_year = 2020
const last_year = new Date().getFullYear()
const years: number[] = []
for (let year = first_year; year <= last_year; year++) {
  years.push(year)
}

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
      return make_url.year(years[element_index])
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

function get_years_for_year_changer(year: number) {
  return years.map((_year) => ({
    year: _year,
    selected: _year === year,
  }))
}

function get_quarters_for_quarter_changer(quarter: Quarter) {
  return quarter_names.map((name, i) => ({
    quarter: name,
    number: i + 1,
    selected: i + 1 === quarter,
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
        years: get_years_for_year_changer(year),
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

      const events = await report.for_render.quarter(year)
      const grouped_events: ReportDataForRender[][] = Array.from(
        { length: 3 },
        () => []
      )
      for (const event of events) {
        const index = (event['deadline-month'] - 1) % months_in_quarter // [0;2]
        grouped_events[index].push(event)
      }

      response.status(200).render('quarter', {
        years: get_years_for_year_changer(year),
        quarters: get_quarters_for_quarter_changer(quarter),
        calendars: calendars_data,
        grouped_events: grouped_events,
      })
    }

    export async function year(
      request: Request<{ year: string }>,
      response: Response
    ) {
      const { year: year_str } = request.params
      const year = Number.parseInt(year_str)
      if (isNaN(year)) return response.redirect(make_url.no_params.main())

      // Making calendars_data
      const months_in_year = 12

      const events = await report.for_render.year(year)
      const grouped_events = Array.from({ length: months_in_year }, (_, i) => ({
        year: year,
        month: month_names[i],
        'event-list': [] as ReportDataForRender[],
      }))
      for (const event of events) {
        for (let i = 0; i < months_in_year; i++) {
          const month = i + 1 // Month index -> number
          if (event['deadline-month'] === month) {
            grouped_events[i]['event-list'].push(event)
          }
        }
      }

      response.status(200).render('year', {
        years: get_years_for_year_changer(year),
        grouped_events: grouped_events,
      })
    }
  }
}
