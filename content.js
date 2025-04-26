// content.js - Applies UI enhancements to SmartInterviews websites

// Store for bookmarked problems
let bookmarkedProblems = {};

// Initialize the extension
async function initExtension() {
  // Load settings and bookmarks
  const settings = await chrome.storage.local.get({
    darkMode: false,
    splitScreen: false,
    fontSize: '14px',
    bookmarks: true,
    shortcuts: true,
    timer: true,
    bookmarkedProblems: {}
  });
  
  bookmarkedProblems = settings.bookmarkedProblems;
  
  // Apply initial settings
  applyDarkMode(settings.darkMode);
  applySplitScreen(settings.splitScreen);
  applyFontSize(settings.fontSize);
  
  if (settings.bookmarks) enableBookmarks();
  if (settings.shortcuts) enableKeyboardShortcuts();
  if (settings.timer) enhanceTimer();
  
  // Add mutation observer to handle dynamic content
  observeDOMChanges();
}

// Apply dark mode theme
function applyDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('si-dark-mode');
  } else {
    document.body.classList.remove('si-dark-mode');
  }
}

// Apply split screen layout
function applySplitScreen(enabled) {
  if (enabled) {
    // Check if we're on a problem page
    const problemStatement = document.querySelector('.problem-statement, .question-description');
    const codeEditor = document.querySelector('.code-editor, .editor-container');
    
    if (problemStatement && codeEditor) {
      // Create split view container if it doesn't exist
      let splitContainer = document.querySelector('.si-split-container');
      if (!splitContainer) {
        splitContainer = document.createElement('div');
        splitContainer.className = 'si-split-container';
        
        // Get the parent element that contains both
        const parent = findCommonAncestor(problemStatement, codeEditor);
        if (parent) {
          // Wrap the content in the split container
          parent.style.display = 'flex';
          parent.style.flexDirection = 'row';
          problemStatement.style.width = '50%';
          problemStatement.style.overflow = 'auto';
          codeEditor.style.width = '50%';
        }
      }
    }
  } else {
    // Restore original layout
    document.querySelectorAll('.problem-statement, .question-description, .code-editor, .editor-container').forEach(el => {
      el.style.width = '';
    });
    document.querySelectorAll('.si-split-container').forEach(el => {
      el.replaceWith(...el.childNodes);
    });
  }
}

// Apply font size changes
function applyFontSize(size) {
  // Target code editor and problem statement
  const elements = document.querySelectorAll('.code-editor, .editor-container, .problem-statement, .question-description');
  elements.forEach(el => {
    el.style.fontSize = size;
  });
}

// Enable problem bookmarking functionality
function enableBookmarks() {
  // Find all problem links or cards
  const problemElements = document.querySelectorAll('.problem-card, .problem-link, .question-item');
  
  problemElements.forEach(el => {
    // Extract problem ID from element
    const problemId = extractProblemId(el);
    if (!problemId) return;
    
    // Check if bookmark button already exists
    if (el.querySelector('.si-bookmark-btn')) return;
    
    // Create bookmark button
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = 'si-bookmark-btn';
    bookmarkBtn.innerHTML = bookmarkedProblems[problemId] ? '★' : '☆';
    bookmarkBtn.title = bookmarkedProblems[problemId] ? 'Remove bookmark' : 'Bookmark this problem';
    
    bookmarkBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (bookmarkedProblems[problemId]) {
        delete bookmarkedProblems[problemId];
        bookmarkBtn.innerHTML = '☆';
        bookmarkBtn.title = 'Bookmark this problem';
      } else {
        // Get problem details
        const title = extractProblemTitle(el);
        bookmarkedProblems[problemId] = {
          title: title,
          url: window.location.href,
          timestamp: Date.now()
        };
        bookmarkBtn.innerHTML = '★';
        bookmarkBtn.title = 'Remove bookmark';
      }
      
      // Save updated bookmarks
      chrome.storage.local.set({ bookmarkedProblems });
    });
    
    // Add button to the element
    el.style.position = 'relative';
    el.appendChild(bookmarkBtn);
  });
}

// Enable keyboard shortcuts
function enableKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Control + Enter to submit code
    if (e.ctrlKey && e.key === 'Enter') {
      const submitButton = document.querySelector('.submit-btn, button[type="submit"], button:contains("Submit")');
      if (submitButton) {
        submitButton.click();
      }
    }
    
    // Escape to close any open modal
    if (e.key === 'Escape') {
      const closeBtn = document.querySelector('.close-btn, .modal-close, .close-modal');
      if (closeBtn) {
        closeBtn.click();
      }
    }
    
    // Ctrl+S to save code
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      const saveButton = document.querySelector('.save-btn, button:contains("Save")');
      if (saveButton) {
        saveButton.click();
      }
    }
  });
}

