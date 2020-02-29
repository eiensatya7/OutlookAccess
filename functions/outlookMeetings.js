const fetch = require('node-fetch');
const moment = require('moment');
const {api, days} = require('./constants');
const utils = require('./utils');
const {Logging} = require('@google-cloud/logging');


/**
 * Outlook Integration module
 */
const getNumberOfMeetings = (meetings, preferredDay) => `You have ${meetings.length} ${meetings.length === 1 ? 'meeting' : 'meetings'} ${preferredDay}.`;

const getOrganizerName = (meeting) => meeting.organizer.emailAddress.name || 'Name not available.';

const getMoreInfoAboutMeetings = (meetings) => {
    if (meetings.length === 1) {
        return `with subject ${meetings[0].subject} with ${getOrganizerName(meetings[0])}.`;
    }
    return meetings.map((meeting, index) => {
        return `Meeting ${index + 1} - with subject ${meeting.subject} with ${getOrganizerName(meeting)}.`;
    });
};

const formatResponse = ({value}, preferredDay) => {
    const meetings = value;
    if (!meetings || meetings.length === 0) {
        return `You have no meetings ${preferredDay}!`;
    }
    return `${getNumberOfMeetings(meetings, preferredDay)} ${getMoreInfoAboutMeetings(meetings)}`;
};


const getStartAndEndOfDay = (preferredDay) => {
    if (preferredDay === days.TOMORROW) {
        return ({
            startDate: moment().add(1, 'day').startOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
            endDate: moment().add(1, 'day').endOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
        });
    }
    return ({
        startDate: moment().startOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
        endDate: moment().endOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
    });
};

// Below function will get the events for specific day and it will defaults to current day.
const getEventsForSpecificDay = (conv, params, accessToken) => {
    console.log('date-time: ', params['date-time']);
    const preferredDay = params['date-time'] || days.TODAY;
    const {startDate, endDate} = getStartAndEndOfDay(preferredDay);
    const url = utils.parameterize(api.GET_CALENDAR_VIEW, startDate, endDate);
    console.log('url is ' + url + ' this crap is ' + api.GET_CALENDAR_VIEW);
    return fetch(url, {
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
    }).then((res) => res.json())
        .then((json) => conv.ask(formatResponse(json, preferredDay)))
        .catch((error) => console.error('error:', error));
};

module.exports = {
    getEventsForSpecificDay,
};
