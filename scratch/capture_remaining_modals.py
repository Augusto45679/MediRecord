import os
import sys
import json
import time
from playwright.sync_api import sync_playwright

BASE_URL = "https://medicare-ashy-alpha.vercel.app/"
OUTPUT_DIR = os.path.join(os.getcwd(), "png medirecord")
os.makedirs(OUTPUT_DIR, exist_ok=True)

INJECT_CSS = """
const style = document.createElement('style');
style.id = 'tester-mobile-fix';
style.innerHTML = `
    html, body, #root, .presentation-layout {
        height: 844px !important;
        max-height: 844px !important;
        overflow: hidden !important;
    }
    .phone-mockup-frame {
        height: 844px !important;
        max-height: 844px !important;
        min-height: 0 !important;
        overflow: hidden !important;
    }
    .screen-scroll-container {
        min-height: 0 !important;
        flex: 1 1 auto !important;
        overflow-y: auto !important;
    }
    .demo-control-bar { display: none !important; }
    .phone-toast-container { display: none !important; }
`;
if (!document.getElementById('tester-mobile-fix')) {
    document.head.appendChild(style);
}
"""

def setup_page(browser):
    context = browser.new_context(
        viewport={'width': 390, 'height': 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
    )
    page = context.new_page()
    return context, page

def apply_fixes(page):
    page.evaluate(INJECT_CSS)
    page.wait_for_timeout(250)

def set_app_state(page, state_updates):
    page.evaluate("""(updates) => {
        let current = JSON.parse(localStorage.getItem('medirecord_demo_state_v1') || '{}');
        let nextState = Object.assign({}, current, updates);
        localStorage.setItem('medirecord_demo_state_v1', JSON.stringify(nextState));
    }""", state_updates)
    page.reload(wait_until='networkidle')
    apply_fixes(page)

def snap(page, filename, description=""):
    apply_fixes(page)
    path = os.path.join(OUTPUT_DIR, filename)
    page.screenshot(path=path)
    print(f"  [OK] {filename} - {description}")

def run():
    print("=== Capturing Remaining Modals (41 to 51) ===")
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True)
        context, page = setup_page(browser)

        page.goto(BASE_URL, wait_until='networkidle')
        apply_fixes(page)

        # ----------------------------------------------------------------------
        # Walkthrough Vinculación Familiar (Steps 1 to 4)
        # ----------------------------------------------------------------------
        print("\n--> Capturing Walkthrough Vínculo Familiar")
        page.evaluate("""() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Abrir Recorrido Guiado'));
            if (btn) btn.click();
        }""")
        page.wait_for_timeout(350)
        snap(page, "41_modal_walkthrough_vinculo_paso1.png", "Modal Walkthrough Vínculo - Paso 1: Invitar a familiar (F-04)")

        page.click("button:has-text('Enviar invitación')")
        page.wait_for_timeout(350)
        snap(page, "42_modal_walkthrough_vinculo_paso2.png", "Modal Walkthrough Vínculo - Paso 2: Esperando consentimiento (F-05)")

        page.click("button:has-text('Ver qué recibe Roberto')")
        page.wait_for_timeout(350)
        snap(page, "43_modal_walkthrough_vinculo_paso3.png", "Modal Walkthrough Vínculo - Paso 3: Roberto revisa invitación (B-01)")

        page.click("button:has-text('Sí, vincular a Silvana')")
        page.wait_for_timeout(350)
        snap(page, "44_modal_walkthrough_vinculo_paso4.png", "Modal Walkthrough Vínculo - Paso 4: Vínculo confirmado y letra (B-02)")

        page.click("button:has-text('Finalizar recorrido')")
        page.wait_for_timeout(350)

        # ----------------------------------------------------------------------
        # Wizard Añadir Medicina (Steps 1 to 4)
        # ----------------------------------------------------------------------
        print("\n--> Capturing Wizard Añadir Medicina")
        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "medicinas",
            "specialView": "none"
        })
        page.click("button:has-text('Añadir medicina')")
        page.wait_for_timeout(350)
        snap(page, "45_modal_nueva_medicina_paso1_nombre.png", "Modal Nueva Medicina - Paso 1: Nombre de la medicina")

        page.fill("input[placeholder*='Enalapril']", "Enalapril 10 mg")
        page.wait_for_timeout(200)
        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(350)
        snap(page, "46_modal_nueva_medicina_paso2_dosis.png", "Modal Nueva Medicina - Paso 2: Cantidad por toma")

        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(350)
        snap(page, "47_modal_nueva_medicina_paso3_horarios.png", "Modal Nueva Medicina - Paso 3: Horarios de toma")

        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(350)
        snap(page, "48_modal_nueva_medicina_paso4_resumen.png", "Modal Nueva Medicina - Paso 4: Resumen y confirmación")

        # Save and close modal
        page.click("button:has-text('Guardar medicina')")
        page.wait_for_timeout(350)

        # ----------------------------------------------------------------------
        # Medicine Detail Modals: Edit, Pause, Delete
        # ----------------------------------------------------------------------
        print("\n--> Capturing Medicine Detail Modals (Edit, Pause, Delete)")
        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "medicinas",
            "specialView": "none"
        })
        page.click("text=Metformina")
        page.wait_for_timeout(350)
        page.click("button:has-text('Editar dosis u horarios')")
        page.wait_for_timeout(350)
        snap(page, "49_modal_editar_medicina.png", "Modal Editar dosis y horarios de medicina")

        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "medicinas",
            "specialView": "none"
        })
        page.click("text=Metformina")
        page.wait_for_timeout(350)
        page.click("button:has-text('Pausar recordatorios')")
        page.wait_for_timeout(350)
        snap(page, "50_modal_pausar_medicina_confirmacion.png", "Modal Confirmación ¿Pausar medicina?")

        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "medicinas",
            "specialView": "none"
        })
        page.click("text=Metformina")
        page.wait_for_timeout(350)
        page.click("button:has-text('Eliminar medicina')")
        page.wait_for_timeout(350)
        snap(page, "51_modal_eliminar_medicina_confirmacion.png", "Modal Confirmación ¿Eliminar medicina?")

        print("\n=== Remaining modals captured successfully! ===")
        browser.close()

if __name__ == '__main__':
    run()
