'use strict';

const {dialogflow} = require('actions-on-google');
const {SignIn} = require('actions-on-google');
const functions = require('firebase-functions');
const {getEventsForSpecificDay} = require('./outlookHelper');
const {getImportantEmails} = require('./outlookHelper');
const {messages, days} = require('./constants');
const app = dialogflow({debug: true, clientId: '612e8a2d-4a16-4743-912c-1cda07282c46'});
const logging = console;

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
    if (token) {
        logging.log('Checking events');
        conv.ask(`${messages.CHECKING_EVENTS} ${params['date-time'] || days.TODAY}`);
        return getEventsForSpecificDay(conv, params, token);
    } else {
        logging.log('Checking events failed because of sign in issue');
        conv.ask(messages.SIGNIN_FAILED_MESSAGE);
    }
});

app.intent('Get my Important emails', (conv) => {
    const token = conv.user.access.token;
    logging.log('Signing In status' + token);
    if (token) {
        logging.log('Getting Important emails');
        conv.ask(`${messages.GETTING_EMAILS}`);
        return getImportantEmails(conv, token);
    } else {
        logging.log('Getting emails failed because of sign in issue');
        conv.ask(messages.SIGNIN_FAILED_MESSAGE);
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
