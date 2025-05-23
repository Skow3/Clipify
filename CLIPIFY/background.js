chrome.commands.onCommand.addListener((command) => {
  if (command === "show_clipboard_dialog") {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 300
    });
  }
});
