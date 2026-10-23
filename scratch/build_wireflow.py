import os
import subprocess
from PIL import Image

WORKSPACE_DIR = "/home/augusto/Documents/Proyectos/MediRecord-main"
PNG_DIR = os.path.join(WORKSPACE_DIR, "png medirecord")
OUTPUT_PATH = "/tmp/wireflow_updated.png"

# Verify all required PNGs exist
required_pngs = {
    "A-01": "01_login_paso1_correo_google.png",
    "A-02": "02_login_paso2_google_roberto.png",
    "A-03": "04_bienvenida_seleccion_rol.png",
    "L-01": "40_modal_invitacion_recibida.png",
    "B-02": "44_modal_walkthrough_vinculo_paso4.png",
    "L-02": "05_onboarding_roberto_paso1_bienvenida.png",
    "L-03": "06_onboarding_roberto_paso2_tamano_letra.png",
    "L-04": "07_onboarding_roberto_paso3_confirmacion.png",
    "C-03": "11_roberto_hoy_dosis_pendiente.png",
    "D-06": "13_roberto_hoy_dosis_tomada.png",
    "J-02": "39_modal_omision_motivos.png",
    "J-05": "14_roberto_hoy_dosis_omitida.png",
    "K-01": "15_roberto_hoy_dosis_sin_confirmar_60m.png",
    "K-02": "30_silvana_resumen_alerta_sin_confirmar_60m.png",
}

for code, fname in required_pngs.items():
    fpath = os.path.join(PNG_DIR, fname)
    if not os.path.exists(fpath):
        raise FileNotFoundError(f"Missing required PNG: {fpath}")

print("All 14 required PNGs from local directory verified successfully!")

html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }}
  body {{
    width: 2500px;
    background: #f8fafc;
    color: #0f172a;
    padding: 50px 60px 80px 60px;
  }}
  .header-card {{
    background: linear-gradient(135deg, #07564f 0%, #0d5c46 60%, #115e59 100%);
    color: #ffffff;
    padding: 40px 50px;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(7, 86, 79, 0.2);
    margin-bottom: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .header-card h1 {{
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 10px;
  }}
  .header-card p {{
    font-size: 19px;
    color: #ccfbf1;
    font-weight: 500;
    max-width: 1500px;
    line-height: 1.5;
  }}
  .badges {{
    display: flex;
    gap: 12px;
  }}
  .badge {{
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 10px 18px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }}
  .phase-section {{
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 24px;
    padding: 35px 40px;
    margin-bottom: 40px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.03);
  }}
  .phase-header {{
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f1f5f9;
  }}
  .phase-num {{
    background: #0d5c46;
    color: #ffffff;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
  }}
  .phase-title {{
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
  }}
  .phase-desc {{
    font-size: 15px;
    color: #64748b;
    font-weight: 500;
    margin-left: auto;
  }}
  .screens-row {{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
  }}
  .screen-col {{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 360px;
    flex-shrink: 0;
  }}
  .device-mockup {{
    width: 360px;
    height: 779px;
    border-radius: 36px;
    border: 5px solid #1e293b;
    box-shadow: 0 16px 35px rgba(15, 23, 42, 0.12);
    overflow: hidden;
    background: #000;
    position: relative;
  }}
  .device-mockup img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }}
  .meta-tag {{
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
  }}
  .code-pill {{
    background: #0d5c46;
    color: white;
    font-weight: 800;
    font-size: 13px;
    padding: 5px 14px;
    border-radius: 999px;
    letter-spacing: 0.5px;
  }}
  .code-pill.branch-omit {{
    background: #b45309;
  }}
  .code-pill.branch-alert {{
    background: #dc2626;
  }}
  .code-pill.success {{
    background: #047857;
  }}
  .screen-name {{
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.3;
  }}
  .screen-sub {{
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }}
  .arrow-connector {{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    padding-top: 360px;
    flex-shrink: 0;
  }}
  .arrow-label {{
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #334155;
    font-size: 11.5px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 8px;
    text-align: center;
    max-width: 115px;
    margin-bottom: 8px;
    line-height: 1.25;
    box-shadow: 0 2px 5px rgba(0,0,0,0.04);
  }}
  .arrow-label.active {{
    background: #e6f1ec;
    border-color: #0d5c46;
    color: #0d5c46;
  }}
  .arrow-label.omit {{
    background: #fef3c7;
    border-color: #d97706;
    color: #b45309;
  }}
  .arrow-label.alert {{
    background: #fee2e2;
    border-color: #ef4444;
    color: #b91c1c;
  }}
  .arrow-svg {{
    width: 100px;
    height: 36px;
  }}
  .branches-container {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }}
  .branch-box {{
    background: #ffffff;
    border: 2px dashed #cbd5e1;
    border-radius: 20px;
    padding: 30px;
  }}
  .branch-box.omit {{
    border-color: #f59e0b;
    background: #fffdfa;
  }}
  .branch-box.alert {{
    border-color: #f87171;
    background: #fffafb;
  }}
  .branch-header {{
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
  }}
  .branch-badge {{
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
  }}
  .branch-badge.omit {{
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  }}
  .branch-badge.alert {{
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }}
  .branch-title {{
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }}
  .branch-screens {{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 30px;
  }}
  .branch-note {{
    margin-top: 20px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 13.5px;
    color: #475569;
    line-height: 1.4;
  }}
