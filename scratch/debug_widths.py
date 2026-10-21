import subprocess
import json

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
script = """
(() => {
  const frame = document.querySelector('.phone-mockup-frame');
  const card = document.querySelector('.card-white');
  const layout = document.querySelector('.presentation-layout');
  const body = document.body;
  return {
    windowWidth: window.innerWidth,
    bodyWidth: body.offsetWidth,
    layoutWidth: layout.offsetWidth,
    frameWidth: frame ? frame.offsetWidth : null,
    cardWidth: card ? card.offsetWidth : null,
    scrollWidth: document.documentElement.scrollWidth
  };
})()
"""

# Test with window size 390,844
cmd = [
    CHROME,
    "--headless=new",
    "--disable-gpu",
    "--window-size=390,844",
    "--dump-dom",
    "http://localhost:4173/"
]
# Let's run a small node script with puppeteer or write an HTML test
