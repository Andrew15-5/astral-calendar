// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
type CalendarData = {
  'show-arrows': boolean
  month?: number
  'week-day-names': string[]
}

type ReportDataForRender = {
  'week-day': string
  'month-day': number
  'deadline-month': number
  'deadline-day'?: number
  quarter?: Quarter
  name: string
  begin: string
  end: string
}
