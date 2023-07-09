// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
type Quater = 1 | 2 | 3 | 4
type SelectorName = 'month' | 'quater' | 'year'

type CalendarData = {
  'show-arrows': boolean
  'month-year-text': string
  'cell-matrix': number[][]
}

type ReportData = {
  name: string
  begin: Date
  end: Date
}
