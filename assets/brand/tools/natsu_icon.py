"""Natsu icon generator.

Builds the Natsu mark - an Endless Summer hydrangea head of loose, stacked sepals with the
terminal prompt in its centre - and the variants derived from it. The layout is seeded, so
the same parameters always produce the same drawing.

    python natsu_icon.py <variant> <out.svg> [key=value ...]

variants
    color    the full-colour mark on a transparent background (the master)
    mono     single-colour silhouette; petal outlines, floret eyes and the prompt are cut out
    tonal    single colour with depth in the alpha channel (light crown opaque, centre
             translucent, prompt opaque) - for UIs that tint the mark
    macos    the colour mark on a white rounded-square plate on the Apple icon grid
    square   the colour mark on a full-bleed white square (iOS / store / legacy launchers)

common keys
    preset=master|small32|small24|small16   parameter set (default master)
    scale=0.8      shrink the mark about the centre (macos/square default to 0.8)
    fill=#FFFFFF   colour for mono/tonal (default currentColor)
    any layout or colour parameter in PRESETS below, e.g. seed=12

Only the Python standard library is needed. See ../README.md for the asset pipeline.
"""
import math
import random
import sys

# ------------------------------------------------------------------ parameters
MASTER = dict(
    seed=12, rb=360.0, rlim=392.0,
    # sepal shape (fractions of a 100-unit sepal)
    mf=0.46, wf=0.40, bd=60.0, td=42.0,
    # layout: centre cluster, three rings of loose florets, filler petals, drifting petals
    nc=22, cr=62.0, ccx=-22.0, ccy=0.0, k1=6, k2=11, k3=15, rs=1.08, nf=16, pe=0.26, drift=1,
    # colour: diagonal hue h0 -> 354, radial lightness centre lc -> crown lw, rim deepening
    h0=246.0, c0=0.30, c1=0.62, lc=0.53, lw=0.80, rimk=0.10, cc0=0.125, cdrop=0.020, crim=0.018, cs=1.0,
    # petal outline, prompt stroke, prompt glow
    sop=0.35, swp=1.6, sw=30.0, gs=1.0, cursor=1, gsd=6.0, gop=0.7,
)
PRESETS = {
    'master': {},
    # Fewer, larger petals and a bigger prompt, so the flower still reads at icon-slot sizes.
    'small32': dict(seed=5, nc=12, cr=78.0, ccx=-12.0, k1=4, k2=7, k3=10, rs=1.5, nf=3, pe=0.0, drift=0,
                    c0=0.36, c1=0.66, swp=5.0, sop=0.30, sw=46.0, gs=1.55, gsd=7.0, gop=0.75),
    'small24': dict(seed=5, nc=10, cr=84.0, ccx=-10.0, k1=4, k2=6, k3=8, rs=1.65, nf=2, pe=0.0, drift=0,
                    c0=0.38, c1=0.68, swp=0.0, sop=0.0, sw=56.0, gs=1.75, gsd=8.0, gop=0.75),
    'small16': dict(seed=5, nc=8, cr=88.0, ccx=-6.0, k1=3, k2=6, k3=7, rs=1.8, nf=0, pe=0.0, drift=0,
                    c0=0.40, c1=0.70, swp=0.0, sop=0.0, sw=80.0, gs=2.0, cursor=0, gsd=8.0, gop=0.6),
}
C = 512.0


def fmt(x):
    s = ('%.2f' % x).rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def oklch(L, Cc, h):
    a, b = Cc * math.cos(math.radians(h)), Cc * math.sin(math.radians(h))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    rgb = (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
           -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
           -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)

    def enc(x):
        x = max(0.0, min(1.0, x))
        return 12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055
    return '#%02X%02X%02X' % tuple(round(enc(v) * 255) for v in rgb)


def smooth(a, b, x):
    x = max(0.0, min(1.0, (x - a) / (b - a)))
    return x * x * (3 - 2 * x)


