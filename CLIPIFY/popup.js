const list = document.getElementById("clipboardList");
const searchInput = document.getElementById("searchInput");
const textarea = document.getElementById("clipInput");
const saveBtn = document.getElementById("saveClip");
const clearBtn = document.getElementById("clearClips");
const contextMenu = document.getElementById("contextMenu");
let selectedIndex = -1;

function updateList(filter = "") {
  chrome.storage.local.get(["clipboardHistory", "favorites"], (data) => {
    const history = data.clipboardHistory || [];
    const favorites = data.favorites || [];
    list.innerHTML = "";
    
    // Filter and sort: favorites first, then others
    const filtered = history.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
    const sorted = [
      ...filtered.filter(item => favorites.includes(item)),
      ...filtered.filter(item => !favorites.includes(item))
    ];

    sorted.forEach((item, index) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", index);
      if (favorites.includes(item)) li.classList.add("favorite");
      li.innerHTML = `
        <span class="clip-text">${item}</span>
        <button class="favorite-btn" title="${favorites.includes(item) ? 'Unfavorite' : 'Favorite'}">
          <svg viewBox="0 0 24 24" fill="${favorites.includes(item) ? '#facc15' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
        <button class="delete-btn" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      `;
      li.addEventListener("click", (e) => {
        if (e.target.closest(".delete-btn") || e.target.closest(".favorite-btn")) return;
        navigator.clipboard.writeText(item).then(flashIcon);
      });
      li.addEventListener("contextmenu", (e) => showContextMenu(e, item));
      list.appendChild(li);
    });

    selectedIndex = sorted.length > 0 ? 0 : -1;
    updateSelected();
  });
}

function flashIcon() {
  const icon = document.getElementById("flashIcon");
  icon.style.display = "block";
  setTimeout(() => {
    icon.style.display = "none";
  }, 1000);
}

function showContextMenu(e, item) {
  e.preventDefault();
  contextMenu.style.display = "block";
  contextMenu.style.left = `${Math.min(e.clientX, 350)}px`; // Prevent overflow
  contextMenu.style.top = `${Math.min(e.clientY, 250)}px`;
  contextMenu.dataset.item = item;
}

function hideContextMenu() {
  contextMenu.style.display = "none";
}

function updateSelected() {
  const items = list.querySelectorAll("li");
  items.forEach((item, index) => {
    item.classList.toggle("selected", index === selectedIndex);
    if (index === selectedIndex) {
      item.scrollIntoView({ block: "nearest" });
    }
  });
}

saveBtn.onclick = () => {
  const text = textarea.value.trim();
  if (text) {
    chrome.storage.local.get("clipboardHistory", (data) => {
      const history = data.clipboardHistory || [];
      if (!history.includes(text)) { // Prevent duplicates
        history.unshift(text);
        chrome.storage.local.set({ clipboardHistory: history.slice(0, 10) }, () => {
          textarea.value = "";
          updateList(searchInput.value);
        });
      } else {
        textarea.value = "";
        updateList(searchInput.value);
      }
    });
  }
};

clearBtn.onclick = () => {
  if (confirm("Clear all clipboard history?")) {
    chrome.storage.local.set({ clipboardHistory: [], favorites: [] }, () => {
      updateList();
      flashIcon();
    });
  }
};

searchInput.addEventListener("input", () => {
  updateList(searchInput.value);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#contextMenu") && !e.target.closest("li")) {
    hideContextMenu();
  }
});

contextMenu.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  const item = contextMenu.dataset.item;
  if (action === "copy") {
    navigator.clipboard.writeText(item).then(flashIcon);
  } else if (action === "delete") {
    chrome.storage.local.get(["clipboardHistory", "favorites"], (data) => {
      const history = data.clipboardHistory || [];
      const favorites = data.favorites || [];
      const newHistory = history.filter(i => i !== item);
      const newFavorites = favorites.filter(i => i !== item);
      chrome.storage.local.set({ clipboardHistory: newHistory, favorites: newFavorites }, () => {
        updateList(searchInput.value);
      });
    });
  } else if (action === "favorite") {
    chrome.storage.local.get("favorites", (data) => {
      const favorites = data.favorites || [];
      if (favorites.includes(item)) {
        chrome.storage.local.set({ favorites: favorites.filter(i => i !== item) }, () => {
          updateList(searchInput.value);
        });
      } else {
        chrome.storage.local.set({ favorites: [item, ...favorites] }, () => {
          updateList(searchInput.value);
        });
      }
    });
  }
  hideContextMenu();
});

list.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  const favoriteBtn = e.target.closest(".favorite-btn");
  if (deleteBtn) {
    const item = deleteBtn.parentElement.querySelector(".clip-text").textContent;
    chrome.storage.local.get(["clipboardHistory", "favorites"], (data) => {
      const history = data.clipboardHistory || [];
      const newHistory = history.filter(i => i !== item);
      const favorites = data.favorites || [];
      const newFavorites = favorites.filter(i => i !== item);
      chrome.storage.local.set({ clipboardHistory: newHistory, favorites: newFavorites }, () => {
        updateList(searchInput.value);
      });
    });
  } else if (favoriteBtn) {
    const item = favoriteBtn.parentElement.querySelector(".clip-text").textContent;
    chrome.storage.local.get("favorites", (data) => {
      const favorites = data.favorites || [];
      if (favorites.includes(item)) {
        chrome.storage.local.set({ favorites: favorites.filter(i => i !== item) }, () => {
          updateList(searchInput.value);
        });
      } else {
        chrome.storage.local.set({ favorites: [item, ...favorites] }, () => {
          updateList(searchInput.value);
        });
      }
    });
  }
});

document.addEventListener("keydown", (e) => {
  const items = list.querySelectorAll("li");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    updateSelected();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    updateSelected();
  } else if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault();
    const item = items[selectedIndex].querySelector(".clip-text").textContent;
    navigator.clipboard.writeText(item).then(flashIcon);
  }
});

updateList();