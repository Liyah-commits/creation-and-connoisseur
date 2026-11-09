/**
 * Generates the site icons and the share image from the logo mark (D55), by
 * rendering HTML and SVG in Playwright's Chromium. Run with `pnpm images`
 * after changing the mark, the palette or the Home hero line. The output is
 * committed, so builds don't depend on this script.
 *
 *   public/favicon.svg           the mark on a sand-50 rounded square
 *   public/favicon.ico           the same, at 32 and 16 pixels
 *   public/apple-touch-icon.png  180 pixels, the mark on sand-50
 *   public/og-image.png          1200 by 630: the mark, the wordmark and the English hero line
 *
 * Colors come from the @theme block in src/styles/global.css, the hero line
 * from content/en/pages/home.md, and the fonts from the self-hosted
 * @fontsource files, so the images match the site. The mark is drawn the
 * same way as src/components/LogoMark.astro.
 *
 * `pnpm images -- --examples` also redraws the labeled example images used by
 * the draft example entries (template test build only). They keep their
 * original look, which their alt text describes.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const css = await readFile('src/styles/global.css', 'utf8');
const theme = css.slice(css.indexOf('@theme'), css.indexOf('}', css.indexOf('@theme')));
const color = Object.fromEntries([...theme.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, hex]) => [name, hex.toUpperCase()]));
for (const name of ['sand-50', 'sandstone', 'ink', 'sage', 'coral']) {
  if (!color[name]) throw new Error(`Missing --color-${name} in src/styles/global.css`);
}

const home = await readFile('content/en/pages/home.md', 'utf8');
const heroLine = /^intro:\s*['"]?(.+?)['"]?\s*$/m.exec(home)?.[1];
if (!heroLine) throw new Error('No single-line "intro:" in content/en/pages/home.md to use as the hero line.');

const fontFace = async (family, style, file) => {
  const data = (await readFile(file)).toString('base64');
  return `@font-face{font-family:'${family}';font-style:${style};font-weight:400;src:url(data:font/woff2;base64,${data}) format('woff2');}`;
};
const fonts = [
  await fontFace('DM Serif Display', 'normal', 'node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2'),
  await fontFace('DM Serif Display', 'italic', 'node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-italic.woff2'),
].join('');

/** The mark on its own 32 by 32 grid. */
const mark = `<circle cx="16" cy="14" r="7" fill="${color.coral}"/><path d="M2 24l7-7 4 4 5-6 12 9z" fill="${color.sage}"/><rect x="2" y="25" width="28" height="3" rx="1" fill="${color.sandstone}"/>`;
/** The mark scaled 1.75 times and centered on its visible shape inside a 64 by 64 tile. */
const centeredMark = `<g transform="translate(4 1.375) scale(1.75)">${mark}</g>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="t">
  <title id="t">Creation and Connoisseur</title>
  <rect width="64" height="64" rx="12" fill="${color['sand-50']}"/>
  ${centeredMark}
</svg>
`;

const iconHtml = (size, rounded) => `<!doctype html><html><body style="margin:0;background:transparent">
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" style="display:block"><rect width="64" height="64" ${rounded ? 'rx="12"' : ''} fill="${color['sand-50']}"/>${centeredMark}</svg>
</body></html>`;

const ogHtml = `<!doctype html><html><head><style>${fonts}</style></head><body style="margin:0">
<div style="width:1200px;height:630px;box-sizing:border-box;padding:0 96px;background:${color['sand-50']};color:${color.ink};display:flex;flex-direction:column;justify-content:center">
  <div style="display:flex;align-items:center;gap:36px">
    <svg xmlns="http://www.w3.org/2000/svg" width="136" height="136" viewBox="0 0 32 32" style="flex:none">${mark}</svg>
    <div style="font-family:'DM Serif Display';font-size:88px;line-height:1.02">Creation <span style="font-style:italic;color:${color.sage}">and</span><br>Connoisseur</div>
  </div>
  <div style="margin-top:44px;height:3px;background:${color.sandstone}"></div>
  <p style="margin:40px 0 0;font-family:'DM Serif Display';font-size:46px;line-height:1.22;max-width:1000px">${heroLine}</p>
</div></body></html>`;

/** Wraps PNGs in one .ico container (PNG-compressed entries, supported by all current browsers). */
function pngsToIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ png, size }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

const browser = await chromium.launch();
try {
  const render = async (html, width, height, transparent = false) => {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: 'png', omitBackground: transparent });
    await page.close();
    return png;
  };

  await writeFile('public/favicon.svg', faviconSvg);
  await writeFile('public/favicon.ico', pngsToIco([
    { size: 32, png: await render(iconHtml(32, true), 32, 32, true) },
    { size: 16, png: await render(iconHtml(16, true), 16, 16, true) },
  ]));
  // Apple rounds the corners itself, so the touch icon is a full square.
  await writeFile('public/apple-touch-icon.png', await render(iconHtml(180, false), 180, 180));
  await writeFile('public/og-image.png', await render(ogHtml, 1200, 630));
  console.log('Wrote public/favicon.svg, public/favicon.ico (32 and 16), public/apple-touch-icon.png, public/og-image.png');

  if (process.argv.includes('--examples')) {
    // Clearly labeled example images for the draft example entries. Their original colors are kept,
    // because their alt text describes "a pattern of yellow dots".
    const exampleColors = { background: '#FFF8EE', dots: '#F2B544', label: '#2B1D16', labelText: '#FFF8EE' };
    const serif = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
    const example = (label, width, height) => `<!doctype html><html><body style="margin:0">
<div style="width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:center;background-color:${exampleColors.background};background-image:radial-gradient(circle at 25% 25%, ${exampleColors.dots} 0 14%, transparent 15%),radial-gradient(circle at 75% 75%, ${exampleColors.dots} 0 14%, transparent 15%);background-size:80px 80px">
  <div style="background:${exampleColors.label};color:${exampleColors.labelText};font:700 ${Math.round(width / 18)}px ${serif};padding:0.4em 0.8em;border-radius:12px;text-align:center">${label}</div>
</div></body></html>`;
    // Paths follow the layout Keystatic itself uses: <directory>/<slug>/<field path>/image.png
    const programImage = 'content/images/programs/en/example-program/image/value';
    const personImage = 'content/images/people/example-person-with-photo/photo/value';
    await mkdir(programImage, { recursive: true });
    await mkdir(personImage, { recursive: true });
    await writeFile(`${programImage}/image.png`, await render(example('Example image', 1200, 800), 1200, 800));
    await writeFile(`${personImage}/image.png`, await render(example('Example', 600, 600), 600, 600));
    console.log('Wrote example images in content/images/ (used only by draft example entries)');
  }
} finally {
  await browser.close();
}