# ------------------------------------------------------------------ sepal shape
def sepal_path(P):
    """One sepal, base at 0,0, pointing up, length 100: base -> widest -> soft tip, mirrored."""
    R, b = 100.0, 0.0
    m = b + P['mf'] * (R - b)
    w = P['wf'] * (R - b)
    L1, L2 = math.hypot(m - b, w), math.hypot(R - m, w)
    ab, at = math.radians(P['bd']), math.radians(P['td'])
    hb, h1, h2, ht = 0.42, 0.45, 0.55, 0.38
    up = [((b, 0), (b + hb * L1 * math.cos(ab), -hb * L1 * math.sin(ab)), (m - h1 * (m - b), -w), (m, -w)),
          ((m, -w), (m + h2 * (R - m), -w), (R - ht * L2 * math.cos(at), -ht * L2 * math.sin(at)), (R, 0))]
    mir = lambda p: (p[0], -p[1])
    segs = up + [(up[1][3], mir(up[1][2]), mir(up[1][1]), mir(up[1][0])),
                 (mir(up[0][3]), mir(up[0][2]), mir(up[0][1]), up[0][0])]
    to_up = lambda p: (p[1], -p[0])          # rotate the +x sepal to point up (-y)
    p0 = to_up(segs[0][0])
    d = 'M%s %s' % (fmt(p0[0]), fmt(p0[1]))
    for (_, c1, c2, p1) in segs:
        d += 'C%s %s %s %s %s %s' % tuple(map(fmt, (*to_up(c1), *to_up(c2), *to_up(p1))))
    return d + 'Z'


