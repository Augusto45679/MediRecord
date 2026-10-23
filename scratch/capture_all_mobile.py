import os
import sys
import json
import time
from playwright.sync_api import sync_playwright

BASE_URL = "https://medicare-ashy-alpha.vercel.app/"
OUTPUT_DIR = os.path.join(os.getcwd(), "png medirecord")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Mobile styling injection to ensure native-like mobile phone viewport
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
    print("=== Starting Mobile App QA & Screenshot Capture ===")
    print(f"Target: {BASE_URL}")
    print(f"Output Directory: {OUTPUT_DIR}\n")

    base_doses = [
        {"id": "dose-today-1", "medicineId": "med-losartan", "medicineName": "Losartán", "time": "08:00", "doseDescription": "50 mg · 1 comprimido", "status": "taken", "takenAt": "08:05"},
        {"id": "dose-today-2", "medicineId": "med-metformina", "medicineName": "Metformina", "time": "14:00", "doseDescription": "500 mg · 1 comprimido", "status": "pending"},
        {"id": "dose-today-3", "medicineId": "med-metformina", "medicineName": "Metformina", "time": "20:00", "doseDescription": "500 mg · 1 comprimido", "status": "pending"}
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True)
        context, page = setup_page(browser)

        # Initial load
        page.goto(BASE_URL, wait_until='networkidle')
        apply_fixes(page)

        # ----------------------------------------------------------------------
        # 1. SPECIAL VIEWS: AUTHENTICATION & ROLE SELECTION
        # ----------------------------------------------------------------------
        print("--> Capturing Category 1: Login & Welcome screens")

        set_app_state(page, {"specialView": "login-1"})
        snap(page, "01_login_paso1_correo_google.png", "Pantalla de Login inicial (Google / Email)")

        set_app_state(page, {"specialView": "login-2-roberto", "currentRole": "roberto"})
        snap(page, "02_login_paso2_google_roberto.png", "Confirmar cuenta Google Roberto Gómez")

        set_app_state(page, {"specialView": "login-2-silvana", "currentRole": "silvana"})
        snap(page, "03_login_paso2_google_silvana.png", "Confirmar cuenta Google Silvana Gómez")

        set_app_state(page, {"specialView": "welcome"})
        snap(page, "04_bienvenida_seleccion_rol.png", "Bienvenida y selección de perfil (Roberto / Silvana)")

        # ----------------------------------------------------------------------
        # 2. ONBOARDING FLOWS
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 2: Onboarding flows")

        set_app_state(page, {"specialView": "onboarding-roberto"})
        snap(page, "05_onboarding_roberto_paso1_bienvenida.png", "Onboarding Roberto - Paso 1: Bienvenida")

        page.click("button:has-text('Empezar')")
        page.wait_for_timeout(250)
        snap(page, "06_onboarding_roberto_paso2_tamano_letra.png", "Onboarding Roberto - Paso 2: Tamaño de letra")

        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(250)
        snap(page, "07_onboarding_roberto_paso3_confirmacion.png", "Onboarding Roberto - Paso 3: Configuración lista")

        set_app_state(page, {"specialView": "onboarding-silvana"})
        snap(page, "08_onboarding_silvana_paso1_bienvenida.png", "Onboarding Silvana - Paso 1: Bienvenida cuidadora")

        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(250)
        snap(page, "09_onboarding_silvana_paso2_tiempo_aviso.png", "Onboarding Silvana - Paso 2: Tiempo de aviso (30/60/90 min)")

        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(250)
        snap(page, "10_onboarding_silvana_paso3_confirmacion.png", "Onboarding Silvana - Paso 3: Confirmación lista")

        # ----------------------------------------------------------------------
        # 3. ROBERTO - TAB HOY (DOSE STATES)
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 3: Roberto - Tab Hoy and dose states")

        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "hoy",
            "specialView": "none",
            "fontSize": "large",
            "highContrast": False,
            "pendingInvitation": False,
            "todayDoses": base_doses
        })
        snap(page, "11_roberto_hoy_dosis_pendiente.png", "Roberto Hoy - Dosis 14:00 Metformina Pendiente")

        page.click("button:has-text('Posponer 10 min')")
        page.wait_for_timeout(300)
        snap(page, "12_roberto_hoy_dosis_pospuesta.png", "Roberto Hoy - Dosis 14:00 Pospuesta hasta 14:10")

        page.click("button:has-text('Ya la tomé')")
        page.wait_for_timeout(300)
        snap(page, "13_roberto_hoy_dosis_tomada.png", "Roberto Hoy - Dosis 14:00 Confirmada / Tomada a las 14:02")

        omitted_doses = [dict(d) for d in base_doses]
        omitted_doses[1]["status"] = "omitted"
        omitted_doses[1]["omittedAt"] = "14:05"
        omitted_doses[1]["omissionReason"] = "Me sentí mal"
        set_app_state(page, {"todayDoses": omitted_doses})
        snap(page, "14_roberto_hoy_dosis_omitida.png", "Roberto Hoy - Dosis 14:00 Omitida por 'Me sentí mal'")

        unconfirmed_doses = [dict(d) for d in base_doses]
        unconfirmed_doses[1]["status"] = "unconfirmed"
        set_app_state(page, {"todayDoses": unconfirmed_doses})
        snap(page, "15_roberto_hoy_dosis_sin_confirmar_60m.png", "Roberto Hoy - Dosis 14:00 Sin Confirmar tras 60 min")

        set_app_state(page, {
            "todayDoses": base_doses,
            "pendingInvitation": True
        })
        snap(page, "16_roberto_hoy_banner_invitacion_pendiente.png", "Roberto Hoy - Banner de invitación recibida de Silvana")

        # ----------------------------------------------------------------------
        # 4. ROBERTO - MEDICINAS
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 4: Roberto - Medicinas")

        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "medicinas",
            "specialView": "none",
            "pendingInvitation": False
        })
        snap(page, "17_roberto_medicinas_lista.png", "Roberto Medicinas - Lista de medicamentos activos")

        page.click("text=Metformina")
        page.wait_for_timeout(350)
        snap(page, "18_roberto_medicina_detalle.png", "Roberto Medicinas - Detalle de Metformina")

        # ----------------------------------------------------------------------
        # 5. ROBERTO - HISTORIAL
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 5: Roberto - Historial")

        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "historial",
            "specialView": "none"
        })
        snap(page, "19_roberto_historial.png", "Roberto Historial - Registro diario y adherencia")

        # ----------------------------------------------------------------------
        # 6. ROBERTO - AJUSTES & ACCESSIBILITY MODES
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 6: Roberto - Ajustes y Accesibilidad")

        # 20. Main Menu
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "ajustes",
            "specialView": "none",
            "familyLinked": True
        })
        snap(page, "20_roberto_ajustes_menu_principal.png", "Roberto Ajustes - Menú principal")

        # 21. Subscreen: Mi persona de apoyo (vinculada)
        page.click("text=Mi persona de apoyo")
        page.wait_for_timeout(350)
        snap(page, "21_roberto_ajustes_persona_apoyo_vinculada.png", "Roberto Ajustes - Persona de apoyo (Silvana vinculada)")

        # 22. Subscreen: Persona de apoyo (desvinculada con código)
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "ajustes",
            "familyLinked": False
        })
        page.click("text=Mi persona de apoyo")
        page.wait_for_timeout(350)
        snap(page, "22_roberto_ajustes_persona_apoyo_desvinculada.png", "Roberto Ajustes - Sin persona de apoyo (código de 6 dígitos)")

        # 23. Subscreen: Accesibilidad
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "ajustes",
            "familyLinked": True
        })
        page.click("text=Accesibilidad")
        page.wait_for_timeout(350)
        snap(page, "23_roberto_ajustes_accesibilidad_letra.png", "Roberto Ajustes - Accesibilidad (tamaño de fuente y alto contraste)")

        # 24. Subscreen: Avisos y sonido
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "ajustes",
            "familyLinked": True
        })
        page.click("text=Avisos y sonido")
        page.wait_for_timeout(350)
        snap(page, "24_roberto_ajustes_avisos_y_sonido.png", "Roberto Ajustes - Avisos y sonido")

        # 25. Accessibility mode: Alto Contraste en Hoy
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "hoy",
            "highContrast": True,
            "todayDoses": base_doses
        })
        snap(page, "25_roberto_modo_alto_contraste.png", "Roberto Modo Alto Contraste activado")

        # 26. Accessibility mode: Fuente Muy Grande en Hoy
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "hoy",
            "highContrast": False,
            "fontSize": "xlarge"
        })
        snap(page, "26_roberto_modo_fuente_muy_grande.png", "Roberto Modo Fuente Muy Grande (xlarge)")

        # ----------------------------------------------------------------------
        # 7. SILVANA - TAB RESUMEN (HOY) & ALERT STATES
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 7: Silvana - Resumen y alertas")

        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "hoy",
            "specialView": "none",
            "fontSize": "large",
            "highContrast": False,
            "todayDoses": base_doses,
            "noticeAttendedBySilvana": False
        })
        snap(page, "27_silvana_resumen_toma_pendiente.png", "Silvana Resumen - Toma pendiente (autonomía respetada, sin alarmas)")

        taken_doses_s = [dict(d) for d in base_doses]
        taken_doses_s[1]["status"] = "taken"
        taken_doses_s[1]["takenAt"] = "14:02"
        set_app_state(page, {"todayDoses": taken_doses_s})
        snap(page, "28_silvana_resumen_toma_tomada.png", "Silvana Resumen - Toma confirmada a tiempo (2 de 3)")

        set_app_state(page, {"todayDoses": omitted_doses})
        snap(page, "29_silvana_resumen_alerta_omision.png", "Silvana Resumen - Alerta explícita por toma omitida ('Me sentí mal')")

        set_app_state(page, {"todayDoses": unconfirmed_doses})
        snap(page, "30_silvana_resumen_alerta_sin_confirmar_60m.png", "Silvana Resumen - Alerta crítica 60 min sin confirmación")

        # ----------------------------------------------------------------------
        # 8. SILVANA - MEDICINAS
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 8: Silvana - Medicinas")

        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "medicinas",
            "specialView": "none"
        })
        snap(page, "31_silvana_medicinas_lista.png", "Silvana Medicinas - Medicinas de Roberto con botón de gestión")

        page.click("text=Metformina")
        page.wait_for_timeout(350)
        snap(page, "32_silvana_medicina_detalle.png", "Silvana Medicinas - Detalle de medicina para cuidador")

        # ----------------------------------------------------------------------
        # 9. SILVANA - HISTORIAL
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 9: Silvana - Historial")

        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "historial",
            "specialView": "none"
        })
        snap(page, "33_silvana_historial_adherencia.png", "Silvana Historial - Métrica de adherencia semanal (86%) y desglose")

        # ----------------------------------------------------------------------
        # 10. SILVANA - AJUSTES
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 10: Silvana - Ajustes")

        # 34. Menú principal
        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "ajustes",
            "specialView": "none",
            "familyLinked": True
        })
        snap(page, "34_silvana_ajustes_menu_principal.png", "Silvana Ajustes - Menú principal")

        # 35. Subscreen: Vínculo familiar (vinculado con Roberto)
        page.click("text=Vínculo familiar")
        page.wait_for_timeout(350)
        snap(page, "35_silvana_ajustes_persona_acompanada_vinculada.png", "Silvana Ajustes - Vínculo activo con Roberto Gómez")

        # 36. Subscreen: Vínculo familiar (desvinculado, código de 6 dígitos)
        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "ajustes",
            "familyLinked": False
        })
        page.click("text=Vínculo familiar")
        page.wait_for_timeout(350)
        snap(page, "36_silvana_ajustes_codigo_invitacion_directo.png", "Silvana Ajustes - Invitación familiar y código 482 716")

        # 37. Subscreen: Avisos · Preferencias
        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "ajustes",
            "familyLinked": True
        })
        page.click("text=Avisos · Preferencias")
        page.wait_for_timeout(350)
        snap(page, "37_silvana_ajustes_avisos_espera.png", "Silvana Ajustes - Configuración margen de aviso (30/60/90 min)")

        # 38. Subscreen: Accesibilidad Silvana
        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "ajustes",
            "familyLinked": True
        })
        page.click("text=Accesibilidad")
        page.wait_for_timeout(350)
        snap(page, "38_silvana_ajustes_accesibilidad.png", "Silvana Ajustes - Accesibilidad para cuidadora")

        # ----------------------------------------------------------------------
        # 11. MODALS & POPUPS
        # ----------------------------------------------------------------------
        print("\n--> Capturing Category 11: Modals and Dialogs")

        # Modal 1: Motivos de omisión
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "hoy",
            "specialView": "none",
            "todayDoses": base_doses
        })
        page.click("button:has-text('No la tomé')")
        page.wait_for_timeout(350)
        snap(page, "39_modal_omision_motivos.png", "Modal ¿Seguro que no la tomaste? (Motivos médicos)")

        # Modal 2: Invitación recibida de Silvana
        set_app_state(page, {
            "currentRole": "roberto",
            "currentTab": "hoy",
            "specialView": "none",
            "pendingInvitation": True,
            "todayDoses": base_doses
        })
        page.click("button:has-text('Ver invitación')")
        page.wait_for_timeout(350)
        snap(page, "40_modal_invitacion_recibida.png", "Modal Elegí tu apoyo - Invitación recibida de Silvana")

        # Modals 3 to 6: Walkthrough Vinculación Familiar (Steps 1 to 4)
        page.evaluate("""() => {
            const bar = document.querySelector('.demo-control-bar');
            if (bar) bar.style.display = 'block';
        }""")
        page.click("button:has-text('Abrir Recorrido Guiado')")
        page.wait_for_timeout(300)
        apply_fixes(page)
        snap(page, "41_modal_walkthrough_vinculo_paso1.png", "Modal Walkthrough Vínculo - Paso 1: Invitar a familiar (F-04)")

        page.click("button:has-text('Enviar invitación')")
        page.wait_for_timeout(300)
        snap(page, "42_modal_walkthrough_vinculo_paso2.png", "Modal Walkthrough Vínculo - Paso 2: Esperando consentimiento (F-05)")

        page.click("button:has-text('Ver qué recibe Roberto')")
        page.wait_for_timeout(300)
        snap(page, "43_modal_walkthrough_vinculo_paso3.png", "Modal Walkthrough Vínculo - Paso 3: Roberto revisa invitación (B-01)")

        page.click("button:has-text('Sí, vincular a Silvana')")
        page.wait_for_timeout(300)
        snap(page, "44_modal_walkthrough_vinculo_paso4.png", "Modal Walkthrough Vínculo - Paso 4: Vínculo confirmado y letra (B-02)")

        # Close walkthrough
        page.click("button:has-text('Finalizar recorrido')")
        page.wait_for_timeout(300)

        # Modals 7 to 10: Wizard Añadir Medicina (Steps 1 to 4)
        set_app_state(page, {
            "currentRole": "silvana",
            "currentTab": "medicinas",
            "specialView": "none"
        })
        page.click("button:has-text('+ Añadir medicina')")
        page.wait_for_timeout(350)
        snap(page, "45_modal_nueva_medicina_paso1_nombre.png", "Modal Nueva Medicina - Paso 1: Nombre de la medicina")

        page.fill("input[placeholder*='Enalapril']", "Enalapril")
        page.wait_for_timeout(150)
        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(350)
        snap(page, "46_modal_nueva_medicina_paso2_dosis.png", "Modal Nueva Medicina - Paso 2: Cantidad por toma")

        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(350)
        snap(page, "47_modal_nueva_medicina_paso3_horarios.png", "Modal Nueva Medicina - Paso 3: Horarios de toma")

        page.click("button:has-text('Continuar')")
        page.wait_for_timeout(350)
        snap(page, "48_modal_nueva_medicina_paso4_resumen.png", "Modal Nueva Medicina - Paso 4: Resumen y confirmación")

        # Save to close modal cleanly
        page.click("button:has-text('Guardar medicina')")
        page.wait_for_timeout(350)

        # Modal 11: Editar medicina
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

        # Modal 12: Pausar medicina confirmación
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

        # Modal 13: Eliminar medicina confirmación
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

        print("\n=== All 51 mobile screens and modals captured successfully! ===")
        browser.close()

if __name__ == '__main__':
    run()
