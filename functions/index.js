'use strict';

const {dialogflow} = require('actions-on-google');
const {SignIn} = require('actions-on-google');
const functions = require('firebase-functions');
const OutlookMeetings = require('./outlookMeetings');
const {Logging} = require('@google-cloud/logging');
const {messages} = require('./constants');
const logging = new Logging();
const outlookMeetings = new OutlookMeetings();

const app = dialogflow({debug: true, clientId: '6a3a9a7a-9a9f-4cd0-9add-f247b4c35797'});

app.intent('Default Welcome Intent', (conv) => {
    logging.log('Signing In via Oauth Flow');
    conv.ask(new SignIn('Signing in'));
});

app.intent('After SignIn', (conv, params, signin) => {
    logging.log('Signing In status' + signin.status);
    if (signin.status === 'OK') {
        logging.log('Signed In successfully!');
        conv.ask(messages.SIGNED_IN_MESSAGE);
    } else {
        logging.log('Signed In failed!');
        conv.ask(messages.SIGNIN_FAILED_MESSAGE);
    }
});

app.intent('Check Events', (conv, params) => {
    const token = conv.user.access.token;
    logging.log('Signing In status' + token);
    if (token !== undefined && token !== null) {
        logging.log('Checking events');
        conv.ask(messages.CHECKING_EVENTS);
        outlookMeetings.getEventsForToday(conv, token);
    } else {
        logging.log('Checking events failed because of sign in issue');
        conv.ask(messages.SIGNIN_FAILED_MESSAGE);
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
