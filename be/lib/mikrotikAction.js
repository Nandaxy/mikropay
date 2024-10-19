const axios = require("axios");

const mikrotikAction = async (router, method, endpoint, body) => {
    const url = `http://${router.ip}:${router.port}/rest/${endpoint}`;

    const auth = {
        username: router.username,
        password: router.password
    };

    try {
        const response = await axios({
            method: method,
            url: url,
            data: body,
            auth: auth,
            headers: {
                "Content-Type": "application/json"
            }
        });

        return { status: true, data: response.data };
    } catch (error) {
        return { status: false };
    }
};

module.exports = mikrotikAction;
