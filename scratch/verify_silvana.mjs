import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SHOTS_DIR = "C:\\Users\\nfune\\OneDrive\\Documentos\\Proyectos\\MediRecord\\MediRecord\\scratch\\qa_shots";

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log("Starting Chrome for Silvana verification...");
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9231",
    "--window-size=412,915",
    "about:blank"
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch("http://localhost:9231/json");
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

    // 1. Navigate as Silvana to medicinas
    await send("Page.navigate", { url: "http://localhost:4173/?role=silvana&tab=medicinas" });
    await sleep(1500);
    await captureShot("silvana_01_medicinas_lista.png");

    // 2. Click on Metformina to view detail as Silvana
    await evaluate(`
      const cards = Array.from(document.querySelectorAll('.card-white'));
      const metCard = cards.find(c => c.textContent.includes('Metformina'));
      if (metCard) metCard.click();
    `);
    await sleep(600);
    await captureShot("silvana_02_metformina_detalle.png");

    // 3. Click Editar dosis u horarios
    await evaluate(`
      const editBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Editar dosis'));
      if (editBtn) editBtn.click();
    `);
    await sleep(600);

    // 4. In Edit modal, select 'Fines de semana'
    await evaluate(`
      const weekendBtn = document.querySelector('[data-testid="preset-weekend"]');
      if (weekendBtn) weekendBtn.click();
    `);
    await sleep(400);
    await captureShot("silvana_03_edit_modal_fines_de_semana.png");

    // 5. Click Guardar cambios
    await evaluate(`
      const saveBtn = document.querySelector('[data-testid="edit-med-save"]');
      if (saveBtn) saveBtn.click();
    `);
    await sleep(800);
    await captureShot("silvana_04_metformina_detalle_actualizado.png");

    console.log("Silvana verification completed successfully!");
    ws.close();
  } catch (err) {
    console.error("Error in Silvana verification:", err);
  } finally {
    chromeProc.kill();
  }
}

run();
