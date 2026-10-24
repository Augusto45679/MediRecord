import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SHOTS_DIR = "C:\\Users\\nfune\\OneDrive\\Documentos\\Proyectos\\MediRecord\\MediRecord\\scratch\\qa_shots";

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log("Starting Chrome for Add Wizard verification...");
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9230",
    "--window-size=412,915",
    "about:blank"
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch("http://localhost:9230/json");
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === "page") || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const resolve = callbacks.get(data.id);
        callbacks.delete(data.id);
        resolve(data);
      }
    };

    await new Promise(r => { ws.onopen = r; });

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 412,
      height: 915,
      deviceScaleFactor: 2,
      mobile: true
    });

    const evaluate = async (expression) => {
      const res = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      return res.result?.result?.value;
    };

    const captureShot = async (filename) => {
      await sleep(500);
      const res = await send("Page.captureScreenshot", { format: "png" });
      const buffer = Buffer.from(res.result.data, "base64");
      const filePath = path.join(SHOTS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    };

    // 1. Fresh navigate to Roberto Medicinas
    await send("Page.navigate", { url: "http://localhost:4173/?role=roberto&tab=medicinas" });
    await sleep(1500);

    // Open Add Wizard
    await evaluate(`
      const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Añadir medicina'));
      if (addBtn) addBtn.click();
    `);
    await sleep(600);

    // Step 1: Type name
    await evaluate(`
      const input = document.querySelector('.bottom-sheet input[type="text"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, 'Enalapril 10 mg');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    `);
    await sleep(300);

    // Click Continue from Step 1
    console.log("Clicking Continue on Step 1...");
    await evaluate(`document.querySelector('[data-testid="wizard-step1-continue"]')?.click()`);
    await sleep(600);

    // Click Continue from Step 2
    console.log("Clicking Continue on Step 2...");
    await evaluate(`document.querySelector('[data-testid="wizard-step2-continue"]')?.click()`);
    await sleep(600);

    // In Step 3: Select 'Lunes a Viernes'
    console.log("Selecting 'Lunes a Viernes' preset on Step 3...");
    await evaluate(`document.querySelector('[data-testid="preset-weekdays"]')?.click()`);
    await sleep(400);
    await captureShot("step3_dias_horarios_seleccionados.png");

    // Click Continue to Step 4
    console.log("Clicking Continuar to Step 4...");
    await evaluate(`document.querySelector('[data-testid="wizard-step3-continue"]')?.click()`);
    await sleep(600);
    await captureShot("step4_resumen_confirmacion.png");

    // Click Guardar medicina
    console.log("Clicking Guardar medicina...");
    await evaluate(`document.querySelector('[data-testid="wizard-step4-save"]')?.click()`);
    await sleep(1000);
    await captureShot("medicinas_lista_con_enalapril.png");

    console.log("All Add Wizard steps completed!");
    ws.close();
  } catch (err) {
    console.error("Error in add wizard verification:", err);
  } finally {
    chromeProc.kill();
  }
}

run();
