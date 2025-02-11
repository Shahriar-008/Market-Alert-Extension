# Price Alert Extension for Stocks & Forex

A simple, clean Chrome extension that allows you to set price alerts for stocks and forex pairs using the [Alpha Vantage API](https://www.alphavantage.co/). When a target price is reached, the extension sends a desktop notification and plays a sound—even if the popup is not active.

## Features

- **Real-time Price Monitoring:** Checks for price alerts every 1 minutes.
- **Stock & Forex Alerts:** Set alerts for both stocks (e.g., `AAPL`) and forex pairs (e.g., `EUR/USD`).
- **Desktop Notifications:** Receive a notification when the target price is reached.
- **Sound Alerts:** Plays an alert sound using an offscreen document, so the sound works even when the popup is closed.
- **Tabbed UI:** Easily manage active alerts and view the history of triggered alerts.
- **Customizable:** Adjust check frequency, alert sound, and UI style.

## Installation

### 1. Clone the Repository

Open your terminal and clone the repository:

```sh
git clone https://github.com/shahriar-008/Market-Alert-Extension.git
cd price-alert-extension
