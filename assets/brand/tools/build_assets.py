"""Regenerate every Natsu icon asset in the repository from the generator.

    python assets/brand/tools/build_assets.py            # from the repository root

Needs Python 3 with Pillow, and the repo's node_modules (rasterising goes through
`npx tauri icon`, i.e. resvg - the same renderer Tauri and GPUI use).

What it writes is listed in assets/brand/README.md. It cannot rebuild
src-tauri/macos/Assets.car - that needs Xcode's actool on macOS (see the README).
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(BRAND))
GEN = os.path.join(HERE, 'natsu_icon.py')
TMP = tempfile.mkdtemp(prefix='natsu-icons-')


def rel(*parts):
    return os.path.join(ROOT, *parts)


def generate(variant, out, **kv):
    subprocess.run([sys.executable, GEN, variant, out] + [f'{k}={v}' for k, v in kv.items()], check=True)
    return out


def tmp_svg(name, variant, **kv):
    return generate(variant, os.path.join(TMP, name + '.svg'), **kv)


def render(svg, *sizes):
    """Rasterise an SVG at square sizes with resvg (via `tauri icon -p`); returns {size: Image}."""
    out = os.path.join(TMP, 'r-' + os.path.splitext(os.path.basename(svg))[0])
    shutil.rmtree(out, ignore_errors=True)
    cmd = ['npx', 'tauri', 'icon', svg, '-o', out, '-p', ','.join(str(s) for s in sizes)]
    subprocess.run(cmd, cwd=ROOT, check=True, shell=(os.name == 'nt'),
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return {s: Image.open(os.path.join(out, f'{s}x{s}.png')).convert('RGBA') for s in sizes}


def save(img, *path):
    dest = rel(*path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    img.save(dest)
    print('  wrote', os.path.relpath(dest, ROOT).replace(os.sep, '/'), img.size)


def icon_json(layer):
    """Icon Composer bundle: white fill, one colour layer, no glass (keeps the petals' colour exact)."""
    return {
        'fill': {'solid': 'extended-srgb:1.00000,1.00000,1.00000,1.00000'},
        'groups': [{
            'layers': [{
                'blend-mode': 'normal', 'fill': 'none', 'glass': False, 'hidden': False,
                'image-name': layer, 'name': os.path.splitext(layer)[0], 'opacity': 1,
                'position': {'scale': 1, 'translation-in-points': [0, 0]},
            }],
            'shadow': {'kind': 'neutral', 'opacity': 0.5},
            'translucency': {'enabled': False, 'value': 0.5},
        }],
        'supported-platforms': {'circles': ['watchOS'], 'squares': 'shared'},
    }


def write_icon_json(path, layer):
    text = json.dumps(icon_json(layer), indent=2).replace('": ', '" : ')
    with open(rel(*path), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(text + '\n')
    print('  wrote', '/'.join(path))


def font(size):
    for name in ('seguisb.ttf', 'segoeuib.ttf', 'DejaVuSans-Bold.ttf', 'Arial Bold.ttf', 'Helvetica.ttc'):
        for base in ('C:/Windows/Fonts', '/usr/share/fonts/truetype/dejavu', '/Library/Fonts', '/System/Library/Fonts'):
            p = os.path.join(base, name)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    return ImageFont.load_default(size)


def main():
    print('SVG sources -> assets/brand/')
    master = generate('color', os.path.join(BRAND, 'natsu-mark.svg'))
    s32 = generate('color', os.path.join(BRAND, 'natsu-mark-32.svg'), preset='small32')
    s24 = generate('color', os.path.join(BRAND, 'natsu-mark-24.svg'), preset='small24')
    s16 = generate('color', os.path.join(BRAND, 'natsu-mark-16.svg'), preset='small16')
    generate('mono', os.path.join(BRAND, 'natsu-mark-mono.svg'))
    generate('tonal', os.path.join(BRAND, 'natsu-mark-tonal.svg'))
    macos = generate('macos', os.path.join(BRAND, 'natsu-app-icon-macos.svg'))
    square = generate('square', os.path.join(BRAND, 'natsu-app-icon-square.svg'))

    print('rasterising (resvg)')
    big = render(master, 64, 71, 89, 107, 128, 142, 150, 256, 284, 310, 456, 1024)
    r32 = render(s32, 30, 32, 44, 48, 50)
    r24 = render(s24, 24)
    r16 = render(s16, 16)
    layer = render(tmp_svg('layer', 'color', scale=0.8), 1024)[1024]               # Icon Composer layer
    fg = render(tmp_svg('adaptive-fg', 'color', scale=0.72), 512)[512]            # Android adaptive fg
    mono_w = render(tmp_svg('mono-white', 'mono', fill='#FFFFFF', scale=0.72), 432)[432]
    tonal_w = render(tmp_svg('tonal-white', 'tonal', fill='#FFFFFF'), 512, 1024)
    tonal_k = render(tmp_svg('tonal-black', 'tonal', fill='#000000'), 512)[512]
    template = render(tmp_svg('template', 'mono', preset='small24', fill='#FFFFFF', scale=0.92), 1024)[1024]
    sq = render(square, 1024)[1024]

    print('Tauri desktop -> src-tauri/icons/')
    save(r32[32], 'src-tauri', 'icons', '32x32.png')
    save(big[128], 'src-tauri', 'icons', '128x128.png')
    save(big[256], 'src-tauri', 'icons', '128x128@2x.png')
    save(big[256], 'src-tauri', 'icons', 'icon.png')
    for s in (30, 44):
        save(r32[s], 'src-tauri', 'icons', f'Square{s}x{s}Logo.png')
    for s in (71, 89, 107, 142, 150, 284, 310):
        save(big[s], 'src-tauri', 'icons', f'Square{s}x{s}Logo.png')
    save(r32[50], 'src-tauri', 'icons', 'StoreLogo.png')
    # .ico: hand-tuned small presets for the small slots, the master above 48 px
    frames = [r16[16], r24[24], r32[32], r32[48], big[64], big[256]]
    frames[-1].save(rel('src-tauri', 'icons', 'icon.ico'), format='ICO', sizes=[f.size for f in frames],
                    append_images=frames[:-1])
    print('  wrote src-tauri/icons/icon.ico', [f.size[0] for f in frames])
    out = os.path.join(TMP, 'icns')
    subprocess.run(['npx', 'tauri', 'icon', macos, '-o', out], cwd=ROOT, check=True, shell=(os.name == 'nt'),
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    shutil.copyfile(os.path.join(out, 'icon.icns'), rel('src-tauri', 'icons', 'icon.icns'))
    print('  wrote src-tauri/icons/icon.icns (from natsu-app-icon-macos.svg)')
    # NSIS welcome/finish sidebar, 164 x 314, 24-bit BMP
    side = Image.new('RGB', (164, 314))
    top, bottom = (238, 243, 255), (252, 239, 246)
    for y in range(314):
        k = y / 313
        ImageDraw.Draw(side).line([(0, y), (163, y)], fill=tuple(round(a + (b - a) * k) for a, b in zip(top, bottom)))
    mark = render(master, 132)[132]
    side.paste(mark, ((164 - 132) // 2, 78), mark)
    d = ImageDraw.Draw(side)
    f = font(24)
    w = d.textlength('Natsu', font=f)
    d.text(((164 - w) / 2, 222), 'Natsu', font=f, fill=(58, 50, 112))
    side.save(rel('src-tauri', 'icons', 'installer-sidebar.bmp'))
    print('  wrote src-tauri/icons/installer-sidebar.bmp', side.size)

    print('macOS Icon Composer bundle -> src-tauri/macos/AppIcon.icon/')
    save(layer, 'src-tauri', 'macos', 'AppIcon.icon', 'Assets', 'natsu-mark.png')
    # icon.png stays a white single-colour mark: the menu-bar code (mono_chat.rs, monos/status.rs)
    # reads it as a template image. It is not referenced by icon.json.
    save(template, 'src-tauri', 'macos', 'AppIcon.icon', 'Assets', 'icon.png')
    write_icon_json(('src-tauri', 'macos', 'AppIcon.icon', 'icon.json'), 'natsu-mark.png')

    print('web + native app logo')
    save(big[1024], 'public', 'natsu.png')
    save(big[1024], 'crates', 'natsu-gpui', 'assets', 'natsu.png')

    print('mobile -> mobile/assets/')
    save(sq, 'mobile', 'assets', 'images', 'icon.png')
    save(fg, 'mobile', 'assets', 'images', 'android-icon-foreground.png')
    save(Image.new('RGBA', (512, 512), (255, 255, 255, 255)), 'mobile', 'assets', 'images', 'android-icon-background.png')
    save(mono_w, 'mobile', 'assets', 'images', 'android-icon-monochrome.png')
    save(r32[48], 'mobile', 'assets', 'images', 'favicon.png')
    save(tonal_w[1024], 'mobile', 'assets', 'images', 'natsu-mark.png')
    save(tonal_k, 'mobile', 'assets', 'images', 'natsu-mark-black.png')
    inv = Image.new('RGBA', (512, 512), (255, 255, 255, 0))
    inv.putalpha(tonal_w[512].getchannel('A').point(lambda a: 255 - a))
    save(inv, 'mobile', 'assets', 'images', 'natsu-mark-inverse.png')
    save(big[456], 'mobile', 'assets', 'images', 'splash-icon.png')
    save(layer, 'mobile', 'assets', 'app.icon', 'Assets', 'icon.png')
    write_icon_json(('mobile', 'assets', 'app.icon', 'icon.json'), 'icon.png')

    shutil.rmtree(TMP, ignore_errors=True)
    print('done. Not rebuilt: src-tauri/macos/Assets.car (needs actool on macOS, see assets/brand/README.md)')


if __name__ == '__main__':
    main()
