import E from "./init.js";
var e = new E();
const pause_svg =
  "<svg id='pause-icon' width='24px' height='24px' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>" +
  "<path d='M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z'/>" +
  "</svg>";
const play_svg =
  "<svg id='play-icon' width='24px' height='24px' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>" +
  "<path d='M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z' />" +
  "</svg>";
var togglePlay = document.getElementById("toggle-play");
var shuffleBtn = document.getElementById("shuffle-icon");
var repeatBtn = document.getElementById("repeat-icon");
const track = "rgb(29, 185, 84)";
const context = "rgb(29, 185, 85)";

e.getAccessToken().then((t) => {
  e.getCurrentPlayback(t)
    .then((current) => {
      insertDOM(current);
      eventListeners(t, current.device.id);
    })
    .catch((err) => {
      e.getRecentlyPlayedTrack(t)
        .then((recent) => {
          insertDOM(recent);
          e.getActiveDevice(t)
            .then((d) => {
              eventListeners(t, d.id);
            }).catch(e => console.log(e))
        })
        .catch((er) => {
          document.getElementById("left-panel-song-heading").innerHTML =
            "<a href='https://accounts.spotify.com/en/login' target='_blank' rel='noreferrer noopener' class='bold-text-link'>Sign In</a>";
          document.getElementById("right-panel").src = "/images/spotify128.png";
          document.getElementById("left-panel-song-sub-heading").innerHTML =
            "<div>No device or not signed in premium? <a href='/help' target='_blank' rel='noreferrer noopener'>help</a></div>";
          document.getElementById("updates").innerHTML = "";
          console.log(er);
        });
      console.log(err);
    });
});

function insertDOM(res) {
  var item = res.item;
  var imgs = item.album.images;
  document.getElementById("right-panel").src =
    imgs[1].url || imgs[0].url || imgs[2].url;

  document.getElementById(
    "left-panel-song-heading"
  ).innerHTML = `<a href="${item.external_urls.spotify}" target="_blank" class="bold-text-link title-link">${item.name}</a>`;

  document.getElementById("left-panel-song-sub-heading").innerHTML = "";
  item.artists.forEach((artist, index) => {
    var str =
      `<a href=${artist.external_urls.spotify}target="_blank" class="bold-text-link artists-link">${artist.name}` +
      (item.artists[index + 1] ? ", " : "") +
      "</a>";
    document.getElementById("left-panel-song-sub-heading").innerHTML += str;
  });

  if (res.repeat_state) {
    if (res.repeat_state === "track") {
      document.getElementById("repeat-icon").style.color = track;
      repeatBtn.classList.add("badge");
    } else if (res.repeat_state === "context") {
      document.getElementById("repeat-icon").style.color = context;
    }
  }
  if (res.shuffle_state) {
    document.getElementById("shuffle-icon").style.color = "rgb(29, 185, 84)";
  }
  document.getElementById("toggle-play").innerHTML = res.is_playing
    ? pause_svg
    : play_svg;

  var spotifyurl = item.album.external_urls["spotify"];
  if (spotifyurl) {
    document.getElementById("album-link").href = spotifyurl;
  }
  if (res.device) {
    chrome.browserAction.setTitle({ title: `Device: ${res.device.name}` });
  }
}

function eventListeners(t, d) {
  togglePlay.addEventListener("click", function (event) {
    if (
      event.target.id === "pause-icon" ||
      event.target.parentNode.id === "pause-icon"
    ) {
      e.pause(t, d)
        .then((success) =>
          success
            ? (togglePlay.innerHTML = play_svg)
            : () => {
              console.log('ejlks')
                displayError(togglePlay.style.color, "PlaybackError");
              }
        )
        .catch((err) => displayError(togglePlay.style.color, err));
    } else if (
      event.target.id === "play-icon" ||
      event.target.parentNode.id === "play-icon"
    ) {
      e.play(t, d)
        .then((success) =>
          success
            ? (togglePlay.innerHTML = pause_svg)
            : () => {
              console.log('ejlks')
                displayError(togglePlay.style.color, "PlaybackError");
              }
        )
        .catch((err) => displayError(togglePlay.style.color, err));
    }
  });

  document
    .getElementById("skip-backwards")
    .addEventListener("click", function () {
      e.prev(t, d).then((success) => {
        success
          ? location.reload()
          : displayError(
              document.getElementById("skip-backwards").style.color,
              "Request Error"
            );
      });
    });

  document
    .getElementById("skip-forwards")
    .addEventListener("click", function () {
      e.next(t, d).then((success) => {
        success
          ? location.reload()
          : displayError(
              document.getElementById("skip-forwards").style.color,
              "Request Error"
            );
      });
    });

  shuffleBtn.addEventListener("click", function () {
    var s_state = shuffleBtn.style.color === "" ? true : false;
    e.shuffle(t, s_state).then((success) => {
      if (success) {
        shuffleBtn.style.color = s_state === false ? "" : "rgb(29, 185, 84)";
      } else {
        displayError(shuffleBtn.style.color, "Request Error");
      }
    });
  });

  repeatBtn.addEventListener("click", function () {
    var r_state = "off";
    switch (repeatBtn.style.color) {
      case "":
        r_state = "context";
        break;
      case context:
        r_state = "track";
        break;
      case track:
        r_state = "off";
        break;
      default:
        break;
    }
    e.repeat(t, r_state).then((success) => {
      if (success) {
        switch (r_state) {
          case "off":
            repeatBtn.style.color = "";
            repeatBtn.classList.remove("badge");
            break;
          case "track":
            repeatBtn.style.color = track;
            repeatBtn.classList.add("badge");
            break;
          case "context":
            repeatBtn.style.color = context;
            break;
          default:
            break;
        }
      } else {
        displayError(repeatBtn.style.color, "Request Error");
      }
    });
  });
}

function displayError(item, message) {
  console.log(item, message);
  item = "red";
  document.getElementById(
    "updates"
  ).innerHTML = `<div id='errors'>${message}</div>`;
}
