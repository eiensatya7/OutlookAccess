const Messages = {
    SIGNED_IN_MESSAGE: 'Hello! How may I help you?',
    SIGNIN_FAILED_MESSAGE: 'Hm. There was something wrong while you tried to sign in',
};
const API = {
    GET_CALENDAR_VIEW: `https://graph.microsoft.com/v1.0/me/calendarview?StartDateTime=$1&EndDateTime=$2`,
};

module.exports = {Messages, API};
