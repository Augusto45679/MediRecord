import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SHOTS_DIR = "C:\\Users\\nfune\\OneDrive\\Documentos\\Proyectos\\MediRecord\\MediRecord\\scratch\\qa_shots";

if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log("Starting Chrome in headless mode with remote debugging...");
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--window-size=412,915",
    "about:blank"
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch("http://localhost:9222/json");
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === "page") || targets[0];
    console.log("Connecting to target:", pageTarget.webSocketDebuggerUrl);

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

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

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
      await sleep(400);
      const res = await send("Page.captureScreenshot", { format: "png" });
      const buffer = Buffer.from(res.result.data, "base64");
      const filePath = path.join(SHOTS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    };

    // 1. Roberto - Medicinas Tab
    console.log("Navigating to Roberto medicinas...");
    await send("Page.navigate", { url: "http://localhost:4173/?role=roberto&tab=medicinas" });
    await sleep(1200);
    await captureShot("01_roberto_medicinas_lista.png");

    // 2. Roberto - Metformina Detalle (Screen 18)
    console.log("Clicking Metformina to view details...");
    await evaluate(`
      const cards = Array.from(document.querySelectorAll('.card-white'));
      const metCard = cards.find(c => c.textContent.includes('Metformina'));
      if (metCard) metCard.click();
    `);
    await sleep(600);
    await captureShot("02_roberto_medicina_detalle.png");

    // 3. Roberto - Modal Editar Medicina (Screen 49)
    console.log("Clicking 'Editar dosis u horarios'...");
    await evaluate(`
      const buttons = Array.from(document.querySelectorAll('button'));
      const editBtn = buttons.find(b => b.textContent.includes('Editar dosis'));
      if (editBtn) editBtn.click();
    `);
    await sleep(600);
    await captureShot("03_modal_editar_medicina.png");

    // Close edit modal
    await evaluate(`
      const buttons = Array.from(document.querySelectorAll('button'));
      const cancelBtn = buttons.find(b => b.textContent.trim() === 'Cancelar');
      if (cancelBtn) cancelBtn.click();
    `);
    await sleep(400);

    // Go back to list
    await evaluate(`
      const backBtn = document.querySelector('.btn-back');
      if (backBtn) backBtn.click();
    `);
    await sleep(400);

    // 4. Wizard Nueva Medicina - Paso 1
    console.log("Starting Add Medicine wizard...");
    await evaluate(`
      const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Añadir medicina'));
      if (addBtn) addBtn.click();
    `);
    await sleep(500);

    // Fill Step 1
    await evaluate(`
      const input = document.querySelector('input[type="text"]');
      if (input) {
        input.value = 'Enalapril 10 mg';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continuar');
      if (continueBtn) continueBtn.click();
    `);
    await sleep(500);

    // Step 2 -> Continue
    await evaluate(`
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continuar');
      if (continueBtn) continueBtn.click();
    `);
    await sleep(500);

    // 5. Wizard Nueva Medicina - Paso 3 (Días y horarios)
    console.log("Capturing Step 3 with Day Selector...");
    // Let's select 'Lunes a Viernes' preset
    await evaluate(`
      const weekdayBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Lunes a Viernes'));
      if (weekdayBtn) weekdayBtn.click();
    `);
    await sleep(300);
    await captureShot("04_modal_nueva_medicina_paso3_dias_horarios.png");

    // Click Continuar to go to Step 4
    await evaluate(`
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continuar');
      if (continueBtn) continueBtn.click();
    `);
    await sleep(500);

    // 6. Wizard Nueva Medicina - Paso 4 (Resumen / Image 48)
    console.log("Capturing Step 4 Resumen...");
    await captureShot("05_modal_nueva_medicina_paso4_resumen.png");

    // Click Guardar medicina
    await evaluate(`
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Guardar medicina'));
      if (saveBtn) saveBtn.click();
    `);
    await sleep(600);

    // Capture list with new medicine
    await captureShot("06_roberto_lista_con_nueva_medicina.png");

    // 7. Silvana - Medicinas Tab
    console.log("Navigating to Silvana medicinas...");
    await send("Page.navigate", { url: "http://localhost:4173/?role=silvana&tab=medicinas" });
    await sleep(1000);
    await captureShot("07_silvana_medicinas_lista.png");

    // 8. Silvana - Detalle de medicina
    await evaluate(`
      const cards = Array.from(document.querySelectorAll('.card-white'));
      const medCard = cards.find(c => c.textContent.includes('Enalapril') || c.textContent.includes('Metformina'));
      if (medCard) medCard.click();
    `);
    await sleep(500);
    await captureShot("08_silvana_medicina_detalle.png");

    console.log("All automated verification screenshots captured successfully!");
    ws.close();
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    chromeProc.kill();
  }
}

run();
