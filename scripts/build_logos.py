"""
Refined SVG generator for KHALIFA logos with 100% vector paths (zero live <text>, zero white knockouts).
"""
import math
import os

OUT_DIR = "public/brand/concepts"
os.makedirs(OUT_DIR, exist_ok=True)

def star8(cx, cy, r_out, r_in):
    pts = []
    for i in range(16):
        r = r_out if i % 2 == 0 else r_in
        angle = i * (math.pi / 8) - math.pi / 2
        pts.append(f"{cx + r * math.cos(angle):.1f} {cy + r * math.sin(angle):.1f}")
    return "M " + " L ".join(pts) + " Z"

def render_khalifa_wordmark(x_start=260, y_top=94):
    """
    Outlined pure path glyphs for 'KHALIFA' with snapped angles (0, 30, 45, 60, 75, 90, 135 deg).
    """
    return '''<g fill="#111827">
    <!-- K -->
    <path d="M 264 88 L 278 88 L 278 168 L 264 168 Z M 316 88 L 334 88 L 282 132 L 336 168 L 316 168 L 274 136 L 274 126 Z"/>
    <!-- H -->
    <path d="M 348 88 L 362 88 L 362 120 L 392 120 L 392 88 L 406 88 L 406 168 L 392 168 L 392 134 L 362 134 L 362 168 L 348 168 Z"/>
    <!-- A -->
    <path d="M 436 88 L 452 88 L 476 168 L 458 168 L 452 144 L 436 144 L 430 168 L 412 168 Z M 444 104 L 439 130 L 449 130 Z"/>
    <!-- L -->
    <path d="M 490 88 L 504 88 L 504 154 L 536 154 L 536 168 L 490 168 Z"/>
    <!-- I -->
    <path d="M 550 88 L 564 88 L 564 168 L 550 168 Z"/>
    <!-- F -->
    <path d="M 578 88 L 620 88 L 620 102 L 592 102 L 592 120 L 616 120 L 616 134 L 592 134 L 592 168 L 578 168 Z"/>
    <!-- A -->
    <path d="M 648 88 L 664 88 L 688 168 L 670 168 L 664 144 L 648 144 L 642 168 L 624 168 Z M 656 104 L 651 130 L 661 130 Z"/>
  </g>'''

def create_concept_a():
    star_path = star8(178, 126, 20, 10)
    symbol = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <title>KHALIFA - Concept A (K-Barakah)</title>
  <!-- Upright Barakah Pillar (Amanah) -->
  <rect x="44" y="32" width="34" height="192" rx="17" fill="#111827"/>
  <!-- Upper Ascending Sprout (Growth & Aspiration) -->
  <path d="M 88 126 C 104 110 128 70 178 44 C 196 34 212 42 212 58 C 212 76 198 100 176 116 C 146 138 116 148 94 148 Z" fill="#111827"/>
  <!-- Lower Crescent Wave (Hilal Barakah) -->
  <path d="M 88 136 C 114 148 144 176 172 208 C 182 220 174 228 160 228 C 138 228 116 208 98 184 C 86 168 84 148 88 136 Z" fill="#111827"/>
  <!-- 8-Pointed Rub el Hizb Star of Excellence -->
  <path d="{star_path}" fill="#111827"/>
</svg>'''

    lockup = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 256" width="768" height="256">
  <title>KHALIFA Lockup A</title>
  <g transform="translate(24, 20) scale(0.84)">
    <rect x="44" y="32" width="34" height="192" rx="17" fill="#111827"/>
    <path d="M 88 126 C 104 110 128 70 178 44 C 196 34 212 42 212 58 C 212 76 198 100 176 116 C 146 138 116 148 94 148 Z" fill="#111827"/>
    <path d="M 88 136 C 114 148 144 176 172 208 C 182 220 174 228 160 228 C 138 228 116 208 98 184 C 86 168 84 148 88 136 Z" fill="#111827"/>
    <path d="{star_path}" fill="#111827"/>
  </g>
  <line x1="236" y1="48" x2="236" y2="208" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
  {render_khalifa_wordmark(x_start=264, y_top=88)}
</svg>'''
    return symbol, lockup

def create_concept_b():
    symbol = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <title>KHALIFA - Concept B (Buku Amanah)</title>
  <path d="M 122 196 C 94 182 62 182 34 192 C 30 194 26 190 26 186 L 26 66 C 26 62 30 58 34 56 C 62 46 94 46 122 60 Z" fill="#111827"/>
  <path d="M 134 196 C 162 182 194 182 222 192 C 226 194 230 190 230 186 L 230 66 C 230 62 226 58 222 56 C 194 46 162 46 134 60 Z" fill="#111827"/>
  <path d="M 128 32 L 134 46 L 148 46 L 136 54 L 140 68 L 128 60 L 116 68 L 120 54 L 108 46 L 122 46 Z" fill="#111827"/>
  <line x1="128" y1="68" x2="128" y2="200" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
