// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import csv from 'csv-parse/sync'
import fs from 'fs'

const week_days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

async function get_report_data(): Promise<ReportData[]> {
  let csv_buffer: Buffer
  try {
    csv_buffer = fs.readFileSync(process.env.DATA_CSV || 'data.csv')
  } catch (error) {
    return []
  }
  const init_data: string[][] = csv.parse(csv_buffer, { fromLine: 2 })
  return init_data
    .map((row) => ({
      name: row[0],
      begin: new Date(row[row.length - 2]),
      end: new Date(row[row.length - 1]),
    }))
    .sort((a, b) => (a.end < b.end ? -1 : 1)) // Sort by deadline
}

function format_date(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // [0;11] -> [1;12]
  const day = date.getDate()
  const month_str = month < 10 ? `0${month}` : `${month}`
  const day_str = day < 10 ? `0${day}` : `${day}`
  return `${year}/${month_str}/${day_str}`
}

export namespace reports {
  export async function quater(year: number, quater: Quater) {
    const quater_begin = new Date(`${year}-${(quater - 1) * 3 + 1}`)
    const quater_end = new Date(
      quater < 4 ? `${year}-${quater * 3 + 1}` : `${year + 1}-${1}`
    )
    return (await get_report_data())
      .filter((report) => report.end >= quater_begin && report.end < quater_end)
      .map((report) => ({
        'week-day': week_days[report.end.getDay() - 1],
        'month-day': report.end.getDate(),
        name: report.name,
        begin: format_date(report.begin),
        end: format_date(report.end),
      }))
  }
}
