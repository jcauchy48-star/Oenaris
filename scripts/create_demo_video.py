from __future__ import annotations

import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH, HEIGHT = 1280, 720
FPS = 25
SCENE_SECONDS = 7.2
SCENES = 5
TOTAL_FRAMES = int(FPS * SCENE_SECONDS * SCENES)

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
VIDEO_PATH = ASSETS / "oenaris-demo.mp4"
POSTER_PATH = ASSETS / "oenaris-demo-poster.jpg"

CREAM = "#F7F1E8"
PANEL = "#FFFAF3"
INK = "#211B18"
MUTED = "#746862"
BURGUNDY = "#7A1837"
BURGUNDY_DARK = "#4B1025"
GOLD = "#C89B3C"
SAGE = "#66816B"
LINE = "#E4D8C7"
WHITE = "#FFFDF8"


def font(size: int, bold: bool = False, serif: bool = False) -> ImageFont.FreeTypeFont:
    names = (
        ["C:/Windows/Fonts/georgiab.ttf", "C:/Windows/Fonts/georgia.ttf"]
        if serif
        else [
            "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        ]
    )
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


F12 = font(12)
F14 = font(14)
F16 = font(16)
F18 = font(18)
F18B = font(18, bold=True)
F22B = font(22, bold=True)
F26S = font(26, serif=True)
F34S = font(34, serif=True)
F46S = font(46, serif=True)
F58S = font(58, serif=True)


def ease(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], value: str, face, fill=INK, anchor=None):
    draw.text(xy, value, font=face, fill=fill, anchor=anchor)


