const ipLookUp = () => {
    return fetch('https://pro.ip-api.com/json/?key=I9ShYw6mCZh58E4')
            .then(response => response.json())
}

export default {
    ipLookUp
}