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

chrome.contextMenus.create({
  id: "clipify-paste",
  title: "Paste Latest Clip",
  contexts: ["all"]
});

chrome.contextMenus.create({
  id: "clipify-open",
  title: "Open Clipify",
  contexts: ["all"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "clipify-paste") {
    chrome.storage.local.get("clipboardHistory", (data) => {
      const history = data.clipboardHistory || [];
      if (history.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            const input = document.createElement("textarea");
            document.body.appendChild(input);
            input.value = text;
            input.select();
            document.execCommand("paste");
            document.body.removeChild(input);
          },
          args: [history[0]]
        });
      }
    });
  } else if (info.menuItemId === "clipify-open") {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 300
    });
  }
});