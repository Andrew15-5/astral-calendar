// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const public_dir = path.join(__dirname, '..', '..', 'public')
app.use('/static/fonts', express.static(path.join(public_dir, 'fonts')))
app.use('/static/styles', express.static(path.join(public_dir, 'styles')))
app.use('/static/images', express.static(path.join(public_dir, 'images')))
app.use('/static/js', express.static(path.join(public_dir, 'js')))

app.get('/', (_request, response) => {
  response.redirect('/calendar/')
})

app.get('/calendar/', (_request, response) => {
  response.status(200).sendFile(path.join(public_dir, 'main.html'))
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
