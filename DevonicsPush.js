import appApi from "./api/app.js";
import pushUserApi from "./api/pushUser.js";
import clientApi from "./api/client.js";
import {APP_ID} from "./vars.js";
import cookie from "./helpers/cookie.js";

const saveSessionCookie = (currentToken) => {
    console.log(currentToken)
    let firstVisit = cookie.getCookie('firstVisit')
    if(firstVisit === 'false') return
    pushUserApi.session(currentToken).then(response => {
        console.log(response)
    })
    cookie.setCookie('firstVisit', false)
}

const isTokenSaved = currentToken => {
    return window.localStorage.getItem('sentFirebaseMessagingToken') === currentToken;
}

const saveToken = currentToken => {
    if (!isTokenSaved(currentToken)) {
        console.log('Sending a token to the server...');
        clientApi.ipLookUp()
            .then(response => {
                pushUserApi.subscribe({
                    registrationId: currentToken,
                    country: response.countryCode,
                    timezone: response.timezone,
                    language: navigator.language
                        .substring(0,2)
                        .toUpperCase(),
                }, APP_ID)
                    .then(response => {
                        if(response.status === 'success'){
                            window.localStorage.setItem(
                                'sentFirebaseMessagingToken',
                                currentToken ? currentToken : ''
                            );
                        }
                    })
            })
    } else {
        saveSessionCookie(currentToken);
        console.log('The token has already been sent to the server.');
    }
}

const subscribe = (messaging) => {
    messaging.requestPermission()
        .then(function () {
            messaging.getToken()
                .then(function (currentToken) {
                    if (currentToken) {
                        saveToken(currentToken);
                    } else {
                        console.warn('Failed to get token.');
                    }
                })
                .catch(function (err) {
                    console.warn('An error occurred while getting the token.', err);
                });
        })
        .catch(function (err) {
            console.warn('Failed to get permission to show notifications.', err);
        });
}

const initialize = () => {
    appApi.getApp(APP_ID)
        .then(senderId => {
            firebase.initializeApp({
                messagingSenderId: senderId,
            });
            if ('Notification' in window) {
                const messaging = firebase.messaging();
                messaging.onTokenRefresh(onTokenRefresh)
                messaging.onMessage(onMessage)
                subscribe(messaging);
            }
        })
}

const onTokenRefresh = messaging => {
    messaging.getToken()
        .then(function(refreshedToken) {
            console.log('Token refreshed');
            saveToken(refreshedToken);
        })
        .catch(function(error) {
            console.error('Unable to retrieve refreshed token', error);
        });
}

const onMessage = payload => {
    console.log('Message received', payload);
    navigator.serviceWorker.register('/firebase-messaging-sw.js');
    Notification.requestPermission(function(permission) {
        if (permission === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
                payload.data.data = JSON.parse(JSON.stringify(payload.data));
                registration.showNotification(payload.data.title, payload.data);
            }).catch(function(error) {
                console.error('ServiceWorker registration failed', error);
            });
        }
    });
}

export default {
    initialize,
}