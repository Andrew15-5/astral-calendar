// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import cache from '../event-info-cache'
import { week_days } from '../i18n/default/calendar/strings'

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
     * @returns month's event info list for rendering
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
     * @param year quarter's year
     * @param quarter quarter's ordinal number [1;4]
     *
     * @returns quarter's event info list for rendering
     */
    export async function quarter(year: number, quarter: Quater) {
      const quarter_begin = new Date(`${year}-${(quarter - 1) * 3 + 1}`)
      const quarter_end = new Date(
        quarter < 4 ? `${year}-${quarter * 3 + 1}` : `${year + 1}-${1}`
      )
      return (await get_event_info_list())
        .filter(
          (event) => event.end >= quarter_begin && event.end < quarter_end
        )
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
