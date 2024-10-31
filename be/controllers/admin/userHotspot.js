const HotspotProfile = require("../../models/HotspotProfile");
const mikrotikAction = require("../../lib/mikrotikAction");

exports.addUserHotspot = async (req, res) => {
  const { name, password, profile, comment } = req.body;

  if (!name || !profile) {
    return res.json({
      status: 400,
      message: "Invalid request",
    });
  }

  try {
 

    const profileData = await HotspotProfile.findById(profile).populate(
      "router"
    );

    if (!profileData) {
      return res.json({
        status: 400,
        message: "Profile not found",
      });
    }

    const mikrotik = await mikrotikAction(
      profileData.router,
      "put",
      "ip/hotspot/user",
      {
        name: name,
        password: password,
        profile: profileData.name,
        "limit-uptime": profileData.sessionTimeout,
        comment: comment,
      }
    );

    console.log(mikrotik.status);

    if (!mikrotik.status) {
      return res.json({
        status: 400,
        message: mikrotik.message,
        error: mikrotik.error,
      });
    }

    res.json({
      status: 200,
      message: "User hotspot created",
      data: mikrotik.data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
};

function generateRandomString(length, characters) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.addBatchUserHotspot = async (req, res) => {
  const {
    numberOfUsers,
    prefix,
    character,
    usernameLength,
    passwordLength,
    passwordEqualsUsername,
    profile,
  } = req.body;

  if (
    !numberOfUsers ||
    !character ||
    !usernameLength ||
    !profile ||
    (passwordEqualsUsername === "Tidak" && !passwordLength)
  ) {
    return res.json({
      status: 400,
      message: "Invalid request",
    });
  }

  try {
    const profileData = await HotspotProfile.findById(profile).populate(
      "router"
    );

    if (!profileData) {
      return res.json({
        status: 400,
        message: "Profile not found",
      });
    }

    const characterMap = {
      abcd: "abcdefghijklmnopqrstuvwxyz",
      AbCd: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      ABCD: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      123: "0123456789",
      abc123: "abcdefghijklmnopqrstuvwxyz0123456789",
      AbCd123: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      ABCD123: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    };

    const characters = characterMap[character];
    const createdUsers = [];

    for (let i = 0; i < numberOfUsers; i++) {
      const username =
        prefix + generateRandomString(parseInt(usernameLength), characters);
      const password =
        passwordEqualsUsername === "Ya"
          ? username
          : prefix + generateRandomString(parseInt(passwordLength), characters);

      const mikrotik = await mikrotikAction(
        profileData.router,
        "put",
        "ip/hotspot/user",
        {
          name: username,
          password: password,
          profile: profileData.name,
          "limit-uptime": profileData.sessionTimeout,
          comment: `vc-${new Date().getTime()}`,
        }
      );

      if (mikrotik.status) {
        createdUsers.push({ username, password });
      } else {
        console.error(`Failed to create user ${username}: ${mikrotik.message}`);
      }
    }

    res.json({
      status: 201,
      message: `${createdUsers.length} user hotspots created`,
      data: createdUsers,
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
};
