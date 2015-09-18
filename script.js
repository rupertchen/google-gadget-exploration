// TODO: should all the globals be ALL_CAPS?

/**
 * The set of preferences
 *
 * @type {Object}
 */
var PREFS;

/**
 * Time of next refresh as ms since 1 January 1970 00:00:00 UTC
 *
 * @type {number}
 */
var nextRefreshTime = 0;

/**
 * Identifier of the repeated redraw action
 */
var redrawIntervalId;

/**
 * Minutes between data fetches
 *
 * @type {number}
 */
var refetchPeriod = 10;

/**
 * Upcoming events
 *
 * @type {Array}
 */
var UPCOMING_EVENTS = [];

function getUpcomingEvents() {
    console.log('getUpcomingEvents');

    // Set interval to be 7 days
    var start = new Date();
    var end = new Date();
    end.setDate(start.getDate() + 7);

    // "@viewer" is a special value to see the current user's events
    // "selected" is a special value to see the set of calendars that are visible and checked
    google.calendar.read.getEvents(
            upcomingEventsCallback, '@viewer',
            google.calendar.utils.fromDate(start, PREFS.timeOffset),
            google.calendar.utils.fromDate(end, PREFS.timeOffset),
            {'requestedFields': ['status', 'attendeeCount', 'attendees']})
}

function upcomingEventsCallback(events) {
    console.log(events);
    if (events && events.length > 0) {
        UPCOMING_EVENTS = events[0].events;
    } else {
        UPCOMING_EVENTS = [];
    }
    drawScreen();
}

function drawScreen() {
    console.log('drawScreen');
    var main = document.getElementById('main');

    var list_items = [];
    var numEvents = UPCOMING_EVENTS.length;
    for (var i = 0; i < numEvents; i++) {
        var event = UPCOMING_EVENTS[i];
        if (event.allDay || event.status === 'declined') {
            continue;
        }
        var bgColor;
        var borderColor;
        if (event.palette) {
            bgColor = event.palette.medium;
            borderColor = event.palette.dark;
        } else {
            bgColor = '#888888';
            borderColor = '#000000';
        }
        list_items.push('<li class="event"'
                + ' onclick="clickEvent(\'' + event.id + '\')"'
                + ' style="background-color: ' + bgColor + '; border-color: ' + borderColor + ';"'
                + '>'
                + '<span class="cost">$' + calculateCost(event) + '</span>'
                + gadgets.util.escapeString(event.title || '(No title)') + '</li>');
    }

    var html;
    if (list_items.length > 0) {
        html = '<ul class="event-list">' + list_items.join('') + '</ul>';
    } else {
        html = 'No upcoming events';
    }
    main.innerHTML = html;
    gadgets.window.adjustHeight();
}

function clickEvent(eventId) {
  google.calendar.showEvent(eventId);
}

function calculateCost(event) {
    console.log(event);

    var duration = getEventDurationInMinutes(event);
    console.log('Duration: ' + duration + ' minutes');

    // TODO: Calculate cost of attendees by applying a function against each
    var attendeeRate = 1; // $ per minute
    var attendeeCount = Math.max(1, event.attendeeCount);
    var attendeesCost = attendeeRate * attendeeCount * duration;
    console.log(attendeesCost);
    return Math.round(attendeesCost);
}

function getEventDurationInMinutes(event) {
    start = google.calendar.utils.toDate(event.startTime, PREFS.timeOffset);
    end = google.calendar.utils.toDate(event.endTime, PREFS.timeOffset);
    return (end.getTime() - start.getTime()) / 60000;
}

function redrawPeriodically() {
    var now = Date.now();
    // TODO: determine whether this is necessary if we are subscribed to data changes
    // if this i removed, then just have to fire off the initial fetch manually in init()
    // turns out it still is because the event could be modified from another browser and its update may not trigger on this page
    if (nextRefreshTime <= now) {
        nextRefreshTime = now + (refetchPeriod * 60000);
        getUpcomingEvents();
    }

    drawScreen();
    redrawIntervalId = window.setInterval(drawScreen, 60000);
}

function refreshEvents() {
    console.log('refresh events');
    google.calendar.refreshEvents();
}
