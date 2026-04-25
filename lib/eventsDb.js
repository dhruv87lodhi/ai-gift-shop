let events = [];

export function getEvents() {
  return events;
}

export function addEvent(event) {
  events.push(event);
  return event;
}
