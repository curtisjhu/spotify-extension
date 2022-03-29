chrome.storage.sync.get(["onstart", "launchwindow"], function (res) {
  document.getElementById("launchOnStart").checked = res.onstart;
  if (res.onstart && res.launchwindow) {
    document.getElementById('launch_window').checked = true;
  } else if (res.onstart && !res.launchwindow){
    document.getElementById('launch_tab').checked = true;
  } else {
    document.getElementById('launch_window').checked = false;
    document.getElementById('launch_tab').checked = false;
  }
});

document.getElementById("save-btn").addEventListener("click", function () {
  var onstart = document.getElementById("launchOnStart").checked,
    window = document.getElementById("launch_window").checked;
  chrome.storage.sync.set(
    { onstart: onstart, launchwindow: window },
    function () {
      document.getElementById("status").innerText = "Saved";
    }
  );
});

var modal_window = document.getElementById("modal-window");
document.getElementById("contact").onclick = function () {
  modal_window.style.display = "block";
};
document.getElementById("close-dialog").onclick = function () {
  modal_window.style.display = "none";
};
window.onclick = function (e) {
  if (e.target == modal_window) {
    modal_window.style.display = "none";
  }
};