const messages = {
    SIGNED_IN_MESSAGE: 'Hello! How may I help you?',
    SIGNIN_FAILED_MESSAGE: 'Hm. There was something wrong while you tried to sign in',
    CHECKING_EVENTS: 'Ok let me check your events',
    GETTING_EMAILS: 'Ok let me get your important emails',
};

const days = {
    TODAY: 'today',
    TOMORROW: 'tomorrow',
};

const api = {
    GET_CALENDAR_VIEW: `https://graph.microsoft.com/v1.0/me/calendarview?StartDateTime=$1&EndDateTime=$2`,
    GET_IMPORTANT_EMAILS: `https://graph.microsoft.com/v1.0/me/mailFolders('Inbox')/messages?$filter=importance eq 'high'&$select=sender,subject,body,importance`,
};

module.exports = {messages, api, days};
