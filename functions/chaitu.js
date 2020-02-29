'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');
const {SignIn} = require('actions-on-google');
const fetch = require('node-fetch');


// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true,
    clientId: 'a4e9546f-c4ac-4390-99f2-a37dd2f0c7f1',
});

// axios.defaults.headers.post['Content-Type'] = 'application/json';

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
// app.intent('favorite color', (conv, {color}) => {
//    const luckyNumber = color.length;
// Respond with the user's lucky number and end the conversation.
//    conv.close('Your lucky number is ' + luckyNumber);
// });

// app.intent('Default Welcome Intent');
const getNoMeetingsMessage = () => 'You have no meetings today.';

const getNumberOfMeetings = (meetings) => `You have ${meetings.length} ${meetings.length === 1 ? 'meeting' : 'meetings'} today`;

const getOrganizerName = (meeting) => meeting.organizer.emailAddress.name || 'Name not available';

const getMoreInfoAboutMeetings = (meetings) => {
    if (meetings.length === 1) {
        return `Meeting 1 - ${meetings[0].subject} with ${getOrganizerName(meetings[0])}`;
    }
    return meetings.map((meeting, index) => {
        return `Meeting ${index+1} - ${meeting.subject} with ${getOrganizerName(meeting)}`;
    });
};

const formatResponseForToday = ({value}) => {
    const meetings = value;
    if (!meetings || meetings.length === 0 ) {
        return getNoMeetingsMessage();
    }
    return `${getNumberOfMeetings(meetings)} ${getMoreInfoAboutMeetings(meetings)}`;
};


const getEventsForToday = (conv, accessToken) => fetch('https://graph.microsoft.com/v1.0/me/calendarview?StartDateTime=2020-02-27T01:00:00&EndDateTime=2020-02-29T01:00:00', {
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
}).then((res) => res.json())
    .then((json) => conv.close(formatResponseForToday(json)))
    .catch((error) => console.log('error:', error));

app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new SignIn());
});

app.intent('Get Signin', (conv, params, signin) => {
    console.log(signin.status);
    if (signin.status === 'OK') {
        const accessToken = conv.user.access.token; // possibly do something with access token
        console.log('conv.user: ', conv.user);
        // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        conv.ask('Great, Now you have signed in successfully. Working on your query.');
        return getEventsForToday(conv, accessToken);
    } else {
        conv.ask(`I won't be able to save your data, but what do you want to do next?`);
    }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
