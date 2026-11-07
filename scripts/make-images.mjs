/**
 * Generates the typographic share image and icons in public/ by rendering HTML
 * in Playwright's Chromium. Run with `pnpm images` after changing the design.
 * The output is committed, so builds don't depend on local fonts.
 *
 * These use the organization's name as a wordmark only. No logo has been
 * supplied (docs/OPEN_ITEMS.md), so none is invented.
 */
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const colors = { cream: '#FFF8EE', ink: '#2B1D16', inkMuted: '#5E4A3E', tomato: '#B23A1E', tomatoDark: '#8F2C14', saffron: '#F2B544' };
const serif = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

const ogHtml = `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;box-sizing:border-box;background:${colors.cream};display:flex;flex-direction:column;justify-content:center;padding:0 96px;position:relative;font-family:${serif};color:${colors.ink}">
  <div style="position:absolute;top:0;left:0;right:0;height:24px;background:${colors.saffron}"></div>
  <div style="font-size:104px;font-weight:700;line-height:1.05">Creation <span style="font-weight:400;font-style:italic;color:${colors.tomatoDark}">and</span><br>Connoisseur</div>
  <div style="margin-top:40px;width:160px;height:8px;background:${colors.tomato}"></div>
</div></body></html>`;

const iconHtml = (size) => `<!doctype html><html><body style="margin:0">
<div style="width:${size}px;height:${size}px;background:${colors.tomato};display:flex;align-items:center;justify-content:center;font-family:${serif};font-weight:700;color:${colors.cream};font-size:${Math.round(size * 0.44)}px;letter-spacing:-0.02em">C&amp;C</div>
</body></html>`;

/** Wrap a PNG in a single-image .ico container (PNG-compressed ICO, supported by all current browsers). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

const browser = await chromium.launch();
try {
  const render = async (html, width, height) => {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(html);
    const png = await page.screenshot({ type: 'png' });
    await page.close();
    return png;
  };

  await writeFile('public/og-image.png', await render(ogHtml, 1200, 630));
  await writeFile('public/apple-touch-icon.png', await render(iconHtml(180), 180, 180));
  await writeFile('public/favicon.ico', pngToIco(await render(iconHtml(32), 32, 32), 32));
  console.log('Wrote public/og-image.png, public/apple-touch-icon.png, public/favicon.ico');
} finally {
  await browser.close();
}
