'use strict';

const {dialogflow} = require('actions-on-google');
const {SignIn} = require('actions-on-google');
const functions = require('firebase-functions');
const {Logging} = require('@google-cloud/logging');
const {messages} = require('./messages');
const logging = new Logging();

const app = dialogflow({debug: true, clientId: '6a3a9a7a-9a9f-4cd0-9add-f247b4c35797'});

app.intent('Default Welcome Intent', (conv) => {
    logging.log('Signing In via Oauth Flow');
    conv.ask(new SignIn('Signing in'));
});

app.intent('After SignIn', (conv, params, signin) => {
    logging.log('Signing In status' + signin.status);
    if (signin.status === 'OK') {
        logging.log('Signed In successfully!');
        // const access = conv.user.access.token;
        conv.ask(messages.SIGNED_IN_MESSAGE);
    } else {
        conv.ask(messages.SIGNIN_FAILED_MESSAGE);
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
