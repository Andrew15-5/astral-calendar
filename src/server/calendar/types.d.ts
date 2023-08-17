// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
type Quarter = 1 | 2 | 3 | 4

type CalendarData = {
  'show-arrows': boolean
  month?: number
  'month-year-text': string
  'week-day-names': string[]
  'cell-matrix': number[][]
}