</style>
</head>
<body>

<div class="header-card">
  <div>
    <h1>L. WIREFLOW DEL FLUJO CRÍTICO (ALTA FIDELIDAD)</h1>
    <p>Mapeo completo de interacción paso a paso: Happy Path de Roberto Gómez (Acceso, Selección de Rol, Vínculo con Silvana, Onboarding y Confirmación de Toma) más las dos Ramas Alternativas desde la Alarma de las 14:00 (Omisión voluntaria «No la tomé» y Alerta familiar tras 60 minutos).</p>
  </div>
  <div class="badges">
    <div class="badge">UTN FRM · UX/UI</div>
    <div class="badge">MediRecord SSOT</div>
  </div>
</div>

<!-- FASE 1: ACCESO Y VINCULO -->
<div class="phase-section">
  <div class="phase-header">
    <div class="phase-num">1</div>
    <div class="phase-title">Fase 1: Acceso, Selección de Rol y Vínculo Familiar con Silvana</div>
    <div class="phase-desc">Desde el splash inicial hasta la confirmación de la persona de apoyo (P2P)</div>
  </div>
  <div class="screens-row">
    <!-- Screen 1: A-01 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '01_login_paso1_correo_google.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">A-01</span>
        <span class="screen-name">Inicio de Sesión</span>
        <span class="screen-sub">Correo o botón Google</span>
      </div>
    </div>

    <!-- Arrow 1 -->
    <div class="arrow-connector">
      <div class="arrow-label active">Toca «Continuar con Google»</div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <defs>
          <marker id="arr1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill="#0d5c46" />
          </marker>
        </defs>
        <line x1="5" y1="12" x2="88" y2="12" stroke="#0d5c46" stroke-width="3" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 2: A-02 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '02_login_paso2_google_roberto.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">A-02</span>
        <span class="screen-name">Cuenta Google</span>
        <span class="screen-sub">roberto.gomez@gmail</span>
      </div>
    </div>

    <!-- Arrow 2 -->
    <div class="arrow-connector">
      <div class="arrow-label active">Confirma su cuenta</div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <line x1="5" y1="12" x2="88" y2="12" stroke="#0d5c46" stroke-width="3" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 3: A-03 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '04_bienvenida_seleccion_rol.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">A-03</span>
        <span class="screen-name">Selección de Rol</span>
        <span class="screen-sub">Tomo medicinas / Acompaño</span>
      </div>
    </div>

    <!-- Arrow 3 -->
    <div class="arrow-connector">
      <div class="arrow-label active">Elige «Tomo medicinas»</div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <line x1="5" y1="12" x2="88" y2="12" stroke="#0d5c46" stroke-width="3" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 4: L-01 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '40_modal_invitacion_recibida.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">L-01</span>
        <span class="screen-name">Invitación de Silvana</span>
        <span class="screen-sub">Código: 482 716</span>
      </div>
    </div>

    <!-- Arrow 4 -->
    <div class="arrow-connector">
      <div class="arrow-label active">Toca «Aceptar y vincular»</div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <line x1="5" y1="12" x2="88" y2="12" stroke="#0d5c46" stroke-width="3" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 5: B-02 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '44_modal_walkthrough_vinculo_paso4.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill success">B-02</span>
        <span class="screen-name">Vínculo Confirmado</span>
        <span class="screen-sub">Silvana Gómez vinculada</span>
      </div>
    </div>
  </div>
</div>

