export default class e {
  apiEndPoint = "https://api.spotify.com";

  getActiveDevice = async (t) => {
    try {
      return await fetch(`${this.apiEndPoint}/v1/me/player/devices`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: "Bearer " + t,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          var active = json.devices.find((c) => c.is_active === true);
          return active ? active : json.devices[0];
        });
    } catch (e) {
      return;
    }
  };

  getAccessToken = async () => {
    let t = null;
    try {
      await fetch("https://open.spotify.com/get_access_token")
        .then((res) => res.json())
        .then((json) => (t = json.accessToken));
    } catch (e) {}
    return t;
  };

  getCurrentPlayback = async (t) => {
    try {
      return await fetch(`${this.apiEndPoint}/v1/me/player`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + t,
        },
      }).then((res) => res.json());
    } catch (e) {
      return;
    }
  };

  getRecentlyPlayedTrack = async (t) => {
    try {
      return await fetch(`${this.apiEndPoint}/v1/me/player/recently-played`, {
        headers: {
          Authorization: "Bearer " + t,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res && res.items.length) {
            const { track: t, context: c } = res.items[0];
            return {
              item: t,
              context: c,
            };
          }
        });
    } catch (t) {
      return;
    }
  };
}
