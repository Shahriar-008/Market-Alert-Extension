# Price Alert Extension for Stocks & Forex

A simple yet powerful Chrome extension to set price alerts for stocks and forex pairs using the Alpha Vantage API. Get notified with desktop alerts and sounds even when the extension popup is closed.

## Features

- **Real-time Price Monitoring:** Checks for price alerts every 30 seconds.
- **Stock & Forex Alerts:** Set alerts for stocks (e.g., `AAPL`) and forex pairs (e.g., `EUR/USD`).
- **Desktop Notifications:** Receive alerts via desktop notifications.
- **Sound Alerts:** Plays an alert sound even when the popup is closed.
- **Tabbed UI:** Manage active alerts and view trigger history.
- **Customizable:** Adjust check frequency, alert sounds, and UI styling.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shahriar-008/Market-Alert-Extension.git
cd price-alert-extension
```

### 2. Get an Alpha Vantage API Key

1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and sign up for a free API key.
2. Open `background.js` and replace `"YOUR_API_KEY_HERE"` with your actual API key:

   ```javascript
   const ALPHA_VANTAGE_API_KEY = "your-api-key";
   ```

### 3. Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle switch in the top right).
3. Click **Load unpacked** and select the repository folder.

## Usage

### Open the Extension

- Click the extension icon in the Chrome toolbar to open the popup with two tabs: **Alerts** and **History**.

### Set a New Alert

1. **Alerts Tab:**
   - Enter a symbol (e.g., `AAPL` for stocks, `EUR/USD` for forex).
   - Set the target price.
   - Click **"Set Alert"**.

2. **View Alert History:**
   - Switch to the **History** tab to view triggered alerts.

### Notification & Sound

- You will receive a desktop notification and hear a sound when the target price is reached.

## Customization

### Frequency of Price Checks

- The extension checks prices every 30 seconds. Modify in `background.js`:

  ```javascript
  chrome.alarms.create("priceCheck", { periodInMinutes: 0.5 });
  ```

### Alert Sound

- Replace `alert.mp3` with your preferred sound file. Ensure the file is updated in the manifest and offscreen HTML.

### UI Adjustments

- Customize the look and feel by editing `popup.html` and `popup.css`.

## Troubleshooting

### No Sound When Popup is Closed?

- Check the console (`chrome://extensions/` > Inspect service worker) for errors related to offscreen document creation.

### API Issues?

- Verify your API key in `background.js`.
- Free API keys have usage limits (typically 5 requests per minute).

### Alerts Not Triggering?

- Ensure correct symbol format: `AAPL` for stocks, `EUR/USD` for forex.

## Contributing

- Contributions, issues, and feature requests are welcome! Visit the [issues page](https://github.com/your-username/price-alert-extension/issues) to contribute.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**🚀 Happy Trading!**
