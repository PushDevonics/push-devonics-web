import {BASE_URL} from "../vars.js";

const subscribe = (pushUser, appId) => {
    return fetch(`${BASE_URL}/api/user/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
            registration_id: pushUser.registrationId,
            app_id: appId,
            platform_type: 'Web',
            country: pushUser.country,
            language: pushUser.language,
            timezone: pushUser.timezone
        })
    })
        .then(response => response.json())
}

const session = (currentToken) => {
    return fetch(`${BASE_URL}/api/user/${currentToken}/session`)
        .then(response => response.json())
}

export default {
    subscribe,
    session
}