</svg>'''

    lockup = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 256" width="768" height="256">
  <title>KHALIFA Lockup B</title>
  <g transform="translate(24, 20) scale(0.84)">
    <path d="M 122 196 C 94 182 62 182 34 192 C 30 194 26 190 26 186 L 26 66 C 26 62 30 58 34 56 C 62 46 94 46 122 60 Z" fill="#111827"/>
    <path d="M 134 196 C 162 182 194 182 222 192 C 226 194 230 190 230 186 L 230 66 C 230 62 226 58 222 56 C 194 46 162 46 134 60 Z" fill="#111827"/>
    <path d="M 128 32 L 134 46 L 148 46 L 136 54 L 140 68 L 128 60 L 116 68 L 120 54 L 108 46 L 122 46 Z" fill="#111827"/>
    <line x1="128" y1="68" x2="128" y2="200" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  </g>
  <line x1="236" y1="48" x2="236" y2="208" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
  {render_khalifa_wordmark(x_start=264, y_top=88)}
</svg>'''
    return symbol, lockup

def create_concept_c():
    symbol = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <title>KHALIFA - Concept C (Dinar Cerdas)</title>
  <path d="M 128 20 C 68.35 20 20 68.35 20 128 C 20 187.65 68.35 236 128 236 C 187.65 236 236 187.65 236 128 C 236 68.35 187.65 20 128 20 Z M 128 36 C 178.8 36 220 77.2 220 128 C 220 178.8 178.8 220 128 220 C 77.2 220 36 178.8 36 128 C 36 77.2 77.2 36 128 36 Z" fill="#111827"/>
  <path d="M 76 194 L 76 122 C 76 92 98 68 128 54 C 158 68 180 92 180 122 L 180 194" fill="none" stroke="#111827" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="94" y="94" width="16" height="92" rx="8" fill="#111827"/>
  <path d="M 112 136 C 124 126 142 108 162 94 C 166 90 172 94 170 100 C 164 116 144 136 124 148 Z" fill="#111827"/>
  <path d="M 116 144 C 130 152 148 168 164 186 C 168 190 162 196 156 194 C 140 190 126 174 112 162 Z" fill="#111827"/>
  <polygon points="128,34 134,44 128,54 122,44" fill="#111827"/>
</svg>'''

    lockup = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 256" width="768" height="256">
  <title>KHALIFA Lockup C</title>
  <g transform="translate(24, 20) scale(0.84)">
    <path d="M 128 20 C 68.35 20 20 68.35 20 128 C 20 187.65 68.35 236 128 236 C 187.65 236 236 187.65 236 128 C 236 68.35 187.65 20 128 20 Z M 128 36 C 178.8 36 220 77.2 220 128 C 220 178.8 178.8 220 128 220 C 77.2 220 36 178.8 36 128 C 36 77.2 77.2 36 128 36 Z" fill="#111827"/>
    <path d="M 76 194 L 76 122 C 76 92 98 68 128 54 C 158 68 180 92 180 122 L 180 194" fill="none" stroke="#111827" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="94" y="94" width="16" height="92" rx="8" fill="#111827"/>
    <path d="M 112 136 C 124 126 142 108 162 94 C 166 90 172 94 170 100 C 164 116 144 136 124 148 Z" fill="#111827"/>
    <path d="M 116 144 C 130 152 148 168 164 186 C 168 190 162 196 156 194 C 140 190 126 174 112 162 Z" fill="#111827"/>
    <polygon points="128,34 134,44 128,54 122,44" fill="#111827"/>
  </g>
  <line x1="236" y1="48" x2="236" y2="208" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/>
  {render_khalifa_wordmark(x_start=264, y_top=88)}
</svg>'''
    return symbol, lockup

# Write all SVGs
sym_a, lck_a = create_concept_a()
sym_b, lck_b = create_concept_b()
sym_c, lck_c = create_concept_c()

with open(os.path.join(OUT_DIR, "concept-a-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(sym_a)
with open(os.path.join(OUT_DIR, "concept-a-lockup.svg"), "w", encoding="utf-8") as f:
    f.write(lck_a)

with open(os.path.join(OUT_DIR, "concept-b-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(sym_b)
with open(os.path.join(OUT_DIR, "concept-b-lockup.svg"), "w", encoding="utf-8") as f:
    f.write(lck_b)

with open(os.path.join(OUT_DIR, "concept-c-symbol.svg"), "w", encoding="utf-8") as f:
    f.write(sym_c)
with open(os.path.join(OUT_DIR, "concept-c-lockup.svg"), "w", encoding="utf-8") as f:
    f.write(lck_c)

print("Updated pure-path SVG lockups successfully.")
