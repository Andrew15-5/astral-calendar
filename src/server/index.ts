// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import dotenv from 'dotenv'
import express from 'express'
import hbs from 'hbs'
import path from 'path'

import calendar from './calendar'
import cache from './event-info-cache'

dotenv.config()
cache.start_caching()

const app = express()
const PORT = process.env.PORT || 3000

const pages_dir = path.join(__dirname, 'pages')
const public_dir = path.resolve('public')

app.use('/static/fonts', express.static(path.join(public_dir, 'fonts')))
app.use('/static/styles', express.static(path.join(public_dir, 'styles')))
app.use('/static/images', express.static(path.join(public_dir, 'images')))
app.use('/static/js', express.static(path.join(public_dir, 'js')))

hbs.registerPartials(pages_dir)
hbs.registerHelper('development', () => process.env.NODE_ENV !== 'production')
hbs.registerHelper('clone', (times, block) => {
  let ret = ''
  for (let i = 0; i < times; i++) ret += block.fn()
  return ret
})

app.set('view engine', 'hbs')
app.set('views', pages_dir)

app.get('/', (_request, response) => response.redirect('/calendar/'))
app.get(calendar.make_url.no_params.main(), calendar.api.get.main)
app.get(calendar.make_url.no_params.month(), calendar.api.get.month)
app.get(calendar.make_url.no_params.quarter(), calendar.api.get.quarter)
app.get(calendar.make_url.no_params.year(), calendar.api.get.year)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
