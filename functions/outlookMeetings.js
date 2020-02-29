const fetch = require('node-fetch');
const moment = require('moment');
const {api} = require('./constants');
const utils = require('./utils');
const {Logging} = require('@google-cloud/logging');
const logging = new Logging();


/**
 * Outlook Integration module
 */
class OutlookMeetings {
    getNumberOfMeetings(meetings) {
        return `You have ${meetings.length} ${meetings.length === 1 ? 'meeting' : 'meetings'} today`;
    }

    getOrganizerName(meeting) {
        return meeting.organizer.emailAddress.name || 'Name not available';
    }

    getMoreInfoAboutMeetings(meetings) {
        if (meetings.length === 1) {
            return `with subject ${meetings[0].subject} with ${this.getOrganizerName(meetings[0])}`;
        }
        return meetings.map((meeting, index) => {
            return `Meeting ${index+1} - with subject ${meeting.subject} with ${this.getOrganizerName(meeting)}`;
        });
    }

    formatResponseForToday({ value }) {
        const meetings = value;
        if (!meetings || meetings.length === 0) {
            return 'You have no meetings today!';
        }
        return `${this.getNumberOfMeetings(meetings)} ${this.getMoreInfoAboutMeetings(meetings)}`;
    }

    getEventsForToday(conv, accessToken) {
        const startDate = moment().startOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        const endDate = moment().endOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        const url = utils.parameterize(api.GET_CALENDAR_VIEW, startDate, endDate);
        console.log('url is ' + url + ' this crap is ' + api.GET_CALENDAR_VIEW);
        return fetch(url, {
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
        }).then((res) => res.json())
            .then((json) => conv.close(this.formatResponseForToday(json)))
            .catch((error) => console.error('error:', error));
    }
}

module.exports = OutlookMeetings;
