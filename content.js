// Simple dark mode implementation for SmartInterviews
console.log("SmartInterviews Dark Mode: Loading");

// Check if dark mode is enabled and apply immediately
chrome.storage.local.get({ darkMode: true }, function(data) {
  if (data.darkMode) {
    enableDarkMode();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggle") {
    if (request.darkMode) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
    sendResponse({success: true});
  }
  return true;
});

// Apply dark mode
function enableDarkMode() {
  document.documentElement.classList.add("si-dark-mode");
  
  // Force dark mode on dynamically loaded content
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Handle code editors specifically
            const editors = node.querySelectorAll('.ace_editor, .code-editor, .editor-container');
            editors.forEach(editor => {
              editor.classList.add('si-editor-dark');
            });
          }
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  console.log("SmartInterviews Dark Mode: Enabled");
}

// Disable dark mode
function disableDarkMode() {
  document.documentElement.classList.remove("si-dark-mode");
  console.log("SmartInterviews Dark Mode: Disabled");
}