# ------------------------------------------------------------------ layout + colour
def layout(P):
    rnd = random.Random(P['seed'])
    RB = P['rb']

    def colour(x, y, jit=0.0):
        t = max(0.0, min(1.0, ((x - C) + (y - C)) / math.sqrt(2) / (RB * 1.05) * 0.5 + 0.5 + jit))
        r = math.hypot(x - C, y - C) / RB
        h = P['h0'] + (354 - P['h0']) * t
        crown = smooth(P['c0'], P['c1'], r)         # 0 in the centre -> 1 on the light crown
        rim = smooth(0.70, 1.05, r)                 # rim deepening so the edge holds on white
        L = P['lc'] + (P['lw'] - P['lc']) * crown - P['rimk'] * rim
        Cc = (P['cc0'] - P['cdrop'] * crown + P['crim'] * rim + 0.012 * math.sin(math.pi * t)) * P['cs']
        hc = h * crown + (272 + 34 * t) * (1 - crown)  # the centre leans indigo-violet
        return L, oklch(L, Cc, hc), oklch(max(0.25, L - 0.22), min(0.17, Cc + 0.03), hc + 4)

    petals, eyes = [], []

    def add_group(x, y, size, k, eye, z):
        base = rnd.uniform(0, 90)
        keep = list(range(4))
        rnd.shuffle(keep)
        for i in keep[:k]:
            a = base + 90 * i + rnd.uniform(-11, 11)
            L = size * rnd.uniform(0.84, 1.12)
            ox, oy = rnd.uniform(-4, 4), rnd.uniform(-4, 4)
            petals.append(dict(x=x + ox, y=y + oy, a=a, L=L, w=rnd.uniform(0.9, 1.08), z=z + rnd.uniform(-0.04, 0.04),
                               jit=rnd.uniform(-0.05, 0.05)))
        if eye:
            eyes.append((x, y, size * 0.10, z + 0.05))

    # centre cluster: short sepals in random directions; they back the prompt
    for _ in range(int(P['nc'])):
        rr = P['cr'] * math.sqrt(rnd.random())
        th = rnd.uniform(0, 2 * math.pi)
        petals.append(dict(x=C + P['ccx'] + rr * math.cos(th), y=C + P['ccy'] + rr * math.sin(th),
                           a=rnd.uniform(0, 360), L=rnd.uniform(80, 100) * max(1.0, P['gs'] * 0.8),
                           w=rnd.uniform(0.95, 1.1), z=0.02 + rnd.uniform(0, 0.06), jit=rnd.uniform(-0.03, 0.03)))
    # three rings of loosely grouped florets (groups of 4, sometimes 3 or 2 visible sepals)
    rs = P['rs']
    for cnt, rr, size, off in [(int(P['k1']), 150, 100 * rs, 8), (int(P['k2']), 244, 106 * rs, 0), (int(P['k3']), 320, 94 * rs, 5)]:
        for j in range(cnt):
            th = math.radians(off + 360 * j / cnt + rnd.uniform(-7, 7))
            r = rr + rnd.uniform(-14, 14)
            k = rnd.choices([4, 3, 2], weights=[0.66, 0.27, 0.07])[0]
            add_group(C + r * math.cos(th), C + r * math.sin(th), size * rnd.uniform(0.9, 1.1), k,
                      rnd.random() < P['pe'], r / RB)
    # loose filler petals
    for _ in range(int(P['nf'])):
        r = RB * math.sqrt(rnd.uniform(0.16, 0.86))
        th = rnd.uniform(0, 2 * math.pi)
        petals.append(dict(x=C + r * math.cos(th), y=C + r * math.sin(th), a=rnd.uniform(0, 360),
                           L=rnd.uniform(70, 96), w=rnd.uniform(0.85, 1.05),
                           z=r / RB + rnd.uniform(-0.08, 0.08), jit=rnd.uniform(-0.06, 0.06)))
    # a few petals drifting past the silhouette
    if P['drift']:
        for th_deg, dist, L in [(-40, 352, 118), (150, 348, 110), (66, 360, 92)]:
            th = math.radians(th_deg)
            petals.append(dict(x=C + dist * math.cos(th), y=C + dist * math.sin(th),
                               a=th_deg + 90 + rnd.uniform(-14, 14), L=L, w=1.0, z=1.2, jit=0.0))

    for p in petals:
        a = math.radians(p['a'])
        dx, dy = math.sin(a), -math.cos(a)
        if p['z'] < 1.1:   # keep the body inside a soft circle; drifting petals are exempt
            tip = math.hypot(p['x'] + dx * p['L'] - C, p['y'] + dy * p['L'] - C)
            if tip > P['rlim']:
                p['L'] = max(p['L'] * 0.62, p['L'] - (tip - P['rlim']))
        p['light'], p['col'], p['deep'] = colour(p['x'] + dx * p['L'] * 0.5, p['y'] + dy * p['L'] * 0.5, p['jit'])
    items = [('p', p['z'], p) for p in petals]
    for x, y, r, z in eyes:
        items.append(('e', z, (x, y, r, colour(x, y)[2])))
    items.sort(key=lambda it: -it[1])          # far (rim, drifting) first ... centre last
    return items


def prompt_paths(P):
    g = P['gs']
    chev = 'M%s %sL%s %sL%s %s' % tuple(map(fmt, (C - 66 * g, C - 46 * g, C - 22 * g, C - 2 * g, C - 66 * g, C + 42 * g)))
    curs = 'M%s %sH%s' % tuple(map(fmt, (C + 2 * g, C + 42 * g, C + 62 * g)))
    return chev, curs


# ------------------------------------------------------------------ drawing
SHEEN = '''    <!-- Paler towards the base, as real sepals are; shared by every petal. -->
    <linearGradient id="natsu-sepal-sheen" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.38"/>
      <stop offset="0.7" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>'''


