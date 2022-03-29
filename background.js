import E from "/popup/common/init.js";
const e = new E();

chrome.commands.onCommand.addListener(function (command) {
  e.getAccessToken().then((t) => {
    e.getActiveDevice(t).then((d) => {
      if (!d) return;
      switch (command) {
        case "toggle_play":
          e.getCurrentPlayback(t).then((current) => {
            current.is_playing ? e.pause(t, d.id) : e.play(t, d.id);
          });
          break;
        case "skip_backwards":
          e.prev(t, d.id);
          break;
        case "skip_forwards":
          e.next(t, d.id);
          break;
        default:
          break;
      }
    });
  });
});

chrome.contextMenus.create({
  id: "open_spotify_in_new_tab",
  title: "🎧 Open Spotify In Tab",
  contexts: ["page", "browser_action"],
});
chrome.contextMenus.create({
  id: "open_spotify_in_new_window",
  title: "🎵 Open Spotify In Window",
  contexts: ["browser_action"],
});

chrome.contextMenus.onClicked.addListener(function (data) {
  switch (data.menuItemId) {
    case "open_spotify_in_new_tab":
      openInTab();
      break;
    case "open_spotify_in_new_window":
      openInWindow();
      break;
    case "spotify_device_info":
      break;
  }
});

chrome.runtime.onInstalled.addListener(function ({ OnInstalledReason }) {
  if (OnInstalledReason == "install") {
    openInTab();
    chrome.storage.sync.set({ onstart: false, launchwindow: false });
  }
});
chrome.runtime.onStartup.addListener(function () {
  chrome.storage.sync.get(["onstart", "launchwindow"], function (data) {
    if (data.onstart) {
      if (data.launchwindow) {
        openInWindow();
        return;
      }
      openInTab();
      return;
    }
  });
});

function openInTab() {
  chrome.tabs.query(
    {
      currentWindow: true,
      url: "https://open.spotify.com/*",
    },
    function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, {
          active: true,
        });
        return;
      }
      chrome.tabs.create({
        url: "https://open.spotify.com/",
        active: true,
        selected: true,
      });
    }
  );
}

function openInWindow() {
  chrome.windows.getAll(
    {
      populate: true,
      windowTypes: ["popup"],
    },
    function (arr) {
      var e = arr.find((e) => {
        return e.tabs[0].url.match("https://open.spotify.com/*");
      });

      if (e) {
        chrome.windows.update(e.id, { focused: true });
        return;
      }

      chrome.windows.create({
        url: "https://open.spotify.com/",
        focused: true,
        type: "popup",
        width: 1000,
        height: 1000,
      });
    }
  );
}
