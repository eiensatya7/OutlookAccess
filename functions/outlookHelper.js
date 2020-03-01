const fetch = require('node-fetch');
const moment = require('moment');
const {api, days} = require('./constants');
const utils = require('./utils');
const logging = console;

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
    logging.log('date-time: ', params['date-time']);
    const preferredDay = params['date-time'] || days.TODAY;
    const {startDate, endDate} = getStartAndEndOfDay(preferredDay);
    const url = utils.parameterize(api.GET_CALENDAR_VIEW, startDate, endDate);
    logging.log('url: ' + url);
    return fetch(url, {
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
    }).then((res) => res.json())
        .then((json) => conv.ask(formatResponse(json, preferredDay)))
        .catch((error) => logging.error('error:', error));
};

// Below function will get the Important emails
const getImportantEmails = (conv, accessToken) => {
    const url = utils.parameterize(api.GET_IMPORTANT_EMAILS);
    logging.log('url: ' + url);
    return fetch(url, {
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
    }).then((res) => res.json())
        .then((json) => conv.ask(formatEmailResponse(json)))
        .catch((error) => logging.error('error:', error));
};

const formatEmailResponse = ({value}) => {
    const emails = value;
    if (!emails || emails.length === 0) {
        return `You have no important emails!`;
    }
    return `${getNumberOfImpMails(emails)} ${getMoreInfoAboutImportantEmails(emails)}`;
};

const getNumberOfImpMails = (emails) => `You have ${emails.length} ${emails.length === 1 ? 'important email' : 'important emails'}.`;

const getSenderName = (email) => email.sender.emailAddress.name || 'Name not available.';

const getMoreInfoAboutImportantEmails = (emails) => {
    if (emails.length === 1) {
        return `with subject ${emails[0].subject} with ${getSenderName(emails[0])}.`;
    }
    return emails.map((email, index) => {
        return `Email ${index + 1} - with subject ${email.subject} from ${getSenderName(email)}.`;
    });
};

module.exports = {
    getEventsForSpecificDay,
    getImportantEmails,
};
