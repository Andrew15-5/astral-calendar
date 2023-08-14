// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { Request, Response } from 'express'

import { make_url, report } from './index'

const month_names = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const quater_names = ['Первый', 'Второй', 'Третий', 'Четвертый'].map(
  (name) => name + ' квартал'
)

const years = [2020, 2021, 2022]

const selector_names: SelectorName[] = ['month', 'quater', 'year']
const selector_text = ['Месячная', 'Квартальная', 'Годовая']
const selector_data = [month_names, quater_names, years]

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
    case 'quater':
      index = element_index + 1 // [1; 4]
      return make_url.quater(current_year, index)
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
      request: Request<{ year: string; month: string }>,
      response: Response
    ) {
      const { year: year_str, month: month_str } = request.params
      const [year_test, month_test] = [year_str, month_str].map((str) =>
        Number.parseInt(str)
      )

      // Params' values check
      if ([year_test, month_test].includes(NaN)) {
        return response.redirect(make_url.no_params.main())
      }
      if (month_test < 1) {
        return response.redirect(make_url.month(year_test, 1))
      } else if (month_test > 12) {
        return response.redirect(make_url.month(year_test, 12))
      }
      const [year, month] = [year_test, month_test as Month]

      const month_string = `${month < 10 ? '0' : ''}${month}`

      // Making calendar_data
      const cells = Array.from({ length: 35 }, (_, i) => (i % 31) + 1)
      const matrix = []
      const row_length = 7
      while (cells.length > 0) {
        matrix.push(cells.splice(0, row_length))
      }
      const month_name = month_names[month - 1]
      const calendar_data: CalendarData = {
        'show-arrows': true,
        'month-year-text': `${month_name} ${year}`,
        'cell-matrix': matrix,
      }

      response.status(200).render('month', {
        year,
        month: month_string,
        calendar: calendar_data,
        reports: await report.for_render.month(year, month),
      })
    }
    export async function quater(
      request: Request<{ year: string; quater: string }>,
      response: Response
    ) {
      const { year: year_str, quater: quater_str } = request.params
      const [year_test, quater_test] = [year_str, quater_str].map((str) =>
        Number.parseInt(str)
      )

      // Params' values check
      if ([year_test, quater_test].includes(NaN)) {
        return response.redirect(make_url.no_params.main())
      }
      if (quater_test < 1) {
        return response.redirect(make_url.quater(year_test, 1))
      } else if (quater_test > 4) {
        return response.redirect(make_url.quater(year_test, 4))
      }
      const [year, quater] = [year_test, quater_test as Quater]

      // Making calendars_data
      const cells = Array.from({ length: 35 }, (_, i) => (i % 31) + 1)
      const matrix = []
      const row_length = 7
      while (cells.length > 0) {
        matrix.push(cells.splice(0, row_length))
      }
      const first_month_index = (quater - 1) * 3
      const last_month_index = first_month_index + 2
      const quater_month_names = []
      for (let i = first_month_index; i <= last_month_index; i++) {
        quater_month_names.push(month_names[i])
      }
      const calendars_data: CalendarData[] = []
      for (const month_name of quater_month_names) {
        calendars_data.push({
          'show-arrows': false,
          'month-year-text': `${month_name} ${year}`,
          'cell-matrix': matrix,
        })
      }

      response.status(200).render('quater', {
        year,
        quater,
        calendars: calendars_data,
        reports: await report.for_render.quater(year, quater),
      })
    }
  }
}
