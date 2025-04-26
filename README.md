# SmartInterviews UI Enhancer

A browser extension that improves the user interface of SmartInterviews websites (hive.smartinterviews.in and smartinterviews.in) without requiring any backend services.

## Features

- **Dark Mode**: Reduces eye strain during long coding sessions
- **Split Screen View**: See problem statement and code editor simultaneously
- **Customizable Font Size**: Adjust text size to your preference
- **Problem Bookmarking**: Save your favorite problems for later (stored locally)
- **Keyboard Shortcuts**:
  - `Ctrl+Enter` - Submit code
  - `Ctrl+S` - Save code
  - `Esc` - Close modals
- **Timer Enhancements**: Visual indicators for time remaining

## Installation

### Chrome/Edge/Brave Installation
1. Download or clone this repository to your computer
2. Open Chrome/Edge/Brave and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension
5. The extension icon should appear in your browser toolbar

### Firefox Installation
1. Download or clone this repository to your computer
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and select the `manifest.json` file from the extension folder
4. The extension icon should appear in your browser toolbar

## Privacy & Data Storage

All data is stored locally on your device using browser storage:
- Settings are saved in your browser's extension storage
- Bookmarks are stored locally and not synced to any server
- No data is sent to any external servers

You can clear all stored data through the extension popup by clicking "Clear Saved Data".

## Development

The extension is structured as follows:
- `manifest.json` - Extension configuration
- `popup.html` & `popup.js` - Extension popup UI and logic
- `content.js` - The main script that modifies the website
- `styles.css` - Custom CSS styles applied to the website

To make changes, modify the files and reload the extension in your browser's extension management page.

## License

This project is open source and available under the MIT License.