// Enhance timer with visual indicators
function enhanceTimer() {
  const timerElement = document.querySelector('.timer, .countdown, .time-remaining');
  if (!timerElement) return;
  
  // Create a wrapper for the timer
  const wrapper = document.createElement('div');
  wrapper.className = 'si-timer-wrapper';
  
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'si-timer-progress';
  
  // Wrap the timer
  timerElement.parentNode.insertBefore(wrapper, timerElement);
  wrapper.appendChild(timerElement);
  wrapper.appendChild(progressBar);
  
  // Update progress bar based on time
  setInterval(() => {
    const timeText = timerElement.textContent;
    const timeMatch = timeText.match(/(\d+):(\d+):(\d+)/);
    
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const seconds = parseInt(timeMatch[3]);
      
      // Calculate total seconds remaining
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // We don't know the total time of the contest, but we can use a color gradient
      if (totalSeconds < 300) { // Less than 5 minutes
        progressBar.style.backgroundColor = 'red';
      } else if (totalSeconds < 900) { // Less than 15 minutes
        progressBar.style.backgroundColor = 'orange';
      } else {
        progressBar.style.backgroundColor = 'green';
      }
      
      // Pulse animation for last 5 minutes
      if (totalSeconds < 300) {
        timerElement.classList.add('si-timer-urgent');
      } else {
        timerElement.classList.remove('si-timer-urgent');
      }
    }
  }, 1000);
}

// Helper function to find common ancestor of two DOM elements
function findCommonAncestor(el1, el2) {
  const path1 = [];
  let node = el1;
  while (node) {
    path1.push(node);
    node = node.parentNode;
  }
  
  node = el2;
  while (node) {
    const index = path1.indexOf(node);
    if (index !== -1) {
      return node;
    }
    node = node.parentNode;
  }
  
  return null;
}

// Helper function to extract problem ID from element
function extractProblemId(element) {
  // Try to get ID from data attribute
  if (element.dataset.problemId) return element.dataset.problemId;
  
  // Try to get ID from URL in a link
  const link = element.querySelector('a');
  if (link && link.href) {
    const match = link.href.match(/problem[\/=](\w+)/i);
    if (match) return match[1];
  }
  
  // Try to get ID from the element's own href if it's a link
  if (element.href) {
    const match = element.href.match(/problem[\/=](\w+)/i);
    if (match) return match[1];
  }
  
  // Try to extract from ID attribute
  if (element.id && element.id.startsWith('problem-')) {
    return element.id.replace('problem-', '');
  }
  
  return null;
}

// Helper function to extract problem title
function extractProblemTitle(element) {
  // Try to find title element
  const titleElement = element.querySelector('.problem-title, .question-title, h3, h4');
  if (titleElement) return titleElement.textContent.trim();
  
  // If no specific title element, use the text content
  return element.textContent.trim().substring(0, 50);
}

// Watch for DOM changes to handle dynamically loaded content
function observeDOMChanges() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        // Re-apply features for new content
        chrome.storage.local.get({
          bookmarks: true
        }, function(settings) {
          if (settings.bookmarks) enableBookmarks();
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'settingChanged') {
    // Apply the changed setting
    switch (request.setting) {
      case 'darkMode':
        applyDarkMode(request.value);
        break;
      case 'splitScreen':
        applySplitScreen(request.value);
        break;
      case 'fontSize':
        applyFontSize(request.value);
        break;
      case 'bookmarks':
        if (request.value) {
          enableBookmarks();
        } else {
          // Remove bookmark buttons
          document.querySelectorAll('.si-bookmark-btn').forEach(el => el.remove());
        }
        break;
      case 'shortcuts':
        // Nothing to do here as shortcuts are event-based
        break;
      case 'timer':
        if (request.value) {
          enhanceTimer();
        } else {
          // Remove enhanced timer elements
          document.querySelectorAll('.si-timer-wrapper, .si-timer-progress').forEach(el => {
            if (el.className === 'si-timer-wrapper') {
              const timer = el.querySelector('.timer, .countdown, .time-remaining');
              if (timer) {
                el.parentNode.insertBefore(timer, el);
              }
            }
            el.remove();
          });
        }
        break;
    }
    sendResponse({success: true});
  }
  return true;
});

// Initialize extension when page loads
document.addEventListener('DOMContentLoaded', initExtension);
// In case page was already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initExtension();
}