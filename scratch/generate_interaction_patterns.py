"""
Generación de la Lámina Compuesta: Patrones de Diseño Aplicados (Sección K)
Proyecto: MediRecord - Cátedra Diseño UX/UI (UTN FRM)
Paleta: #07564f (Cabecera), #0d5c46 (Pino), #c2410c (Terracota), #faf9f5 (Fondo), #ffffff
Resolución: 300 DPI
"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_patterns_sheet():
    # Dimensiones globales de la lámina (300 DPI)
    CANVAS_W = 2800
    CANVAS_H = 2400
    
    img = Image.new("RGBA", (CANVAS_W, CANVAS_H), "#faf9f5")
    draw = ImageDraw.Draw(img)
    
    # Fuentes tipográficas
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 46)
        font_sub = ImageFont.truetype("arial.ttf", 26)
        font_screen_title = ImageFont.truetype("arialbd.ttf", 28)
        font_screen_sub = ImageFont.truetype("arial.ttf", 22)
        font_marker = ImageFont.truetype("arialbd.ttf", 24)
        font_ref_title = ImageFont.truetype("arialbd.ttf", 24)
        font_ref_desc = ImageFont.truetype("arial.ttf", 19)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_screen_title = ImageFont.load_default()
        font_screen_sub = ImageFont.load_default()
        font_marker = ImageFont.load_default()
        font_ref_title = ImageFont.load_default()
        font_ref_desc = ImageFont.load_default()

    # 1. CABECERA INSTITUCIONAL
    draw.rectangle([(0, 0), (CANVAS_W, 140)], fill="#07564f")
    draw.text((CANVAS_W // 2, 45), "PATRONES DE INTERACCIÓN Y DISEÑO UI — MEDIRECORD", fill="#ffffff", font=font_title, anchor="mm")
    draw.text((CANVAS_W // 2, 98), "Soluciones de Interfaz Validadas para Adultos Mayores y Accesibilidad Cognitiva (Sección K)", fill="#cce3de", font=font_sub, anchor="mm")

    # 2. CARGA Y POSICIONAMIENTO DE PANTALLAS
    # Pantalla 1: C-03 Hoy Dosis Pendiente
    # Pantalla 2: C-04 Alarma / 60 Minutos Sin Confirmar
    # Pantalla 3: D-08 Historial de Tomas
    screens_meta = [
        {"file": "png medirecord/11_roberto_hoy_dosis_pendiente.png", "code": "C-03", "name": "Pantalla «Hoy» (Roberto)", "desc": "Toma activa de las 14:00 y acciones"},
        {"file": "png medirecord/15_roberto_hoy_dosis_sin_confirmar_60m.png", "code": "C-04", "name": "Alerta 60m Sin Confirmar", "desc": "Protocolo de advertencia y soporte"},
        {"file": "png medirecord/19_roberto_historial.png", "code": "D-08", "name": "Pantalla «Historial»", "desc": "Navegación diaria y estados"}
    ]

    # Escalar pantallas para que entren elegantemente
    # Alto objetivo: 1320 px (ancho resultante proporcional: ~610 px)
    target_h = 1320
    target_w = int(780 * (target_h / 1688)) # ~610 px
    
    spacing = (CANVAS_W - (3 * target_w)) // 4 # Espaciado horizontal
    y_screen_top = 220
    
    screen_rects = []
    
    for i, meta in enumerate(screens_meta):
        x = spacing + i * (target_w + spacing)
        
        # Título de pantalla
        draw.text((x + target_w // 2, y_screen_top - 45), f"Pantalla {meta['code']}: {meta['name']}", fill="#07564f", font=font_screen_title, anchor="mm")
        draw.text((x + target_w // 2, y_screen_top - 18), meta['desc'], fill="#64748b", font=font_screen_sub, anchor="mm")
        
        # Sombra suave
        shadow = Image.new("RGBA", (target_w + 24, target_h + 24), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(shadow)
        sdraw.rounded_rectangle([(6, 6), (target_w + 18, target_h + 18)], radius=36, fill=(15, 23, 42, 45))
        img.paste(shadow, (x - 9, y_screen_top - 9), shadow)
        
        # Imagen redimensionada
        screen_img = Image.open(meta['file']).convert("RGBA")
        screen_resized = screen_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Máscara de esquinas redondeadas
        mask = Image.new("L", (target_w, target_h), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.rounded_rectangle([(0, 0), (target_w, target_h)], radius=32, fill=255)
        
        img.paste(screen_resized, (x, y_screen_top), mask)
        
        # Borde exterior suave del teléfono
        draw.rounded_rectangle([(x, y_screen_top), (x + target_w, y_screen_top + target_h)], radius=32, outline="#cbd5e1", width=2)
        
        screen_rects.append((x, y_screen_top, target_w, target_h))

    # 3. RECUADROS PUNTEADOS TERRACOTA Y MARCADORES DEL 1 AL 6
    # Función auxiliar para dibujar línea discontinua / punteada
    def draw_dashed_box(draw, bbox, color="#c2410c", width=3, dash_len=14, gap_len=8):
        x0, y0, x1, y1 = bbox
        # Arriba y abajo
        for y in (y0, y1):
            cur_x = x0
            while cur_x < x1:
                end_x = min(cur_x + dash_len, x1)
                draw.line([(cur_x, y), (end_x, y)], fill=color, width=width)
                cur_x += dash_len + gap_len
        # Izquierda y derecha
        for x in (x0, x1):
            cur_y = y0
            while cur_y < y1:
                end_y = min(cur_y + dash_len, y1)
                draw.line([(x, cur_y), (x, end_y)], fill=color, width=width)
                cur_y += dash_len + gap_len

    # Función para dibujar marcador circular terracota
    def draw_marker(draw, cx, cy, num_str, r=26):
        # Sombra
        draw.ellipse([(cx - r + 2, cy - r + 2), (cx + r + 2, cy + r + 2)], fill=(0, 0, 0, 70))
        # Fondo terracota institucional #c2410c
        draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill="#c2410c", outline="#ffffff", width=3)
        # Número en blanco
        draw.text((cx, cy), num_str, fill="#ffffff", font=font_marker, anchor="mm")

    s1_x, s1_y, s1_w, s1_h = screen_rects[0]
    s2_x, s2_y, s2_w, s2_h = screen_rects[1]
    s3_x, s3_y, s3_w, s3_h = screen_rects[2]

    # --- PATRÓN 2: Tarjeta con CTA Principal («Ya la tomé») en Pantalla 1 ---
    # En pantalla C-03 (1688 total, tarjeta de dosis está entre ~28% y ~68%)
    p2_box = (s1_x + 18, s1_y + int(s1_h * 0.28), s1_x + s1_w - 18, s1_y + int(s1_h * 0.68))
    draw_dashed_box(draw, p2_box, color="#c2410c", width=4)
    draw_marker(draw, p2_box[0] - 15, p2_box[1] + 25, "2")

    # --- PATRÓN 3: Botones Secundarios con Borde («Posponer 10 min» / «No la tomé») en Pantalla 1 ---
    p3_box = (s1_x + 30, s1_y + int(s1_h * 0.69), s1_x + s1_w - 30, s1_y + int(s1_h * 0.86))
    draw_dashed_box(draw, p3_box, color="#c2410c", width=4)
    draw_marker(draw, p3_box[2] + 15, p3_box[1] + 35, "3")

    # --- PATRÓN 1: Navegación Inferior (Bottom Nav Bar) en Pantalla 1 y 3 ---
    p1_box = (s1_x + 10, s1_y + int(s1_h * 0.88), s1_x + s1_w - 10, s1_y + s1_h - 10)
    draw_dashed_box(draw, p1_box, color="#c2410c", width=4)
    draw_marker(draw, p1_box[0] - 15, p1_box[1] + 20, "1")

    # --- PATRÓN 4: Alerta / Notificación de Estado (60m sin confirmar) en Pantalla 2 ---
    p4_box = (s2_x + 18, s2_y + int(s2_h * 0.12), s2_x + s2_w - 18, s2_y + int(s2_h * 0.44))
    draw_dashed_box(draw, p4_box, color="#c2410c", width=4)
    draw_marker(draw, p4_box[0] - 15, p4_box[1] + 25, "4")

    # --- PATRÓN 6: Navegación por Fechas (Daily Stepper) en Pantalla 3 ---
    p6_box = (s3_x + 20, s3_y + int(s3_h * 0.11), s3_x + s3_w - 20, s3_y + int(s3_h * 0.23))
    draw_dashed_box(draw, p6_box, color="#c2410c", width=4)
    draw_marker(draw, p6_box[2] + 15, p6_box[1] + 25, "6")

    # --- PATRÓN 5: Lista de Tarjetas con Estados en Pantalla 3 ---
    p5_box = (s3_x + 20, s3_y + int(s3_h * 0.25), s3_x + s3_w - 20, s3_y + int(s3_h * 0.86))
    draw_dashed_box(draw, p5_box, color="#c2410c", width=4)
    draw_marker(draw, p5_box[0] - 15, p5_box[1] + 35, "5")

    # 4. TABLA INFERIOR DE REFERENCIAS (6 PATRONES DE DISEÑO)
    y_ref_top = y_screen_top + target_h + 40
    ref_h = CANVAS_H - y_ref_top - 35
    
    # Fondo de la sección de referencias
    draw.rounded_rectangle([(spacing, y_ref_top), (CANVAS_W - spacing, y_ref_top + ref_h)], radius=24, fill="#ffffff", outline="#e2e8f0", width=2)
    
    # 6 Cuadrantes de Referencia (2 filas x 3 columnas)
    col_w = (CANVAS_W - 2 * spacing - 60) // 3
    row_h = (ref_h - 40) // 2
    
    patterns = [
        {"num": "1", "title": "Navegación Inferior Fija", "desc": "Barra de 4 pestañas fijas («Hoy», «Medicinas», «Historial», «Ajustes») con iconos de 28px y texto explícito. Targets táctiles >48px; evita menús ocultos tipo hamburguesa."},
        {"num": "2", "title": "Tarjeta con CTA Principal", "desc": "Tarjeta destacada de toma activa a las 14:00 con botón primario «Ya la tomé». Contraste >7:1, altura >56px y confirmación directa en un solo toque sin pasos intermedios."},
        {"num": "3", "title": "Botones Secundarios con Borde", "desc": "Acciones secundarias «Posponer 10 min» y «No la tomé» diferenciadas con contorno. Reducen errores involuntarios manteniendo la jerarquía visual del botón principal."},
        {"num": "4", "title": "Alerta y Protocolo de Estado", "desc": "Banner de advertencia ámbar/rojo tras 60 minutos sin confirmación. Interfaz no bloqueante que activa la red de apoyo familiar (notificación a Silvana) sin dramatismo."},
        {"num": "5", "title": "Lista de Tarjetas con Estados", "desc": "Listado cronológico de tomas con badges visuales de color («Tomada a las 08:00» en verde, «No tomada» en rojo, «Pospuesta»). Microcopy directo y comprensible."},
        {"num": "6", "title": "Navegación por Fechas", "desc": "Control de navegación temporal diaria («Ayer», «Hoy», «Mañana») mediante flechas amplias. Elimina la sobrecarga cognitiva de calendarios mensuales complejos."}
    ]

    for idx, p in enumerate(patterns):
        r = idx // 3
        c = idx % 3
        rx = spacing + 20 + c * (col_w + 10)
        ry = y_ref_top + 15 + r * (row_h + 8)
        
        # Mini tarjeta de referencia
        draw.rounded_rectangle([(rx, ry), (rx + col_w, ry + row_h)], radius=14, fill="#f8fafc", outline="#cbd5e1", width=1)
        
        # Marcador circular
        draw_marker(draw, rx + 30, ry + 32, p["num"], r=18)
        
        # Título del patrón
        draw.text((rx + 60, ry + 32), p["title"], fill="#07564f", font=font_ref_title, anchor="lm")
        
        # Descripción
        # Ajuste de texto manual en 2-3 líneas
        desc_lines = []
        words = p["desc"].split()
        cur_line = ""
        for w in words:
            test_line = f"{cur_line} {w}".strip()
            # Estimación simple de ancho
            if len(test_line) * 9.5 > (col_w - 40):
                desc_lines.append(cur_line)
                cur_line = w
            else:
                cur_line = test_line
        if cur_line:
            desc_lines.append(cur_line)
            
        for l_idx, line in enumerate(desc_lines[:3]):
            draw.text((rx + 25, ry + 68 + l_idx * 24), line, fill="#334155", font=font_ref_desc, anchor="lt")

    # Guardar lámina
    out_path = "docs_assets/patrones_diseno_updated.png"
    img.save(out_path, dpi=(300, 300))
    print(f"[OK] Lámina de patrones generada en: {out_path} ({CANVAS_W}x{CANVAS_H} px, 300 DPI)")

if __name__ == "__main__":
    create_patterns_sheet()
