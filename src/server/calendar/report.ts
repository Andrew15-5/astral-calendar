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
     * Because there are no AJAX calls on client, the only way to retrieve data
     * for all months is by sending data for all months first and then only show
     * data that is relevant for current month.
     *
     * @param year which year
     *
     * @returns year's event info list for rendering
     */
    export async function month(year: number): Promise<ReportDataForRender[]> {
      const year_begin = new Date(`${year}`)
      const year_end = new Date(`${year + 1}`)
      return (await get_event_info_list())
        .filter((event) => event.end >= year_begin && event.end < year_end)
        .map((event) => ({
          'week-day': week_days[event.end.getDay() - 1],
          'month-day': event.end.getDate(),
          'deadline-month': event.end.getMonth() + 1,
          'deadline-day': event.end.getDate(),
          name: event.name,
          begin: format_date(event.begin),
          end: format_date(event.end),
        }))
    }

    /**
     * Because there are no AJAX calls on client, the only way to retrieve data
     * for all quarters is by sending data for all quarters first and then only
     * show data that is relevant for current quarter.
     *
     * @param year which year
     *
     * @returns year's event info list for rendering
     */
    export async function quarter(
      year: number
    ): Promise<ReportDataForRender[]> {
      const year_begin = new Date(`${year}`)
      const year_end = new Date(`${year + 1}`)
      return (await get_event_info_list())
        .filter((event) => event.end >= year_begin && event.end < year_end)
        .map((event) => ({
          'week-day': week_days[event.end.getDay() - 1],
          'month-day': event.end.getDate(),
          'deadline-month': event.end.getMonth() + 1,
          'deadline-day': event.end.getDate(),
          quarter: Math.ceil((event.end.getMonth() + 1) / 3) as Quarter,
          name: event.name,
          begin: format_date(event.begin),
          end: format_date(event.end),
        }))
    }

    /**
     * @param year which year
     *
     * @returns year's event info list for rendering
     */
    export async function year(year: number): Promise<ReportDataForRender[]> {
      const year_begin = new Date(`${year}`)
      const year_end = new Date(`${year + 1}`)
      return (await get_event_info_list())
        .filter((event) => event.end >= year_begin && event.end < year_end)
        .map((event) => ({
          'week-day': week_days[event.end.getDay() - 1],
          'month-day': event.end.getDate(),
          'deadline-month': event.end.getMonth() + 1,
          name: event.name,
          begin: format_date(event.begin),
          end: format_date(event.end),
        }))
    }
  }
}
