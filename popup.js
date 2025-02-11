document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadAlerts();

  document.getElementById('addAlert').addEventListener('click', addAlert);

  // Listen for messages from the background (e.g., to play a sound)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "playSound") {
      playSound();
      loadAlerts(); // Refresh the alerts list to update triggered status
    }
  });
});

// Set up tab switching functionality.
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tab buttons.
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Hide all tab contents.
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Activate clicked tab button and its corresponding content.
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Add a new alert based on user input.
function addAlert() {
  const symbol = document.getElementById('symbol').value.trim();
  const targetPrice = parseFloat(document.getElementById('targetPrice').value);

  if (!symbol || isNaN(targetPrice)) {
    alert("Please enter a valid symbol and target price.");
    return;
  }

  const alertItem = {
    id: Date.now().toString(), // Unique id based on timestamp.
    symbol: symbol,
    targetPrice: targetPrice,
    triggered: false,
    createdAt: Date.now()
  };

  chrome.storage.local.get({ alerts: [] }, function(data) {
    let alerts = data.alerts;
    alerts.push(alertItem);
    chrome.storage.local.set({ alerts: alerts }, function() {
      loadAlerts();
      // Clear form fields after adding.
      document.getElementById('symbol').value = "";
      document.getElementById('targetPrice').value = "";
    });
  });
}

// Load alerts from storage and display them.
function loadAlerts() {
  chrome.storage.local.get({ alerts: [] }, function(data) {
    const activeList = document.getElementById('activeAlerts');
    const triggeredList = document.getElementById('triggeredAlerts');
    activeList.innerHTML = "";
    triggeredList.innerHTML = "";
    data.alerts.forEach(alertItem => {
      if (!alertItem.triggered) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="alert-info">${alertItem.symbol} at ${alertItem.targetPrice}</span>`;
        
        // Add a delete button.
        const delBtn = document.createElement('button');
        delBtn.textContent = "Delete";
        delBtn.addEventListener('click', () => deleteAlert(alertItem.id));
        li.appendChild(delBtn);

        activeList.appendChild(li);
      } else {
        const li = document.createElement('li');
        li.classList.add("triggered");
        li.innerHTML = `<span class="alert-info">${alertItem.symbol} at ${alertItem.targetPrice}</span>`;
        
        // Add a delete button.
        const delBtn = document.createElement('button');
        delBtn.textContent = "Delete";
        delBtn.addEventListener('click', () => deleteAlert(alertItem.id));
        li.appendChild(delBtn);

        triggeredList.appendChild(li);
      }
    });
  });
}

// Delete an alert by its id.
function deleteAlert(id) {
  chrome.storage.local.get({ alerts: [] }, function(data) {
    let alerts = data.alerts.filter(alert => alert.id !== id);
    chrome.storage.local.set({ alerts: alerts }, loadAlerts);
  });
}

// Play the alert sound.
function playSound() {
  const audio = document.getElementById('alertSound');
  if (audio) {
    audio.play().catch(err => console.error("Audio play failed:", err));
  }
}
