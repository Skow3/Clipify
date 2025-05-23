
# 📋 Clipify - Smart Clipboard History Extension

**Clipify** is a Chrome extension that keeps track of your last copied items and lets you quickly paste any of them using a convenient pop-up triggered by `Ctrl + Shift + V`.

---

## ✨ Features

- ✅ Remembers your last 10 copied items
- 🔍 Press `Ctrl + Shift + V` to show the clipboard dialog
- 🖱️ Click to copy any item again
- 🗑️ Delete specific entries from the list
- 🧼 Clear all saved entries with one click
- ⚡ Smooth feedback animation instead of intrusive alerts

---

## 🛠️ Installation

1. **Clone or download this repo:**

   ```bash
   git clone https://github.com/yourusername/clipify.git
   cd clipify
    ```

2. **Open Chrome** and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode** (top right)

4. Click **"Load unpacked"** and select the `clipify` folder

5. Press `Ctrl + Shift + V` anywhere in Chrome to trigger the popup.

---

## 📁 Project Structure

```bash
clipify/
├── background.js         # Listens for keyboard command and opens popup
├── manifest.json         # Chrome extension manifest (v3)
├── popup.html            # Clipboard UI
├── popup.js              # JS logic for managing history
├── style.css             # Styles for popup and animation
└── icons/                # (Optional) Folder for extension icon
```


## ⌨️ Keyboard Shortcut

You can customize the keyboard shortcut:

1. Go to: `chrome://extensions/shortcuts`
2. Look for "Clipify"
3. Change `Ctrl + Shift + V` to any shortcut you like


## 🔒 Permissions Used

* `storage`: To save clipboard history
* `clipboardRead` / `clipboardWrite`: For accessing clipboard
* `commands`: To listen for keyboard shortcut
* `scripting`: (If used later for advanced clipboard injections)

---

## 📷 Screenshot

![Clipify Screenshot](screenshot.png)

> You can add your own screenshot here showing the extension popup.

---

## 🧑‍💻 Author

**Skowport**

Feel free to fork, contribute, or open an issue!

---

## 📄 License

MIT License – free to use, modify, and distribute.

```

---

Let me know if you'd like me to:
- Add a license file (MIT, Apache, etc.)
- Write a `CONTRIBUTING.md`
- Create `screenshot.png` for the readme  
- Package the zip for Chrome Web Store upload

Ready to polish it to perfection!
```

# SCREENSHOTS 

![Screenshot From 2025-05-23 21-06-33](https://github.com/user-attachments/assets/9ef18f1d-9f26-4bc8-bfd8-75764e08114d)
![Screenshot From 2025-05-23 21-07-36](https://github.com/user-attachments/assets/c8fea1d1-ed92-4217-bfa4-8da93c3e2312)


