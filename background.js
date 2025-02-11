// Replace with your actual Alpha Vantage API key.
const ALPHA_VANTAGE_API_KEY = "ODF1SH6EV086LYFW";

// On install, schedule an alarm to check prices every 30 seconds.
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("priceCheck", { periodInMinutes: 1 });
});

// Listen for the alarm and run our price check.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "priceCheck") {
    checkAlerts();
  }
});

// Check all stored alerts.
function checkAlerts() {
  chrome.storage.local.get({ alerts: [] }, function(data) {
    let alerts = data.alerts;
    alerts.forEach(alert => {
      // Skip alerts that have already been triggered.
      if (alert.triggered) return;
      fetchCurrentPrice(alert.symbol).then(price => {
        if (price === null) return; // Error occurred
        // Determine tolerance based on asset type.
        const tolerance = alert.symbol.includes("/") ? 0.0001 : 0.01;
        if (Math.abs(price - alert.targetPrice) < tolerance) {
          // Trigger the alert (no need to await here)
          triggerAlert(alert, price);
        }
      });
    });
  });
}

// Fetch the current price for a given symbol using the Alpha Vantage API.
// For forex pairs (containing a "/") we use the CURRENCY_EXCHANGE_RATE endpoint.
function fetchCurrentPrice(symbol) {
  if (symbol.includes("/")) {
    const [fromCurrency, toCurrency] = symbol.split("/");
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${encodeURIComponent(fromCurrency.trim())}&to_currency=${encodeURIComponent(toCurrency.trim())}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const exchangeData = data["Realtime Currency Exchange Rate"];
        if (exchangeData && exchangeData["5. Exchange Rate"]) {
          return parseFloat(exchangeData["5. Exchange Rate"]);
        }
        throw new Error("Invalid API response for forex pair: " + symbol);
      })
      .catch(error => {
        console.error("Error fetching forex price for", symbol, error);
        return null;
      });
  } else {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol.trim())}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const quote = data["Global Quote"];
        if (quote && quote["05. price"]) {
          return parseFloat(quote["05. price"]);
        }
        throw new Error("Invalid API response for stock symbol: " + symbol);
      })
      .catch(error => {
        console.error("Error fetching stock price for", symbol, error);
        return null;
      });
  }
}

// Ensure an offscreen document exists for playing audio.
async function ensureOffscreenDocument() {
  const hasDoc = await chrome.offscreen.hasDocument();
  if (!hasDoc) {
    try {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Needed for playing alert sounds when the popup is not active.'
      });
      console.log('Offscreen document created.');
    } catch (error) {
      console.error('Error creating offscreen document:', error);
    }
  } else {
    console.log('Offscreen document already exists.');
  }
}

// When an alert condition is met, mark the alert as triggered and notify the user.
async function triggerAlert(alert, currentPrice) {
  // Update the alert in storage to mark it as triggered.
  chrome.storage.local.get({ alerts: [] }, function(data) {
    let alerts = data.alerts;
    const index = alerts.findIndex(a => a.id === alert.id);
    if (index !== -1) {
      alerts[index].triggered = true;
      alerts[index].triggeredAt = Date.now();
      chrome.storage.local.set({ alerts: alerts });
    }
  });
  
  // Create a Chrome notification.
  chrome.notifications.create(alert.id, {
    type: "basic",
    iconUrl: "icon.png",
    title: "Price Alert Triggered!",
    message: `${alert.symbol} has reached ${currentPrice}`,
    priority: 2
  });
  
  // Ensure the offscreen document exists, then send a message to play the sound.
  await ensureOffscreenDocument();
  chrome.runtime.sendMessage({ type: "playSound", alert: alert });
}
