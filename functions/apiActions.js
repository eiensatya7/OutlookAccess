const fetch = require('node-fetch');
const {api, days} = require('./constants');
const utils = require('./utils');
const {getStartAndEndOfDay, formatEventsResponse, formatEmailResponse} = require('./outlookHelper');
const logging = console;

// Below function will get the events for specific day and it will defaults to current day.
const getEventsForSpecificDayAction = (conv, params, accessToken) => {
    logging.log('date-time: ', params['date-time']);
    const preferredDay = params['date-time'] || days.TODAY;
    const {startDate, endDate} = getStartAndEndOfDay(preferredDay);
    const url = utils.parameterize(api.GET_CALENDAR_VIEW, startDate, endDate);
    logging.log('url: ' + url);
    return fetch(url, {
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
    }).then((res) => res.json())
        .then((json) => conv.ask(formatEventsResponse(json, preferredDay)))
        .catch((error) => logging.error('error:', error));
};

// Below function will get the Important emails
const getImportantEmailsAction = (conv, accessToken) => {
    const url = utils.parameterize(api.GET_IMPORTANT_EMAILS);
    logging.log('url: ' + url);
    return fetch(url, {
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
    }).then((res) => res.json())
        .then((json) => conv.ask(formatEmailResponse(json)))
        .catch((error) => logging.error('error:', error));
};

module.exports = {
    getEventsForSpecificDayAction,
    getImportantEmailsAction,
};
