import { EventInput } from '@fullcalendar/core'
import moment from 'moment'

let eventGuid = 0
const todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
const mock = moment().subtract(7, 'days').format('YYYY-MM-DD')

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Mock event',
    start: mock
  }
]

export function createEventId() {
  return String(eventGuid++)
}
