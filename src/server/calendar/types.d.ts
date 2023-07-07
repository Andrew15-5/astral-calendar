// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
type SelectorName = 'month' | 'quater' | 'year'

type CalendarData = {
  'show-arrows': boolean
  'month-year-text': string
  'cell-matrix': number[][]
}
