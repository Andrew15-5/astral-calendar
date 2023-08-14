// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import cache from '../event-info-cache'

const week_days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

async function get_event_info_list(): Promise<EventInfo[]> {
  return cache.get_event_info_list_from_cache()
}

function format_date(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // [0;11] -> [1;12]
  const day = date.getDate()
  const month_str = month < 10 ? `0${month}` : `${month}`
  const day_str = day < 10 ? `0${day}` : `${day}`
  return `${year}/${month_str}/${day_str}`
}

export namespace report {
  export namespace for_render {
    /**
     * @param year month of which year
     * @param month month's ordinal number [1;12]
     *
     * @returns month's report data for rendering
     */
    export async function month(year: number, month: Month) {
      const month_begin = new Date(`${year}-${month}`)
      const month_end = new Date(
        month < 12 ? `${year}-${month + 1}` : `${year + 1}-${1}`
      )
      return (await get_event_info_list())
        .filter((event) => event.end >= month_begin && event.end < month_end)
        .map((event) => ({
          'week-day': week_days[event.end.getDay() - 1],
          'month-day': event.end.getDate(),
          name: event.name,
          begin: format_date(event.begin),
          end: format_date(event.end),
        }))
    }
    /**
     * @param year quater's year
     * @param quater quater's ordinal number [1;4]
     *
     * @returns quater's report data for rendering
     */
    export async function quater(year: number, quater: Quater) {
      const quater_begin = new Date(`${year}-${(quater - 1) * 3 + 1}`)
      const quater_end = new Date(
        quater < 4 ? `${year}-${quater * 3 + 1}` : `${year + 1}-${1}`
      )
      return (await get_event_info_list())
        .filter((event) => event.end >= quater_begin && event.end < quater_end)
        .map((event) => ({
          'week-day': week_days[event.end.getDay() - 1],
          'month-day': event.end.getDate(),
          name: event.name,
          begin: format_date(event.begin),
          end: format_date(event.end),
        }))
    }
  }
}