def glow_filter(P):
    return (f'    <!-- Soft white outer glow around the prompt. -->\n'
            f'    <filter id="natsu-prompt-glow" x="-40%" y="-60%" width="180%" height="220%" color-interpolation-filters="sRGB">\n'
            f'      <feGaussianBlur in="SourceAlpha" stdDeviation="{fmt(P["gsd"])}" result="blur"/>\n'
            f'      <feFlood flood-color="#FFFFFF" flood-opacity="{fmt(P["gop"])}"/>\n'
            f'      <feComposite in2="blur" operator="in" result="glow"/>\n'
            f'      <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>\n'
            f'    </filter>')


def petal_transform(p):
    s = p['L'] / 100
    return s, f'rotate({fmt(p["a"])}) scale({fmt(s * p["w"])} {fmt(s)})'


def colour_mark(P):
    """defs, body for the full-colour mark."""
    defs = ['    <!-- One sepal: base at 0,0, pointing up, length 100. Every petal reuses it via transform. -->',
            f'    <path id="natsu-sepal" d="{sepal_path(P)}"/>', SHEEN, glow_filter(P)]
    body = ['  <g id="bloom">']
    for kind, _, it in layout(P):
        if kind == 'p':
            s, rt = petal_transform(it)
            stroke = (f' stroke="{it["deep"]}" stroke-opacity="{fmt(P["sop"])}" stroke-width="{fmt(P["swp"] / s)}"'
                      if P['swp'] > 0 and P['sop'] > 0 else '')
            body.append(f'    <g transform="translate({fmt(it["x"])} {fmt(it["y"])})">'
                        f'<use href="#natsu-sepal" transform="{rt}" fill="{it["col"]}"{stroke}/>'
                        f'<use href="#natsu-sepal" transform="{rt}" fill="url(#natsu-sepal-sheen)"/></g>')
        else:
            x, y, r, deep = it
            body.append(f'    <circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}" fill="{deep}"/>')
    body.append('  </g>')
    chev, curs = prompt_paths(P)
    sw = fmt(P['sw'])
    body.append('  <g id="prompt" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#natsu-prompt-glow)">')
    body.append(f'    <path d="{chev}" stroke="#FFFFFF" stroke-width="{sw}"/>')
    if P['cursor']:
        body.append(f'    <path d="{curs}" stroke="{oklch(0.80, 0.13, 356)}" stroke-width="{sw}"/>')
    body.append('  </g>')
    return defs, body


def single_colour_mark(P, tonal, fill):
    """defs, body for the mono (cut-out silhouette) or tonal (alpha depth) mark."""
    mid = 'natsu-tonal-mask' if tonal else 'natsu-mono-mask'
    cut = fmt(4.0)
    rows = [f'    <path id="natsu-sepal" d="{sepal_path(P)}"/>',
            f'    <mask id="{mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">']
    for kind, _, it in layout(P):
        if kind == 'p':
            s, rt = petal_transform(it)
            if tonal:   # light crown -> opaque, centre -> translucent
                v = 0.45 + 0.55 * max(0.0, min(1.0, (it['light'] - 0.45) / 0.37))
                g = '#%02X%02X%02X' % ((round(v * 255),) * 3)
            else:
                g = '#FFFFFF'
            rows.append(f'      <g transform="translate({fmt(it["x"])} {fmt(it["y"])})">'
                        f'<use href="#natsu-sepal" transform="{rt}" fill="{g}" stroke="#000000" stroke-width="{fmt(float(cut) / s)}"/></g>')
        else:
            x, y, r, _ = it
            rows.append(f'      <circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(r)}" fill="{"#4D4D4D" if tonal else "#000000"}"/>')
    chev, curs = prompt_paths(P)
    sw = fmt(P['sw'])
    glyph = chev + (curs if P['cursor'] else '')
    # tonal: the prompt is the most opaque part; mono: the prompt is cut out of the silhouette
    rows.append(f'      <path d="{glyph}" fill="none" stroke="{"#FFFFFF" if tonal else "#000000"}" stroke-width="{sw}" '
                'stroke-linecap="round" stroke-linejoin="round"/>')
    rows.append('    </mask>')
    body = [f'  <g id="mark" fill="{fill}">', f'    <rect width="1024" height="1024" mask="url(#{mid})"/>', '  </g>']
    return rows, body


