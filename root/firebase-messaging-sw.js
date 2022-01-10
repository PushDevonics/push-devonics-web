importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js');
importScripts('https://push.devonics.pro/assets/devonics-webpush/firebase/messaging.js');

const SENDER_ID = '';

const transition = ({registrationId, pushType, pushId}) => {
    return fetch(`https://push.devonics.pro/api/user/${registrationId}/transition`, {
        method: 'POST',
        body: JSON.stringify({
            registration_id: registrationId,
            push_type: pushType,
            push_id: pushId
        })
    })
}

firebase.initializeApp({
    messagingSenderId: SENDER_ID
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('Handling background message', payload);
    payload.data.data = JSON.parse(JSON.stringify(payload.data));

    return self.registration.showNotification(payload.data.title, payload.data);
});

self.addEventListener('notificationclick', function(event){
    messaging.getToken()
        .then(function (currentToken) {
            if (currentToken) {
                let notificationData = event.notification.data
                transition({
                    registrationId: currentToken,
                    pushType: notificationData.push_type,
                    pushId: notificationData.push_id
                })
            } else {
                console.warn('Failed to get token.');
            }
        })
    const target = event.notification.data.click_action || '/';
    event.notification.close();

    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url === target && 'focus' in client) {
                return client.focus();
            }
        }

        return clients.openWindow(target);
    }));
});