def card(draw: ImageDraw.ImageDraw, box, fill=PANEL, outline=LINE, radius=8, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def logo(draw: ImageDraw.ImageDraw, x: int, y: int, size: int = 42, dark: bool = False):
    color = WHITE if dark else BURGUNDY
    draw.ellipse((x, y, x + size, y + size), outline=color, width=2)
    draw.ellipse((x + 9, y + 9, x + size - 9, y + size - 9), outline=GOLD, width=2)
    text(draw, (x + size // 2, y + size // 2 - 1), "O", font(int(size * 0.42), serif=True), color, "mm")


def bottle(draw: ImageDraw.ImageDraw, x: int, y: int, color=BURGUNDY, scale=1.0):
    w = int(34 * scale)
    h = int(118 * scale)
    neck = int(12 * scale)
    draw.rounded_rectangle((x, y + int(25 * scale), x + w, y + h), radius=max(3, int(8 * scale)), fill=color)
    draw.rectangle((x + (w - neck) // 2, y + int(8 * scale), x + (w + neck) // 2, y + int(32 * scale)), fill=color)
    draw.rounded_rectangle((x + (w - neck) // 2 - 2, y, x + (w + neck) // 2 + 2, y + int(11 * scale)), radius=2, fill=GOLD)
    draw.rectangle((x + 5, y + int(62 * scale), x + w - 5, y + int(87 * scale)), fill="#F1E4CF")


def shell() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, WIDTH, 70), fill=WHITE)
    draw.line((0, 69, WIDTH, 69), fill=LINE, width=1)
    logo(draw, 46, 14, 42)
    text(draw, (99, 34), "Oenaris", F26S, INK, "lm")
    text(draw, (1024, 35), "DÉMONSTRATION", F12, BURGUNDY, "lm")
    draw.rounded_rectangle((1162, 20, 1234, 50), radius=6, outline=LINE, width=1)
    text(draw, (1198, 35), "00:36", F12, MUTED, "mm")
    return image, draw


def scene_intro(progress: float) -> Image.Image:
    image, draw = shell()
    alpha = ease(min(progress / 0.3, 1))
    offset = int((1 - alpha) * 28)
    text(draw, (80, 151 + offset), "Votre cave,", F58S, BURGUNDY)
    text(draw, (80, 214 + offset), "enfin claire.", F58S, INK)
    text(draw, (84, 306 + offset), "Inventoriez, retrouvez et appréciez chaque bouteille", F22B, INK)
    text(draw, (84, 342 + offset), "dans un espace élégant conçu pour votre collection.", F18, MUTED)
    card(draw, (780, 126, 1192, 571), fill="#251D1B", outline="#251D1B")
    draw.ellipse((836, 189, 1136, 489), fill="#312522", outline="#55423C", width=2)
    bottle(draw, 961, 213, BURGUNDY, 1.75)
    draw.arc((866, 219, 1106, 459), 205, 335, fill=GOLD, width=3)
    text(draw, (986, 520), "MAISON OENARIS", F14, "#D7B86E", "mm")
    subtitle(draw, "Une vision simple et personnelle de votre collection", 0)
    return image


def field(draw, box, label, value, active=False):
    text(draw, (box[0], box[1] - 21), label.upper(), F12, MUTED)
    card(draw, box, fill=WHITE, outline=BURGUNDY if active else LINE, width=2 if active else 1)
    text(draw, (box[0] + 14, (box[1] + box[3]) // 2), value, F16, INK, "lm")


def scene_add(progress: float) -> Image.Image:
    image, draw = shell()
    text(draw, (72, 118), "Ajoutez une bouteille", F46S, INK)
    text(draw, (74, 174), "Les informations utiles d’abord. Les détails restent disponibles.", F18, MUTED)
    card(draw, (72, 218, 805, 579))
    phase = min(3, int(progress * 4.2))
    field(draw, (102, 270, 430, 320), "Domaine", "Château Belair", phase == 0)
    field(draw, (454, 270, 775, 320), "Cuvée", "Tradition", phase == 1)
    field(draw, (102, 375, 285, 425), "Millésime", "2019", phase == 2)
    field(draw, (309, 375, 507, 425), "Couleur", "Rouge", False)
    field(draw, (531, 375, 775, 425), "Emplacement", "Cave A · C3", phase == 3)
    draw.rounded_rectangle((588, 489, 775, 539), radius=7, fill=BURGUNDY)
    text(draw, (681, 514), "Ajouter à ma cave", F14, WHITE, "mm")
    card(draw, (845, 218, 1195, 579), fill="#F1E6D8")
    bottle(draw, 997, 286, BURGUNDY, 1.42)
    text(draw, (1020, 469), "CHÂTEAU BELAIR", F14, BURGUNDY, "mm")
    text(draw, (1020, 497), "2019 · ROUGE", F12, MUTED, "mm")
    subtitle(draw, "Créez une fiche complète en quelques secondes", 1)
    return image


def wine_row(draw, y, name, detail, qty, tone):
    card(draw, (330, y, 1188, y + 86), fill=WHITE)
    bottle(draw, 351, y + 11, tone, 0.54)
    text(draw, (416, y + 25), name, F18B, INK)
    text(draw, (416, y + 55), detail, F14, MUTED)
    draw.rounded_rectangle((1028, y + 25, 1149, y + 61), radius=6, fill="#F0E5DA")
    text(draw, (1088, y + 43), f"{qty} bouteilles", F12, BURGUNDY, "mm")


def scene_inventory(progress: float) -> Image.Image:
    image, draw = shell()
    draw.rectangle((0, 70, 276, HEIGHT), fill="#281F1D")
    text(draw, (46, 116), "MA CAVE", F12, "#C9BCAF")
    items = ["Tableau de bord", "Inventaire", "Conseils de cave", "Statistiques"]
    for idx, item in enumerate(items):
        y = 158 + idx * 58
        if idx == 1:
            draw.rounded_rectangle((30, y - 10, 246, y + 34), radius=6, fill=BURGUNDY)
        text(draw, (55, y + 12), item, F14, WHITE if idx == 1 else "#C9BCAF", "lm")
    text(draw, (330, 117), "Votre inventaire", F34S, INK)
    card(draw, (330, 158, 1188, 208), fill=WHITE)
    query = "saint-émilion"[: max(1, int(13 * min(progress * 1.8, 1)))]
    text(draw, (354, 183), "⌕", F22B, BURGUNDY, "lm")
    text(draw, (390, 183), query, F16, INK, "lm")
    wine_row(draw, 240, "Domaine Valombre", "Saint-Émilion Grand Cru · 2019 · Cave A", 6, BURGUNDY)
    wine_row(draw, 346, "Clos des Ormes", "Pomerol · 2018 · Cave A", 3, "#5D1B32")
    wine_row(draw, 452, "Maison d'Aurore", "Champagne · 2020 · Armoire B", 4, "#B89545")
    subtitle(draw, "Recherche, quantités et emplacement réunis au même endroit", 2)
    return image


def stat(draw, x, y, title, value, accent):
    card(draw, (x, y, x + 220, y + 116), fill=WHITE)
    draw.ellipse((x + 20, y + 20, x + 46, y + 46), fill=accent)
    text(draw, (x + 60, y + 33), title.upper(), F12, MUTED, "lm")
    text(draw, (x + 20, y + 83), value, F34S, INK, "lm")


def scene_advice(progress: float) -> Image.Image:
    image, draw = shell()
    text(draw, (72, 116), "Le bon vin, au bon moment", F46S, INK)
    text(draw, (74, 171), "Oenaris transforme vos données en conseils simples et actionnables.", F18, MUTED)
    stat(draw, 72, 220, "En cave", "128", BURGUNDY)
    stat(draw, 312, 220, "Prêtes", "24", SAGE)
    stat(draw, 552, 220, "À surveiller", "7", GOLD)
    card(draw, (812, 220, 1200, 563), fill="#2A211F", outline="#2A211F")
    text(draw, (846, 257), "CONSEIL DE CAVE", F12, "#D7B86E")
    text(draw, (846, 303), "À ouvrir bientôt", F26S, WHITE)
    draw.line((846, 344, 1164, 344), fill="#55433D", width=1)
    text(draw, (846, 381), "Domaine Valombre · 2019", F18B, WHITE)
    text(draw, (846, 419), "Sa fenêtre idéale approche.", F14, "#D8CCC2")
    text(draw, (846, 446), "Servez à 16 °C avec une viande rôtie.", F14, "#D8CCC2")
    pulse = 4 + int(4 * (0.5 + 0.5 * math.sin(progress * math.pi * 4)))
    draw.ellipse((1128 - pulse, 506 - pulse, 1128 + pulse, 506 + pulse), fill=GOLD)
    text(draw, (72, 397), "Des fenêtres de dégustation lisibles.", F18B, INK)
    text(draw, (72, 433), "Des alertes utiles, sans bruit inutile.", F18B, INK)
    text(draw, (72, 469), "Une cave qui vous aide vraiment à choisir.", F18B, INK)
    subtitle(draw, "Repérez les bouteilles prêtes à boire avant qu'il ne soit trop tard", 3)
    return image


def scene_everywhere(progress: float) -> Image.Image:
    image, draw = shell()
    text(draw, (72, 118), "Votre cave vous suit.", F46S, INK)
    text(draw, (74, 174), "Un compte Oenaris, une collection accessible sur vos appareils.", F18, MUTED)
    card(draw, (74, 227, 844, 567), fill=WHITE)
    draw.rectangle((74, 227, 844, 276), fill="#2A211F")
    text(draw, (103, 251), "OENARIS · TABLEAU DE BORD", F12, WHITE, "lm")
    stat(draw, 108, 308, "En cave", "128", BURGUNDY)
    stat(draw, 348, 308, "Favoris", "11", GOLD)
    stat(draw, 588, 308, "Prêtes", "24", SAGE)
    draw.rounded_rectangle((907, 205, 1167, 588), radius=24, fill="#211B18")
    draw.rounded_rectangle((919, 217, 1155, 576), radius=18, fill=CREAM)
    logo(draw, 944, 244, 34)
    text(draw, (992, 261), "Oenaris", F22B, INK, "lm")
    card(draw, (944, 314, 1130, 390), fill=WHITE)
    text(draw, (962, 337), "À BOIRE", F12, MUTED)
    text(draw, (962, 370), "24", F26S, BURGUNDY)
    card(draw, (944, 409, 1130, 501), fill="#2A211F", outline="#2A211F")
    text(draw, (962, 434), "CONSEIL", F12, "#D7B86E")
    text(draw, (962, 468), "Valombre 2019", F14, WHITE)
    text(draw, (962, 489), "Prêt à ouvrir", F12, "#D8CCC2")
    if progress > 0.55:
        draw.rounded_rectangle((430, 597, 850, 648), radius=7, fill=BURGUNDY)
        text(draw, (640, 622), "Créer mon espace Oenaris", F16, WHITE, "mm")
    subtitle(draw, "Commencez gratuitement et installez Oenaris sur mobile", 4)
    return image


def subtitle(draw: ImageDraw.ImageDraw, value: str, scene_index: int):
    draw.rectangle((0, 662, WIDTH, HEIGHT), fill="#211B18")
    text(draw, (72, 691), value, F16, WHITE, "lm")
    for idx in range(SCENES):
        x = 1020 + idx * 38
        draw.rounded_rectangle((x, 688, x + 25, 694), radius=3, fill=GOLD if idx == scene_index else "#655853")


SCENE_RENDERERS = [scene_intro, scene_add, scene_inventory, scene_advice, scene_everywhere]


def render_frame(frame_index: int) -> Image.Image:
    elapsed = frame_index / FPS
    scene_float = elapsed / SCENE_SECONDS
    scene_index = min(int(scene_float), SCENES - 1)
    progress = scene_float - scene_index
    current = SCENE_RENDERERS[scene_index](progress)
    fade_start = 0.88
    if progress > fade_start and scene_index < SCENES - 1:
        next_scene = SCENE_RENDERERS[scene_index + 1](0)
        blend = ease((progress - fade_start) / (1 - fade_start))
        current = Image.blend(current, next_scene, blend)
    return current


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    poster = scene_intro(1)
    poster.save(POSTER_PATH, quality=90, optimize=True, progressive=True)

    try:
        import imageio_ffmpeg
    except ImportError as error:
        raise SystemExit("Installez imageio-ffmpeg pour générer la vidéo.") from error

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [
        ffmpeg,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-r", str(FPS),
        "-i", "-",
        "-an",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "24",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(VIDEO_PATH),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None
    try:
        for frame_index in range(TOTAL_FRAMES):
            process.stdin.write(render_frame(frame_index).tobytes())
    finally:
        process.stdin.close()
    if process.wait() != 0:
        raise SystemExit("La génération de la vidéo a échoué.")
    print(f"Vidéo générée : {VIDEO_PATH}")


if __name__ == "__main__":
    main()
