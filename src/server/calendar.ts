// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { Request, Response } from 'express'

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

namespace calendar {
  export function get_main(_request: Request, response: Response) {
    response.status(200).render('main', { selectors: get_selectors_data() })
  }
  export function get_month(
    request: Request<{ year: string; month: number }>,
    response: Response
  ) {
    const { year, month } = request.params
    let month_str = `${month < 10 ? '0' : ''}${month}`
    response.status(200).render('month', { year, month: month_str })
  }
  export function get_quater(
    request: Request<{ year: string; quater: string }>,
    response: Response
  ) {
    const { year, quater } = request.params
    response.status(200).render('quater', { year, quater })
  }
}

export default calendar
