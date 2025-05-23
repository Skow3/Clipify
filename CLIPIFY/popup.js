const list = document.getElementById("clipboardList");
const textarea = document.getElementById("clipInput");
const saveBtn = document.getElementById("saveClip");
const clearBtn = document.getElementById("clearClip");

function updateList() {
  chrome.storage.local.get("clipboardHistory", (data) => {
    list.innerHTML = "";
    (data.clipboardHistory || []).forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.onclick = () => {
        navigator.clipboard.writeText(item).then(() => {
          function flashIcon() {
  const icon = document.getElementById("flashIcon");
  icon.style.display = "block";
  icon.style.opacity = "1";
  
  // Reset animation
  icon.style.animation = 'none';
  icon.offsetHeight;
  icon.style.animation = null;

  // Auto-hide
  setTimeout(() => {
    icon.style.display = "none";
  }, 1000);
}

li.onclick = () => {
  navigator.clipboard.writeText(item).then(() => {
    flashIcon();
  });
};

        });
      };
      list.appendChild(li);
    });
  });
}

saveBtn.onclick = () => {
  const text = textarea.value.trim();
  if (text) {
    chrome.storage.local.get("clipboardHistory", (data) => {
      const history = data.clipboardHistory || [];
      if (history[0] !== text) {
        history.unshift(text);
        const newHistory = history.slice(0, 10);
        chrome.storage.local.set({ clipboardHistory: newHistory }, updateList);
        textarea.value = "";
      }
    });
  }
};


updateList();
