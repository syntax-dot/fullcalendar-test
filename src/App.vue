<template>
  <div class="demo-app">
    <div class="demo-app-sidebar">
      <!-- <div class="demo-app-sidebar-section">
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div> -->
      <div class="demo-app-sidebar-section">
        <div id="external-events">
          <div id="external-events-listing" class="drag-wrapper">
            <h4>Draggable Events</h4>
            <div v-for="event in mockDragEvents"
                 :key="event.id"
                 v-text="event.name"
                 :style="{ backgroundColor: event.color }"
                 class="fc-event fc-event-drag" />
          </div>
          <p>
            <input id="drop-remove"
                   type="checkbox"
                   checked="checked">
            <label for="drop-remove">remove after drop</label>
          </p>
        </div>
      </div>
      <div class="demo-app-sidebar-section">
        <h2>All Events ({{ currentEvents.length }})</h2>
        <ul>
          <li v-for="event in currentEvents"
              :key="event.id">
            <b>{{ event.startStr }}</b>
            <i>{{ event.title }}</i>
          </li>
        </ul>
      </div>
    </div>
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar"
                    :options="calendarOptions">
        <template #eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from 'vue'
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'

const mockDragEvents = [
  { name: 'Event 1', value: '1', id: '1', color: 'red' },
  { name: 'Event 2', value: '2', id: '2', color: 'blue' },
  { name: 'Event 3', value: '3', id: '3', color: 'green' },
  { name: 'Event 4', value: '4', id: '4', color: 'orange' },
  { name: 'Event 5', value: '5', id: '5', color: 'blueviolet' }
]

const calendarOptions = ref({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin // needed for dateClick
  ],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  initialView: 'dayGridMonth',
  initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
  editable: true,
  droppable: true,
  drop: function(arg: any) {
    // is the "remove after drop" checkbox checked?
    if ((document.getElementById('drop-remove') as HTMLInputElement)?.checked) {
      // if so, remove the element from the "Draggable Events" list
      arg.draggedEl.parentNode.removeChild(arg.draggedEl)
    }
  },
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents
  /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
}) as CalendarOptions

const currentEvents = ref<EventApi[]>([])

function handleWeekendsToggle() {
  calendarOptions.weekends = !calendarOptions.weekends // update a property
}

function handleDateSelect(selectInfo: DateSelectArg) {
  const title = prompt('Please enter a new title for your event')
  const calendarApi = selectInfo.view.calendar

  calendarApi.unselect() // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    })
  }
}

function handleEventClick(clickInfo: EventClickArg) {
  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`))
    clickInfo.event.remove()
}

function handleEvents(events: EventApi[]) {
  currentEvents.value = events
}

onMounted(() => {
  const element = document.getElementById('external-events')
  if (!element)
    return
  // eslint-disable-next-line no-new
  new Draggable(element, {
    itemSelector: '.fc-event',
    eventData: function(eventEl: HTMLElement) {
      return {
        title: eventEl.innerText
        // other properties here
      }
    }
  })
})
</script>

<style lang='css'>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b { /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc { /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

.drag-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fc-event {
  padding: 8px;
}

.fc-event-drag {
  border-radius: 8px;
}
</style>
