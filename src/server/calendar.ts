// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { Request, Response } from 'express'

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

type SelectorName = 'month' | 'quater' | 'year'
const selector_names: SelectorName[] = ['month', 'quater', 'year']
const selector_text = ['Месячная', 'Квартальная', 'Годовая']
const selector_data = [month_names, quater_names, years]

function make_url(selector: SelectorName, element_index: number) {
  const current_year = new Date().getFullYear()
  let index: number
  switch (selector) {
    case 'month':
      index = element_index + 1 // 1 -> January, ..., 12 -> December
      break
    case 'quater':
      index = element_index + 1 // [1; 4]
      break
    case 'year':
      return 'javascript: alert("Not yet implemented")'
  }
  return `/calendar/${current_year}/${selector}/${index}`
}

function get_selectors_data() {
  return selector_names.map((name, index) => ({
    name: name,
    text: selector_text[index],
    items: selector_data[index].map((item_name, item_index) => ({
      name: item_name,
      url: make_url(name, item_index),
    })),
  }))
}

type CalendarData = {
  'show-arrows': boolean
  'month-year-text': string
  'cell-matrix': number[][]
}

namespace calendar {
  export namespace make_url {
    export namespace no_params {
      export function main() {
        return '/calendar'
      }
      export function month() {
        return make_url.month(':year', ':month')
      }
      export function quater() {
        return make_url.quater(':year', ':quater')
      }
    }
    export function month(year: number | string, month: number | string) {
      return `${no_params.main()}/${year}/month/${month}`
    }
    export function quater(year: number | string, quater: number | string) {
      return `${no_params.main()}/${year}/quater/${quater}`
    }
  }
  export namespace api {
    export namespace get {
      export function main(_request: Request, response: Response) {
        response.status(200).render('main', { selectors: get_selectors_data() })
      }
      export function month(
        request: Request<{ year: string; month: string }>,
        response: Response
      ) {
        const { year: year_str, month: month_str } = request.params
        const [year, month] = [year_str, month_str].map((str) =>
          Number.parseInt(str)
        )

        // Params' values check
        if ([year, month].includes(NaN)) {
          return response.redirect(make_url.no_params.main())
        }
        if (month < 1) {
          return response.redirect(make_url.month(year, 1))
        } else if (month > 12) {
          return response.redirect(make_url.month(year, 12))
        }

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
        })
      }
      export function quater(
        request: Request<{ year: string; quater: string }>,
        response: Response
      ) {
        const { year: year_str, quater: quater_str } = request.params
        const [year, quater] = [year_str, quater_str].map((str) =>
          Number.parseInt(str)
        )

        // Params' values check
        if ([year, quater].includes(NaN)) {
          return response.redirect(make_url.no_params.main())
        }
        if (quater < 1) {
          return response.redirect(make_url.quater(year, 1))
        } else if (quater > 4) {
          return response.redirect(make_url.quater(year, 4))
        }

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

        response
          .status(200)
          .render('quater', { year, quater, calendars: calendars_data })
      }
    }
  }
}

export default calendar
