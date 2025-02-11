chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "playSound") {
    const audio = document.getElementById('alertSound');
    if (audio) {
      audio.play().catch(err => console.error("Offscreen audio play failed:", err));
    }
  }
});
