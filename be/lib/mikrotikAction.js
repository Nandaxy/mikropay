const axios = require("axios");

const mikrotikAction = async (router, method, endpoint, body) => {

    // console.log(router.ip, router.port, router.username, router.password);

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
        return { status: false ,message : error.message, error: error};
    }
};

module.exports = mikrotikAction;
