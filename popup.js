// popup.js - Handles the extension popup functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    chrome.storage.local.get({
      darkMode: false,
      splitScreen: false,
      fontSize: '14px',
      bookmarks: true,
      shortcuts: true,
      timer: true
    }, function(items) {
      // Apply saved settings to UI
      document.getElementById('darkMode').checked = items.darkMode;
      document.getElementById('splitScreen').checked = items.splitScreen;
      document.getElementById('fontSize').value = items.fontSize;
      document.getElementById('bookmarks').checked = items.bookmarks;
      document.getElementById('shortcuts').checked = items.shortcuts;
      document.getElementById('timer').checked = items.timer;
    });
  
    // Save settings when changed
    document.getElementById('darkMode').addEventListener('change', function(e) {
      saveSetting('darkMode', e.target.checked);
    });
  
    document.getElementById('splitScreen').addEventListener('change', function(e) {
      saveSetting('splitScreen', e.target.checked);
    });
  
    document.getElementById('fontSize').addEventListener('change', function(e) {
      saveSetting('fontSize', e.target.value);
    });
  
    document.getElementById('bookmarks').addEventListener('change', function(e) {
      saveSetting('bookmarks', e.target.checked);
    });
  
    document.getElementById('shortcuts').addEventListener('change', function(e) {
      saveSetting('shortcuts', e.target.checked);
    });
  
    document.getElementById('timer').addEventListener('change', function(e) {
      saveSetting('timer', e.target.checked);
    });
  
    // Clear data button
    document.getElementById('clearData').addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all saved data?')) {
        chrome.storage.local.clear(function() {
          alert('All data has been cleared.');
          window.close();
        });
      }
    });
  
    // Helper to save settings
    function saveSetting(key, value) {
      let data = {};
      data[key] = value;
      chrome.storage.local.set(data, function() {
        // Notify content script about the change
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0] && tabs[0].url.includes('smartinterviews.in')) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'settingChanged',
              setting: key,
              value: value
            });
          }
        });
      });
    }
  });