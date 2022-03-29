import e from "../init.js";

var apiEndPoint = "https://api.spotify.com";

e.prototype.pause = async (t, device) => {
  try {
    return await fetch(`${apiEndPoint}/v1/me/player/pause` + (device ? `?device_id=${device}` : ''), {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + t,
      },
    })
      .then((res) => res.status === 204)
      .catch((err) => console.log(err));
  } catch (err) {
    throw err;
  }
};

e.prototype.play = async (t, device) => {
  try {
    return await fetch(`${apiEndPoint}/v1/me/player/play` + (device ? `?device_id=${device}` : ''), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + t,
      },
    })
      .then((res) => res.status === 204)
      .catch((err) => console.log(err));
  } catch (err) {
    throw err;
  }
};

e.prototype.next = async (t, device) => {
  try {
    return await fetch(`${apiEndPoint}/v1/me/player/next` + (device ? `?device_id=${device}` : ''), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + t,
      },
    })
      .then((res) => res.status === 204)
      .catch((err) => console.log(err));
  } catch (err) {
    throw err;
  }
};

e.prototype.prev = async (t, device) => {
  try {
    return await fetch(`${apiEndPoint}/v1/me/player/previous` + (device ? `?device_id=${device}` : ''), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + t,
      },
    })
      .then((res) => res.status === 204)
      .catch((err) => console.log(err));
  } catch (err) {
    throw err;
  }
};

e.prototype.shuffle = async (t, state) => {
  try {
    return await fetch(`${apiEndPoint}/v1/me/player/shuffle?state=${state}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + t,
      },
    }).then((res) => res.status === 204);
  } catch (err) {
    throw err;
  }
};

e.prototype.repeat = async (t, state) => {
  try {
    return await fetch(`${apiEndPoint}/v1/me/player/repeat?state=${state}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + t,
      },
    }).then((res) => res.status === 204);
  } catch (err) {
    throw err;
  }
};