<!-- FASE 2: ONBOARDING Y HAPPY PATH HOY -->
<div class="phase-section">
  <div class="phase-header">
    <div class="phase-num">2</div>
    <div class="phase-title">Fase 2: Onboarding Personalizado y Happy Path de la Toma (14:00)</div>
    <div class="phase-desc">Ajuste de accesibilidad, habilitación de avisos y confirmación de toma en 1 toque</div>
  </div>
  <div class="screens-row">
    <!-- Screen 6: L-02 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '05_onboarding_roberto_paso1_bienvenida.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">L-02</span>
        <span class="screen-name">Onboarding Roberto</span>
        <span class="screen-sub">Bienvenida y primeros pasos</span>
      </div>
    </div>

    <!-- Arrow 5 -->
    <div class="arrow-connector">
      <div class="arrow-label active">Toca «Continuar»</div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <line x1="5" y1="12" x2="88" y2="12" stroke="#0d5c46" stroke-width="3" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 7: L-03 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '06_onboarding_roberto_paso2_tamano_letra.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">L-03</span>
        <span class="screen-name">Tamaño de Letra</span>
        <span class="screen-sub">Normal / Grande / Muy grande</span>
      </div>
    </div>

    <!-- Arrow 6 -->
    <div class="arrow-connector">
      <div class="arrow-label active">Guarda tamaño elegido</div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <line x1="5" y1="12" x2="88" y2="12" stroke="#0d5c46" stroke-width="3" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 8: L-04 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '07_onboarding_roberto_paso3_confirmacion.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">L-04</span>
        <span class="screen-name">Avisos y Sonido</span>
        <span class="screen-sub">Habilitación de alarmas</span>
      </div>
    </div>

    <!-- Arrow 7 -->
    <div class="arrow-connector">
      <div class="arrow-label active">«Empezar a usar»</div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <line x1="5" y1="12" x2="88" y2="12" stroke="#0d5c46" stroke-width="3" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 9: C-03 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '11_roberto_hoy_dosis_pendiente.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill">C-03</span>
        <span class="screen-name">Pantalla Hoy (Alarma 14:00)</span>
        <span class="screen-sub">Metformina 500 mg · Pendiente</span>
      </div>
    </div>

    <!-- Arrow 8 -->
    <div class="arrow-connector">
      <div class="arrow-label active" style="background:#dcfce7; border-color:#16a34a; color:#15803d; font-weight:800;">
        Toca «Ya la tomé»
      </div>
      <svg class="arrow-svg" viewBox="0 0 100 24">
        <line x1="5" y1="12" x2="88" y2="12" stroke="#16a34a" stroke-width="4" marker-end="url(#arr1)" />
      </svg>
    </div>

    <!-- Screen 10: D-06 -->
    <div class="screen-col">
      <div class="device-mockup">
        <img src="file://{os.path.join(PNG_DIR, '13_roberto_hoy_dosis_tomada.png')}">
      </div>
      <div class="meta-tag">
        <span class="code-pill success">D-06</span>
        <span class="screen-name">Toma Registrada</span>
        <span class="screen-sub">¡Fin del Happy Path!</span>
      </div>
    </div>
  </div>
</div>

