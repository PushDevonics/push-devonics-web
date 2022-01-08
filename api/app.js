import {BASE_URL} from "../vars.js";

const getApp = appId => {
    return fetch(`${BASE_URL}/api/app/${appId}/view`)
        .then(response => response.json())
        .then(data => data.sender_id)
}

export default {
    getApp
}