# ------------------------------------------------------------------ documents
def header(what):
    return ('<!--\n'
            f'  Natsu - {what}\n'
            '  An Endless Summer hydrangea head of loose, stacked sepals (some still in irregular groups of four),\n'
            '  coloured along one diagonal (glacier blue -> lavender -> mist pink) and lit radially (lighter indigo\n'
            '  centre, light crown, slightly deeper rim), with a white ">" and mist-pink "_" glowing in its centre.\n'
            '  Generated by assets/brand/tools/natsu_icon.py - edit the generator, not this file. Spec: assets/brand/README.md\n'
            '-->')


def scaled(body, k):
    if abs(k - 1) < 1e-9:
        return body
    return [f'  <g transform="translate(512 512) scale({fmt(k)}) translate(-512 -512)">'] + ['  ' + b for b in body] + ['  </g>']


def document(variant, P, scale, fill):
    if variant in ('color', 'macos', 'square'):
        defs, body = colour_mark(P)
    else:
        defs, body = single_colour_mark(P, variant == 'tonal', fill)
    what = {'color': 'mark, full colour (transparent background)',
            'mono': 'mark, single colour with cut-outs',
            'tonal': 'mark, single colour with depth in the alpha channel',
            'macos': 'app icon on the Apple grid (white rounded-square plate)',
            'square': 'app icon on a full-bleed white square'}[variant]
    if P is not PRESETS_RESOLVED['master']:
        what += f' - {P["_name"]} preset'
    under = []
    if variant == 'macos':
        defs.append('    <filter id="natsu-plate-shadow" x="-10%" y="-10%" width="120%" height="126%" color-interpolation-filters="sRGB">\n'
                    '      <feGaussianBlur in="SourceAlpha" stdDeviation="14"/>\n'
                    '      <feOffset dy="10" result="shadow"/>\n'
                    '      <feFlood flood-color="#000000" flood-opacity="0.22"/>\n'
                    '      <feComposite in2="shadow" operator="in"/>\n'
                    '      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>\n'
                    '    </filter>')
        under = ['  <g id="plate">',
                 '    <rect x="100" y="100" width="824" height="824" rx="185" fill="#FFFFFF" filter="url(#natsu-plate-shadow)"/>',
                 '  </g>']
        scale = scale if scale else 0.80
    elif variant == 'square':
        under = ['  <g id="plate">', '    <rect width="1024" height="1024" fill="#FFFFFF"/>', '  </g>']
        scale = scale if scale else 0.80
    out = ['<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">',
           header(what), '  <title>Natsu</title>', '  <defs>'] + defs + ['  </defs>'] + under + scaled(body, scale or 1.0) + ['</svg>', '']
    return '\n'.join(out)


def resolve(name, overrides):
    P = dict(MASTER)
    P.update(PRESETS[name])
    for k, v in overrides.items():
        P[k] = type(MASTER[k])(float(v)) if isinstance(MASTER.get(k), (int, float)) and not isinstance(MASTER.get(k), bool) else v
    P['_name'] = name
    return P


PRESETS_RESOLVED = {'master': resolve('master', {})}


def main(argv):
    if len(argv) < 3 or argv[1] not in ('color', 'mono', 'tonal', 'macos', 'square'):
        sys.exit(__doc__)
    variant, out = argv[1], argv[2]
    kv = dict(a.split('=', 1) for a in argv[3:])
    preset = kv.pop('preset', 'master')
    scale = float(kv.pop('scale')) if 'scale' in kv else None
    fill = kv.pop('fill', 'currentColor')
    P = PRESETS_RESOLVED['master'] if preset == 'master' and not kv else resolve(preset, kv)
    svg = document(variant, P, scale, fill)
    with open(out, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(svg)


if __name__ == '__main__':
    main(sys.argv)
