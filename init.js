/**
 * Initialize the gadget
 *
 * @param {Object} prefs The set of preferences.
 */
function init(prefs) {
    PREFS = prefs;

    google.calendar.subscribeToDataChange(getUpcomingEvents);
    redrawPeriodically();
}

google.calendar.getPreferences(init);