<!-- FASE 3: RAMAS ALTERNATIVAS -->
<div class="phase-section" style="margin-bottom:0;">
  <div class="phase-header">
    <div class="phase-num" style="background:#b45309;">3</div>
    <div class="phase-title">Fase 3: Ramas Alternativas desde la Alarma de las 14:00 (C-03)</div>
    <div class="phase-desc">Líneas punteadas: omisión consciente y protocolo de seguridad familiar</div>
  </div>

  <div class="branches-container">
    <!-- RAMA 1: NO LA TOMÉ -->
    <div class="branch-box omit">
      <div class="branch-header">
        <span class="branch-badge omit">Rama Alternativa 1</span>
        <span class="branch-title">Omisión voluntaria de dosis («No la tomé»)</span>
      </div>
      <div class="branch-screens">
        <!-- Screen: J-02 -->
        <div class="screen-col">
          <div class="device-mockup">
            <img src="file://{os.path.join(PNG_DIR, '39_modal_omision_motivos.png')}">
          </div>
          <div class="meta-tag">
            <span class="code-pill branch-omit">J-02</span>
            <span class="screen-name">Motivo de no toma</span>
            <span class="screen-sub">«Me cayó mal», «Sin medicina», etc.</span>
          </div>
        </div>

        <!-- Arrow omit -->
        <div class="arrow-connector" style="padding-top:360px;">
          <div class="arrow-label omit">Elige motivo y confirma</div>
          <svg class="arrow-svg" viewBox="0 0 100 24">
            <defs>
              <marker id="arrOmit" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M1,1 L7,4 L1,7 Z" fill="#b45309" />
              </marker>
            </defs>
            <line x1="5" y1="12" x2="88" y2="12" stroke="#b45309" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrOmit)" />
          </svg>
        </div>

        <!-- Screen: J-05 -->
        <div class="screen-col">
          <div class="device-mockup">
            <img src="file://{os.path.join(PNG_DIR, '14_roberto_hoy_dosis_omitida.png')}">
          </div>
          <div class="meta-tag">
            <span class="code-pill branch-omit">J-05</span>
            <span class="screen-name">Hoy: Dosis No tomada</span>
            <span class="screen-sub">Tarjeta registrada como omitida</span>
          </div>
        </div>
      </div>
      <div class="branch-note">
        <strong>Comportamiento del sistema:</strong> Roberto toca el botón con borde «No la tomé» en C-03. La app abre el modal J-02 donde puede elegir un motivo (o tocar directamente "No la tomé"). La tarjeta de las 14:00 pasa al estado «No tomada» en Hoy (J-05) y se sincroniza al Historial sin disparar alarmas sonoras reiteradas.
      </div>
    </div>

    <!-- RAMA 2: AVISO A SILVANA (60 MINUTOS) -->
    <div class="branch-box alert">
      <div class="branch-header">
        <span class="branch-badge alert">Rama Alternativa 2</span>
        <span class="branch-title">Aviso familiar por falta de confirmación (60 min)</span>
      </div>
      <div class="branch-screens">
        <!-- Screen: K-01 -->
        <div class="screen-col">
          <div class="device-mockup">
            <img src="file://{os.path.join(PNG_DIR, '15_roberto_hoy_dosis_sin_confirmar_60m.png')}">
          </div>
          <div class="meta-tag">
            <span class="code-pill branch-alert">K-01</span>
            <span class="screen-name">Hoy Roberto (60 min)</span>
            <span class="screen-sub">Alerta ámbar sin confirmar</span>
          </div>
        </div>

        <!-- Arrow alert -->
        <div class="arrow-connector" style="padding-top:360px;">
          <div class="arrow-label alert">Notificación push al familiar</div>
          <svg class="arrow-svg" viewBox="0 0 100 24">
            <defs>
              <marker id="arrAlert" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M1,1 L7,4 L1,7 Z" fill="#dc2626" />
              </marker>
            </defs>
            <line x1="5" y1="12" x2="88" y2="12" stroke="#dc2626" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#arrAlert)" />
          </svg>
        </div>

        <!-- Screen: K-02 -->
        <div class="screen-col">
          <div class="device-mockup">
            <img src="file://{os.path.join(PNG_DIR, '30_silvana_resumen_alerta_sin_confirmar_60m.png')}">
          </div>
          <div class="meta-tag">
            <span class="code-pill branch-alert">K-02</span>
            <span class="screen-name">Resumen Silvana</span>
            <span class="screen-sub">Botón «Ya hablé con Roberto»</span>
          </div>
        </div>
      </div>
      <div class="branch-note">
        <strong>Protocolo de cuidado no invasivo:</strong> Si Roberto no confirma la toma ni la pospone tras cumplirse el umbral de 60 minutos, la dosis queda «Sin confirmar» (K-01). El sistema envía un aviso al celular de Silvana (K-02) sin dar la toma por perdida, permitiéndole llamarlo o tocar «Ya hablé con Roberto» para resolver el aviso de inmediato.
      </div>
    </div>
  </div>
</div>

</body>
</html>
"""

html_path = "/tmp/wireflow_composite.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML generated at {html_path}")

# Render with Google Chrome Headless
chrome_cmd = [
    "/usr/bin/google-chrome",
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=2500,3900",
    f"--screenshot={OUTPUT_PATH}",
    html_path
]

print("Executing Chrome headless screenshot...")
subprocess.run(chrome_cmd, check=True)
print(f"Wireflow image successfully generated at {OUTPUT_PATH}")

# Verify generated image
im = Image.open(OUTPUT_PATH)
print(f"Final Wireflow dimensions: {im.size}")
