// Copyright (C) 2023  Andrew Voynov
// See license in LICENSE file or at https://www.gnu.org/licenses/agpl-3.0.txt
import { exec } from 'child_process'
import csv from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'

function log(message?: any) {
  console.log('cache>', message)
}

function error(message?: any) {
  console.error('cache❗>', message)
}

// Row scheme:
// Название,Активность,Сортировка,"Дата изменения",ID,"Дата начала","Дата сдачи"
// Required data is in: first, last - 1, last
/**
 * @param csv_data string that contains CSV data
 *
 * @returns list of info about events from CSV data
 */
function get_event_info_from_csv_data(csv_data: string): EventInfo[] {
  const init_data: string[][] = csv.parse(csv_data, { fromLine: 2 })
  const out: EventInfo[] = init_data
    .map((row) => ({
      name: row[0],
      begin: new Date(row[row.length - 2]),
      end: new Date(row[row.length - 1]),
    }))
    .sort((a, b) => (a.end < b.end ? -1 : 1)) // Sort by deadline
  return out
}

// Initialized on caching start
let data_dir: string
let binary: string

// const spreadsheet_file_regex = /\.(ods|gnumeric|xlsx?)$/i

let file_to_event_info_map = new Map<string, EventInfo[]>()

export function get_event_info_list_from_cache() {
  return Array.from(file_to_event_info_map.values())
    .flat()
    .sort((a, b) => (a.end < b.end ? -1 : 1)) // Sort by deadline
}

function print_updated_map() {
  log('Updated map object:')
  log(
    new Map(
      Array.from(file_to_event_info_map).map(([file, event_info]) => [
        file,
        event_info.length,
      ])
    )
  )
}

async function on_file_add(file: string) {
  log(`Converting data from file ${file}`)
  const command = `${binary} < ${path.join(data_dir, file)} 2>/dev/null`
  const csv_data_promise: Promise<string> = new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error === null) {
        resolve(stdout)
      } else {
        reject(stderr)
      }
    })
  })
  try {
    const csv_data = await csv_data_promise
    file_to_event_info_map = new Map([
      ...Array.from(file_to_event_info_map),
      [file, get_event_info_from_csv_data(csv_data)],
    ])
    print_updated_map()
  } catch (error) {
    log(error)
    stop_caching()
    process.exit(1)
  }
}

function on_file_remove(file: string) {
  log(`Remove data for file ${file}`)
  file_to_event_info_map.delete(file)
  print_updated_map()
}

let dir_watcher: fs.FSWatcher

export function stop_caching() {
  log('Stopping dir watcher')
  dir_watcher.close()
}

export function start_caching() {
  // Init data dir
  data_dir = process.env.DATA_DIR || 'data'

  // Init binary
  const docker_image =
    process.env.SPREADSHEET_TO_CSV_DOCKER_IMAGE || 'andrew1555/ssconvert'
  binary = `docker run -i --rm ${docker_image}`

  // Supported formats ODS / Gnumeric / XLSX / XLS
  const spreadsheet_file_regex_pattern =
    process.env.SPREADSHEET_FILE_REGEX_PATTERN || '.(ods|gnumeric|xlsx?)$'
  const spreadsheet_file_regex_flags =
    process.env.SPREADSHEET_FILE_REGEX_FLAGS || 'i'
  const spreadsheet_file_regex = new RegExp(
    spreadsheet_file_regex_pattern,
    spreadsheet_file_regex_flags
  )

  if (!fs.existsSync(data_dir)) {
    error(`Can't access dir (${data_dir}/), creating`)
    fs.mkdirSync(data_dir, { mode: 0o775 })
  }

  log(`Watching spreadsheet files in ${data_dir}/`)
  dir_watcher = fs.watch(data_dir, (_event, filename) => {
    if (filename === null || !spreadsheet_file_regex.test(filename)) return
    // log(filename, event)
    if (fs.existsSync(path.join(data_dir, filename))) {
      on_file_add(filename)
    } else {
      on_file_remove(filename)
    }
  })

  process.on('SIGINT', () => {
    stop_caching()
    process.exit()
  })

  const files = []

  files.push(
    ...fs
      .readdirSync(data_dir)
      .filter((name) => spreadsheet_file_regex.test(name))
  )

  if (files.length === 0) {
    error('No spreadsheet files were detected on start')
  }

  for (const file of files) {
    on_file_add(file)
  }
}
