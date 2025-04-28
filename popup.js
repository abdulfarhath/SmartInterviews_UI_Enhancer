// SmartInterviews Dark Mode - Popup Script

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  // Load current setting from storage
  chrome.storage.local.get({ darkMode: true }, function(data) {
    darkModeToggle.checked = data.darkMode;
    
    // Apply dark mode to popup if enabled
    if (data.darkMode) {
      document.body.classList.add('popup-dark');
    }
  });
  
  // Handle toggle changes
  darkModeToggle.addEventListener('change', function() {
    const isDarkMode = darkModeToggle.checked;
    
    // Save setting
    chrome.storage.local.set({ darkMode: isDarkMode });
    
    // Apply dark mode to popup
    if (isDarkMode) {
      document.body.classList.add('popup-dark');
    } else {
      document.body.classList.remove('popup-dark');
    }
    
    // Send message to active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggle",
          darkMode: isDarkMode
        });
      }
    });
  });
});