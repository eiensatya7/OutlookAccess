const fetch = require('node-fetch');

/**
 * Outlook Integration module
 */
class Outlook {
    getNumberOfMeetings(meetings) {
        return `You have ${meetings.length} ${meetings.length === 1 ? 'meeting' : 'meetings'} today`;
    }

    getOrganizerName(meeting) {
        return meeting.organizer.emailAddress.name || 'Name not available';
    }

    getMoreInfoAboutMeetings(meetings) {
        if (meetings.length === 1) {
            return `Meeting 1 - ${meetings[0].subject} with ${this.getOrganizerName(meetings[0])}`;
        }
        return meetings.map((meeting, index) => {
            return `Meeting ${index + 1} - ${meeting.subject} with ${this.getOrganizerName(meeting)}`
        });
    }

    formatResponseForToday(value) {
        const meetings = value;
        if (!meetings || meetings.length === 0) {
            return this.getNoMeetingsMessage();
        }
        return `${this.getNumberOfMeetings(meetings)} ${this.getMoreInfoAboutMeetings(meetings)}`
    }

    getEventsForToday(conv, accessToken) {
        fetch('https://graph.microsoft.com/v1.0/me/calendarview?StartDateTime=2020-02-27T01:00:00&EndDateTime=2020-02-29T01:00:00', {
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`},
        }).then(res => res.json())
            .then(json => conv.close(formatResponseForToday(json)))
            .catch((error) => console.log('error:', error));
    }
}

module.exports = Outlook;
