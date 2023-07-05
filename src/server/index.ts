// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import calendar from './calendar'
import dotenv from 'dotenv'
import express from 'express'
import hbs from 'hbs'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const pages_dir = path.join(__dirname, 'pages')
const public_dir = path.join(__dirname, '..', '..', 'public')

app.use('/static/fonts', express.static(path.join(public_dir, 'fonts')))
app.use('/static/styles', express.static(path.join(public_dir, 'styles')))
app.use('/static/images', express.static(path.join(public_dir, 'images')))
app.use('/static/js', express.static(path.join(public_dir, 'js')))

hbs.registerPartials(pages_dir)

app.set('view engine', 'hbs')
app.set('views', pages_dir)

app.get('/', (_request, response) => response.redirect('/calendar/'))
app.get('/calendar/', calendar.get_main)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
