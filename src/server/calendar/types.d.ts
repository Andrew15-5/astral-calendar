// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Quater = 1 | 2 | 3 | 4
type SelectorName = 'month' | 'quater' | 'year'

type CalendarData = {
  'show-arrows': boolean
  'month-year-text': string
  'cell-matrix': number[][]
}
